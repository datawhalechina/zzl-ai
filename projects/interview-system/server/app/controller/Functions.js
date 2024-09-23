
const BaseController = require('egg').BaseController

const currServiceName = 'functions'
/**
 * @Controller
 */
class FunctionsController extends BaseController {
  get modelName () {
    return 'Functions'
  }

  get serviceName () {
    return currServiceName
  }

  /**
   * @Summary 获取所有岗位
   * @Description 获取所有岗位
   * @Router get /functions
   * @Response 200 functions  获取所有岗位成功
   */
  async index () {
    this.success(await this.service[currServiceName].list())
  }

  /**
  * @Summary 分页获取岗位
  * @Description 分页获取岗位
  * @Router post /functions/page/
  * @Request body pageFnsRequest *body
  * @Response 200 functions  获取所有岗位成功
  */
  async page () {
    const { ctx } = this
    const {
      // 默认第一页
      pageNo = 1,
      // 默认每页10条记录
      pageSize = 10,
      ...restParam
    } = ctx.request.body
    const where = this.formatOptions({
      ...restParam
    })
    const config = { pageNo, pageSize, where }
    ctx.validate(ctx.rule.pageFnsRequest)
    const res = await this.service[currServiceName].pagination(config)
    if (res.count) {
      this.success(res)
    } else {
      this.failMsg(`未找到第 ${pageNo} 页的岗位信息`)
    }
  }

  /**
   * @Summary 获取指定岗位
   * @Description 根据 id 获取岗位信息
   * @Router get /functions/{id}
   * @Request path integer id 标识
   * @Response 200 functions  获取指定岗位信息成功
   */
  async show () {
    this.validatePk()
    const { ctx } = this
    const res = await this.find(ctx.params.id)
    res && this.success(res)
  }

  /**
   * @Summary 新增岗位
   * @Description 新增岗位信息
   * @Router post /functions
   * @Request body createFnsRequest *body
   * @Response 200 defaultBaseResponse 新增岗位成功
   */
  async create () {
    const { ctx } = this
    ctx.validate(ctx.rule.createFnsRequest)
    const { name, buId } = ctx.request.body
    const res = await this.service[currServiceName].create({ name, buId })
    this.success({ id: res.id })
  }

  /**
   * @Summary 修改指定岗位
   * @Description 根据 id 修改岗位信息
   * @Router put /functions/{id}
   * @Request path integer id 标识
   * @Request body updateFnsRequest *body
   * @Response 200 defaultBaseResponse 修改指定岗位成功
   */
  async update () {
    this.validatePk()
    const { ctx } = this
    const id = ctx.params.id
    const Fns = await this.find(id)
    if (Fns) {
      ctx.validate(ctx.rule.updateFnsRequest)
      const { name, buId } = ctx.request.body
      await this.service[currServiceName].modelUpdateData({ model: Fns, data: { name, buId } })
      this.success({ id })
    }
  }

  /**
   * @Summary 删除指定岗位
   * @Description 根据 id 删除岗位信息
   * @Router delete /functions/{id}
   * @Request path integer id 标识，可以用逗号隔开
   * @Response 200 defaultResponse 删除指定岗位成功
   */
  async destroy () {
    this.validatePk()
    const id = this.ctx.params.id
    const state = await this.service[currServiceName].destroy({ where: { id: id.split(',') } })
    state && this.successMsg(`删除岗位${this.ctx.params.id}成功`)
  }

  /**
   * @Summary 获取指定岗位所有岗位
   * @Description 根据 buId 获取岗位信息
   * @Router get /functions/bu/{buId}
   * @Request path integer buId 标识
   * @Response 200 functions  获取指定岗位所有岗位成功
   */
  async getDetailByBuId () {
    const { ctx } = this
    ctx.validate(ctx.rule.getFnsBuRequest, ctx.params)
    const buId = ctx.params.buId
    const table = await this.service[currServiceName].findAllByBuId(buId)
    this.checkFindData(table, `${buId}岗位无岗位记录`)
  }
}

module.exports = FunctionsController
