
const BaseController = require('../core/controller')

const currServiceName = 'sysDicItems'
/**
 * @Controller
 */
class SysDicItemsController extends BaseController {
  get modelName () {
    return 'SysDicItems'
  }

  get serviceName () {
    return currServiceName
  }

  /**
  * @Summary 获取指定分组的所有字典项
  * @Description 获取指定分组的所有字典项
  * @Router get /sysDicItems/group/{groupName}
  * @Request path string groupName 分组名
  * @Response 200 sys_dicItems 获取指定分组的所有字典项
  */
  async group () {
    const { ctx } = this
    const { params } = ctx
    const { groupName } = params

    ctx.validate(ctx.rule.getSysDicGroupRequest)

    const res = await this.service[currServiceName].group(groupName)
    res && this.success(res)
  }

  /**
 * @Summary 获取所有字典项，不分页
 * @Description 获取所有字典项
 * @Router get /sysDicItems
 * @Response 200 sys_dicItems 获取所有字典项成功
 */
  async index () {
    this.success(await this.service[currServiceName].list())
  }

  /**
  * @Summary 分页获取字典项
  * @Description 分页获取字典项
  * @Router post /sysDicItems/page/
  * @Request query integer pageNo 页面数
  * @Request query integer pageSize 页面条数
  * @Response 200 sys_dicItems 获取所有字典项成功
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
    ctx.validate(ctx.rule.updateSysDicRequest)
    const config = { pageNo, pageSize, where }
    const res = await this.service[currServiceName].pagination(config)
    if (res.count) {
      this.success(res)
    } else {
      this.failMsg(`未找到第 ${pageNo} 页的字典项信息`)
    }
  }

  /**
 * @Summary 新增字典项
 * @Description 新增字典项信息
 * @Router post /sysDicItems
 * @Request body createSysDicRequest *body
 * @Response 200 defaultBaseResponse 新增字典项成功
 */
  async create () {
    const { ctx } = this
    ctx.validate(ctx.rule.createSysDicRequest)
    const { name, value, note, groupName, sortNum, enable } = ctx.request.body
    const res = await this.service[currServiceName].create({ name, value, note, groupName, sortNum, enable })
    this.success({ id: res.id })
  }

  /**
   * @Summary 获取所有字典项
   * @Description 根据 id 获取字典项信息
   * @Router get /sysDicItems/{id}
   * @Request path integer id 标识
   * @Response 200 sys_dicItems 获取指定字典项信息成功
   */
  async show () {
    const { ctx } = this
    this.validatePk()
    const res = await this.find(ctx.params.id)
    res && this.success(res)
  }

  /**
   * @Summary 查找字典项
   * @Description 查找字典项信息
   * @Router post /sysDicItems/find
   * @Request body findSysDicRequest *body
   * @Response 200 sys_dicItems 查找字典项成功
   */
  async findByParam () {
    const { ctx } = this
    const { name, value, note, groupName, sortNum, enable } = ctx.request.body

    // 参数校验
    ctx.validate(ctx.rule.findSysDicRequest, ctx.request.body)

    const where = this.formatOptions({ name, value, note, groupName, sortNum, enable })
    // 查找字典项数据
    const res = await ctx.service[currServiceName].list({ where })

    return res ? this.success(res) : this.failMsg(`已存在字典项 ${name}`)
  }

  /**
   * @Summary 修改指定字典项
   * @Description 根据 id 修改字典项信息
   * @Router put /sysDicItems/{id}
   * @Request path integer id 标识
   * @Request body createSysDicRequest *body
   * @Response 200 defaultBaseResponse 修改指定字典项成功
   */
  async update () {
    const { ctx } = this
    this.validatePk()
    const id = ctx.params.id
    const SysDicItems = await this.find(id)
    if (SysDicItems) {
      ctx.validate(ctx.rule.createSysDicRequest)
      const { name, value, note, groupName, sortNum, enable } = ctx.request.body
      await this.service[currServiceName].modelUpdateData({
        model: SysDicItems, data: { name, value, note, groupName, sortNum, enable }
      })
      this.success({ id })
    }
  }

  /**
   * @Summary 删除指定字典项
   * @Description 根据 id 删除字典项信息
   * @Router delete /sysDicItems/{id}
   * @Request path integer id 标识，可以用逗号隔开
   * @Response 200 defaultResponse 删除指定字典项成功
   */
  async destroy () {
    const id = this.ctx.params.id
    const state = await this.service[currServiceName].destroy({ where: { id: id.split(',') } })
    state && this.successMsg(`删除字典项${this.ctx.params.id}成功`)
  }
}

module.exports = SysDicItemsController
