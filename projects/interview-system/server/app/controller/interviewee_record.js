
const BaseController = require('egg').BaseController

const currServiceName = 'intervieweeRecord'
/**
 * @Controller
 */
class IntervieweeRecordController extends BaseController {
  get modelName () {
    return 'IntervieweeRecord'
  }

  get serviceName () {
    return currServiceName
  }

  /**
 * @Summary 获取所有面试记录
 * @Description 获取所有面试记录
 * @Router get /intervieweeRecord
 * @Response 200 interviewee RecordJoinResponse 获取所有面试记录成功
 */
  async index () {
    this.success(await this.service[currServiceName].list())
  }

  /**
  * @Summary 分页获取面试记录
  * @Description 分页获取面试记录
  * @Router post /intervieweeRecord/page/
  * @Request query integer pageNo 页面数
  * @Request query integer pageSize 页面条数
  * @Response 200 interviewee RecordJoinResponse 获取所有面试记录成功
  */
  async page () {
    this.validatePageParam()
    const { ctx } = this
    const {
      // 默认第一页
      pageNo = 1,
      // 默认每页10条记录
      pageSize = 10,
      ...restParams
    } = ctx.request.body
    const where = this.formatOptions({
      ...restParams
    })
    const config = {
      pageNo, pageSize, where
    }
    const res = await this.service[currServiceName].pagination(config)
    if (res.count) {
      this.success(res)
    } else {
      this.failMsg(`未找到第 ${pageNo} 页的面试记录信息`)
    }
  }

  /**
   * @Summary 获取指定面试记录
   * @Description 根据 id 获取面试记录信息
   * @Router get /intervieweeRecord/{id}
   * @Request path integer id 标识
   * @Response 200 interviewee RecordJoinResponse 获取指定面试记录信息成功
   */
  async show () {
    const { ctx } = this
    this.validatePk()
    const res = await this.find(ctx.params.id)
    res && this.success(res)
  }

  /**
   * @Summary 获取指定面试记录
   * @Description 根据 id 获取面试记录信息
   * @Router get /intervieweeRecord/steps/{intervieweeId}
   * @Request path integer intervieweeId 标识
   * @Response 200 interviewee RecordProgressResponse 获取指定面试者历史记录成功
   */
  async allProgress () {
    const { ctx } = this
    const res = await this.service[currServiceName].allProgress(ctx.params.intervieweeId)
    res && this.success(res)
  }

  async checkExist ({ intervieweeId, viewerId, step, needStepExist = false }) {
    let isExist = await this.service.interviewee.exist({ id: intervieweeId })
    if (!isExist) {
      return this.failMsg(`${intervieweeId} 候选人简历记录不存在`)
    }
    isExist = await this.service.user.exist({ id: viewerId })
    if (!isExist) {
      return this.failMsg(`${intervieweeId} 面试官${step} 不存在`)
    }
    // 同一个流程一天同一流程内不能重复提交
    const findExistConditin = { intervieweeId, step }
    !needStepExist && (findExistConditin.createdAt = this.service[currServiceName].formatDay())
    isExist = await this.service[currServiceName].exist(findExistConditin)
    if (needStepExist && !isExist) {
      return this.failMsg(`${intervieweeId} 候选人${step} 流程不存在`)
    } else if (!needStepExist && isExist) {
      return this.failMsg(`${intervieweeId} 候选人${step} 流程已存在`)
    }
    return true
  }

  /**
 * @Summary 新增面试记录基础信息
 * @Description 新增面试记录信息
 * @Router post /intervieweeRecord
 * @Request body createIntervieweeRecordRequest *body
 * @Response 200 defaultBaseResponse 新增面试记录成功
 */
  async create () {
    const { ctx } = this
    ctx.validate(ctx.rule.createIntervieweeRecordRequest)
    const {
      viewerId,
      viewerName,
      intervieweeId,
      intervieweeName,
      step,
      stepName,
      comment
    } = ctx.request.body
    const isExist = await this.checkExist({ intervieweeId, viewerId, step, needStepExist: false })
    if (isExist !== true) {
      return
    }
    const res = await this.service[currServiceName].create({
      viewerName,
      viewerId,
      intervieweeId,
      intervieweeName,
      step: step || 1,
      stepName,
      state: 0,
      comment
    })

    res && this.success({ id: res.id })
  }

  /**
   * @Summary 修改指定面试记录
   * @Description 根据 id 修改面试记录信息
   * @Router put /intervieweeRecord/{id}
   * @Request path integer id 标识
   * @Request body updateIntervieweeRecordRequest *body
   * @Response 200 defaultBaseResponse 修改指定面试记录成功
   */
  async update (needCheckExist = true) {
    const { ctx } = this
    this.validatePk()
    const id = ctx.params.id
    ctx.validate(ctx.rule.updateIntervieweeRecordRequest)
    const {
      state,
      comment,
      type
    } = ctx.request.body
    const data = {
      state,
      comment,
      type
    }
    if (needCheckExist) {
      const IntervieweeRecord = await this.find(id)
      if (!IntervieweeRecord) {
        return
      }
      await this.service[currServiceName].modelUpdateData({
        model: IntervieweeRecord,
        data
      })
      this.success({ id })
    } else {
      await this.service[currServiceName].update(
        data, { where: { id } })
      return true
    }
  }

  /**
   * @Summary 删除指定面试记录
   * @Description 根据 id 删除面试记录信息
   * @Router delete /intervieweeRecord/{id}
   * @Request path integer id 标识
   * @Request query integer intervieweeId 面试者标识
   * @Response 200 defaultResponse 删除指定面试记录成功
   */
  async destroy () {
    this.validatePk()
    const state = await this.service[currServiceName].destroy(false)
    state && this.successMsg(`删除面试记录${this.ctx.params.id}成功`)
  }

  /**
  * @Summary 面试流程跳转记录
  * @Description 面试流程跳转到下一步记录
  * @Router post /intervieweeRecord/next/{id}
  * @Request path integer id 标识
  * @Request body nextIntervieweeRecordRequest *body
  * @Response 200 defaultResponse 面试流程跳转记录成功
  */
  async nextProgress () {
    const { ctx } = this
    ctx.validate(ctx.rule.nextIntervieweeRecordRequest)
    const {
      viewerId,
      viewerName,
      intervieweeId,
      intervieweeName,
      step,
      stepName,
      comment,
      isSuccess
    } = this.ctx.request.body
    const isExist = await this.checkExist({ intervieweeId, viewerId, step, needStepExist: true })
    if (isExist !== true) {
      return
    }
    let res = comment && await this.update(false)
    if (!res) {
      this.failMsg('保存失败')
    } else {
      res = await this.service[currServiceName].create({
        viewerId,
        viewerName,
        intervieweeId,
        intervieweeName,
        step: step + 1,
        stepName,
        state: isSuccess ? 1 : 0,
        isSuccess
      })
      res && this.successMsg('提交成功')
    }
  }
}

module.exports = IntervieweeRecordController
