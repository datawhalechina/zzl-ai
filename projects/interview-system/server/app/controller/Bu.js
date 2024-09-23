
const BaseController = require('egg').BaseController

const currServiceName = 'bu'
/**
 * @Controller
 */
class BuController extends BaseController {
  get modelName () {
    return 'Bu'
  }

  get serviceName () {
    return currServiceName
  }

  /**
   * @Summary 获取所有部门
   * @Description 获取所有部门
   * @Router get /bu
   * @Response 200 bu 获取所有部门成功
   */
  async index () {
    this.success(await this.service[currServiceName].list())
  }

  /**
  * @Summary 分页获取部门
  * @Description 分页获取部门
  * @Router get /bu/page/
  * @Request query integer pageNo 页面数
  * @Request query integer pageSize 页面条数
  * @Request query string name 部门信息
  * @Response 200 bu 获取所有部门成功
  */
  async page () {
    this.validatePageParam()
    const { ctx } = this
    const {
      // 默认第一页
      pageNo = 1,
      // 默认每页10条记录
      pageSize = 10,
      name
    } = ctx.query
    const where = this.formatOptions({
      name
    })
    const config = { pageNo, pageSize, where }
    const res = await this.service[currServiceName].pagination(config)
    if (res.count) {
      this.success(res)
    } else {
      this.failMsg(`未找到第 ${pageNo} 页的部门信息`)
    }
  }

  /**
   * @Summary 获取指定部门
   * @Description 根据 id 获取部门信息
   * @Router get /bu/{id}
   * @Request path integer id 标识
   * @Response 200 bu 获取指定部门成功
   */
  async show () {
    const { ctx } = this
    this.validatePk()
    const res = await this.find(ctx.params.id)
    res && this.success(res)
  }

  /**
   * @Summary 新增部门
   * @Description 新增部门信息
   * @Router post /bu
   * @Request body createBuRequest *body
   * @Response 200 defaultBaseResponse 新增部门成功
   */
  async create () {
    const { ctx } = this
    ctx.validate(ctx.rule.createBuRequest)
    const { name } = ctx.request.body
    const res = await this.service[currServiceName].create({ name })
    this.success({ id: res.id })
  }

  /**
   * @Summary 修改指定部门
   * @Description 根据 id 修改部门信息
   * @Router put /bu/{id}
   * @Request path integer id 标识
   * @Request body createBuRequest *body
   * @Response 200 defaultBaseResponse 修改指定部门成功
   */
  async update () {
    const { ctx } = this
    this.validatePk()
    const id = ctx.params.id
    const Bu = await this.find(id)
    if (Bu) {
      ctx.validate(ctx.rule.createBuRequest)
      const { name } = ctx.request.body
      await this.service[currServiceName].modelUpdateData({ model: Bu, data: { name } })
      this.success({ id })
    }
  }

  /**
   * @Summary 删除指定部门
   * @Description 根据 id 删除部门信息
   * @Router delete /bu/{id}
   * @Request path integer id 标识，可以用逗号隔开
   * @Response 200 defaultResponse 删除指定部门成功
   */
  async destroy () {
    const id = this.ctx.params.id
    const state = await this.service[currServiceName].destroy({ where: { id: id.split(',') } })
    state && this.successMsg(`删除部门${this.ctx.params.id}成功`)
  }
}

module.exports = BuController
