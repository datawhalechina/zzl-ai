const BaseController = require('egg').BaseController
const path = require('path')
const currServiceName = 'interviewee'
/**
 * @Controller
 */
class IntervieweeController extends BaseController {
  get modelName () {
    return 'Interviewee'
  }

  get serviceName () {
    return currServiceName
  }

  /**
   * @Summary 获取所有候选人
   * @Description 获取所有候选人
   * @Router get /interviewee
   * @Response 200 interviewee JoinResponse 获取所有候选人成功
   */
  async index () {
    this.success(await this.service[currServiceName].list())
  }

  /**
  * @Summary 分页获取候选人
  * @Description 分页获取候选人
  * @Router post /interviewee/page/
  * @Request body pageIntervieweeRequest body*
  * @Response 200 interviewee JoinResponse 获取所有候选人成功
  */
  async page () {
    const { ctx } = this
    const {
      // 默认第一页
      pageNo = 1,
      // 默认每页10条记录
      pageSize = 10,
      status,
      ...restParams
    } = ctx.request.body
    const where = this.formatOptions({
      ...restParams
    })
    status !== undefined && (where.status = status)
    const config = { pageNo, pageSize, where }
    ctx.validate(ctx.rule.pageIntervieweeRequest)
    const res = await this.service[currServiceName].pagination(config)
    if (res.count) {
      this.success(res)
    } else {
      this.failMsg(`未找到第 ${pageNo} 页的候选人信息`)
    }
  }

  /**
   * @Summary 获取指定候选人
   * @Description 根据 id 获取候选人信息
   * @Router get /interviewee/{id}
   * @Request path integer id 标识
   * @Response 200 interviewee JoinResponse 获取指定候选人信息成功
   */
  async show () {
    this.validatePk()
    const { ctx } = this
    const res = await this.find(ctx.params.id)
    res && this.success(res)
  }

  /**
 * @summary 新增候选人
 * @description 新增候选人
 * @router post /interviewee/upload
 * @request formData string *name 候选人姓名
 * @request formData string *phone 候选人电话号码
 * @request formData string *email 候选人电子邮箱
 * @request formData string *address 候选人地址
 * @request formData string *education 候选人学历,一般为 高中,大专,本科,研究生,博士,其他
 * @request formData integer *type 招聘类型, 0 社招 1 校招,默认 0
 * @request formData integer *isInternship 是否实习 0 试用 1 实习,默认 0
 * @request formData integer *jobId 推荐岗位外键
 * @request formData string *reason 推荐理由
 * @request formData string note 推荐备注
 * @request formData file *file
 * @response 200 defaultBaseResponse 更新成功
 */
  async upload () {
    const { ctx } = this
    const resume = await ctx.getFileStream()
    const extname = path.extname(resume.filename).toLowerCase()
    if (extname !== '.pdf') {
      this.failMsg('简历上传类型错误，只支持 pdf 文件')
      return
    }

    ctx.validate(ctx.rule.createIntervieweeRequest, resume.fields)
    const currUser = ctx.user || {}

    // 0 外部猎头 1 面试官 2 部门经理  3 超级管理者
    const channel = currUser.roleType > 0 ? 1 : 0
    const {
      name,
      phone,
      email,
      address,
      education,
      type,
      isInternship,
      jobId,
      reason,
      note
    } = resume.fields

    const isExist = await this.service[currServiceName].exist({ phone })
    const excuFn = isExist ? 'update' : 'create'
    isExist && this.ctx.info(`${phone} 推荐记录已存在`)
    const res = await this.service[currServiceName][excuFn]({
      name,
      phone,
      email,
      address,
      education,
      type,
      isInternship,
      jobId,
      reason,
      note,
      channel,
      status: '',
      state: 1
    }, resume)
    this.success({ id: res ? res.id : 1 })
  }

  /**
   * @Summary 修改指定候选人
   * @Description 根据 id 修改候选人信息
   * @Router put /interviewee/{id}
   * @Request path integer id 标识
   * @Request body updateIntervieweeRequest body*
   * @Response 200 defaultBaseResponse 修改指定候选人成功
   */
  async update () {
    const { ctx } = this
    this.validatePk()
    const id = ctx.params.id
    const Interviewee = await this.find(id)
    if (Interviewee) {
      ctx.validate(ctx.rule.updateIntervieweeRequest)

      const {
        reason,
        note,
        status,
        state,
        viewerId,
        recommenderId
      } = ctx.request.body

      // const transaction = await this.model.transaction()
      await this.service[currServiceName].modelUpdateData({
        model: Interviewee,
        data: {
          reason,
          note,
          status,
          state,
          viewerId,
          recommenderId
        }
      })
      this.success({ id })
    }
  }

  /**
   * @Summary 删除指定候选人
   * @Description 根据 id 删除候选人信息
   * @Router delete /interviewee/{id}
   * @Request path integer id 标识，可以用逗号隔开
   * @Response 200 defaultResponse 删除指定候选人成功
   */
  async destroy () {
    const id = this.ctx.params.id
    const state = await this.service[currServiceName].destroy({ where: { id: id.split(',') } })
    state && this.successMsg(`删除候选人${this.ctx.params.id}成功`)
  }
}

module.exports = IntervieweeController
