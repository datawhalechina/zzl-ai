
const BaseController = require('egg').BaseController

const currServiceName = 'job'
/**
 * @Controller
 */
class JobController extends BaseController {
  get modelName () {
    return 'Job'
  }

  get serviceName () {
    return currServiceName
  }

  /**
 * @Summary 获取所有职位
 * @Description 获取所有职位
 * @Router get /job
 * @Response 200 job  获取所有职位成功
 */
  async index () {
    this.success(await this.service[currServiceName].list())
  }

  /**
  * @Summary 分页获取职位
  * @Description 分页获取职位
  * @Router post /job/page/
  * @Request body pageJobsRequest *body
  * @Response 200 job  获取所有职位成功
  */
  async page () {
    this.validatePageParam('body')
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
    const config = { pageNo, pageSize, where }
    const res = await this.service[currServiceName].pagination(config)
    if (res.count) {
      this.success(res)
    } else {
      this.failMsg(`未找到第 ${pageNo} 页的职位信息`)
    }
  }

  /**
   * @Summary 新增职位
   * @Description 新增职位信息
   * @Router post /job
   * @Request body createJobRequest *body
   * @Response 200 defaultBaseResponse 新增职位成功
   */
  async create () {
    const { ctx } = this

    const {
      state,
      name,
      functionId,
      buId,
      description,
      responsibility
    } = ctx.request.body

    // 参数校验
    ctx.validate(ctx.rule.createJobRequest, ctx.request.body)

    const userId = ctx.user?.id || 1

    // 保存数据
    const res = await ctx.service[currServiceName].create({
      state,
      name,
      buId,
      functionId,
      description,
      responsibility,
      userId
    })

    return res ? this.success({ id: res.id }) : this.failMsg(`已存在职位 ${name}`)
  }

  /**
   * @Summary 获取指定职位
   * @Description 根据 id 获取职位信息
   * @Router get /job/{id}
   * @Request path integer id 标识
   * @Response 200 job  获取指定职位信息成功
   */
  async show () {
    this.validatePk()
    const { ctx } = this
    const res = await this.find(ctx.params.id)
    res && this.success(res)
  }

  /**
   * @Summary 查找职位
   * @Description 查找职位信息
   * @Router post /job/find
   * @Request body updateJobRequest *body
   * @Response 200 job  查找职位成功
   */
  async findByParam () {
    const { ctx } = this
    const {
      state,
      name,
      functionId,
      buId,
      description,
      responsibility
    } = ctx.request.body

    // 参数校验
    ctx.validate(ctx.rule.updateJobRequest, ctx.request.body)

    const where = this.formatOptions({
      state,
      name,
      buId,
      functionId,
      description,
      responsibility
      // userId
    })
    // 查找职位数据
    const res = await ctx.service[currServiceName].list({ where })

    return res ? this.success(res) : this.failMsg(`职位 ${name} 未找到`)
  }

  /**
  * @Summary 更新职位职责和描述
  * @Description 根据 id 修改职位信息
  * @Router put /job/{id}
  * @Request path integer id 标识
  * @Request body updateJobRequest *body
  * @Response 200 defaultBaseResponse 修改指定职位成功
  */
  async update () {
    this.validatePk()
    const { ctx } = this
    const id = ctx.params.id
    const Job = await this.find(id) // 职位ID
    if (Job) {
      ctx.validate(ctx.rule.createJobRequest)
      const {
        description, // 职位描述
        responsibility, // 职位职能
        name, // 职位名称
        functionId, // 职能外键
        buId // bu外键
      } = ctx.request.body
      const userId = ctx.user?.id || 1
      await this.service[currServiceName].modelUpdateData({
        model: Job,
        data: {
          description,
          responsibility,
          name,
          functionId,
          buId,
          userId
        }
      })
      this.success({ id })
    }
  }

  /**
  * @Summary 删除指定职位
  * @Description 根据 id 删除职位信息
  * @Router delete /job/{id}
  * @Request path integer id 标识，可以用逗号隔开
  * @Response 200 defaultResponse 删除指定职位成功
  */
  async destroy () {
    this.validatePk()
    const id = this.ctx.params.id
    const state = await this.service[currServiceName].destroy({ where: { id: id.split(',') } })
    state && this.successMsg(`删除职位${this.ctx.params.id}成功`)
  }
}

module.exports = JobController
