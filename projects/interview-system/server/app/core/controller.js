
const Controller = require('egg').Controller

class BaseController extends Controller {
  validate () {
    const { ctx } = this
    ctx.validate(this.getResRule(ctx.url))
  }

  // 校验用户权限
  checkUseAuth (type) {
    return this.ctx.checkUseAuth(type)
  }

  // set success data
  success (data) {
    this.ctx.success(data)
  }

  successMsg (msg) {
    this.ctx.successMsg(msg)
  }

  // set failed msg
  fail (error) {
    this.ctx.fail(error)
  }

  failMsg (msg) {
    this.ctx.failMsg(msg)
  }

  // get params
  getParams (key) {
    return this.ctx.getParams(key)
  }

  // get request client ip
  get ip () {
    return this.ctx.ip
  }

  // get cookies
  get cookies () {
    return this.ctx.cookies
  }

  // get session
  get session () {
    return this.ctx.session
  }

  validatePk () {
    this.ctx.validate({
      id: { type: 'int', convertType: 'number', required: true }
    }, this.ctx.params)
  }

  validatePageParam (type = 'query') {
    const checkPath = type === 'body' ? 'body' : 'query'
    this.ctx.validate(this.ctx.rule.getPageRequest, this.ctx.request[checkPath])
  }

  formatOptions (obj) {
    const badParamList = [undefined, '', null]
    for (const name in obj) {
      badParamList.includes(obj[name]) && delete obj[name]
    }
    return obj
  }

  async find (id) {
    const table = await this.service[this.serviceName].findByPk(id, {}, true)
    if (!table) {
      this.failMsg(`${this.modelName} 表内无标识为 ${id} 的记录`)
    }
    return table
  }

  async destroy (needTip = true) {
    const { ctx } = this
    const id = ctx.params.id
    const table = await this.find(id)
    if (table) {
      await table.destroy()
      needTip && this.successMsg(`删除${id}成功`)
      return true
    }
  }

  // 封装统一的调用检查函数，可以在查询、创建和更新等 Service 中复用
  checkSuccess (result) {
    const DEAULT_REQ_STATUS_ATTR = this.ctx.getAttr('DEAULT_REQ_STATUS_ATTR')
    const DEAULT_REQ_MSG_ATTR = this.ctx.getAttr('DEAULT_REQ_MSG_ATTR')
    if (!result[DEAULT_REQ_STATUS_ATTR]) {
      this.ctx.failMsg(result[DEAULT_REQ_MSG_ATTR])
    } else {
      this.ctx.successMsg(result[DEAULT_REQ_MSG_ATTR])
    }
  }

  checkFindData (table, errMsg = '记录未找到') {
    if (!table) {
      this.failMsg(errMsg)
    }
    this.success(table)
  }
}

module.exports = BaseController
