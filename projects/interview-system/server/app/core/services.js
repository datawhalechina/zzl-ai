const Service = require('egg').Service
const dayjs = require('dayjs')
const humps = require('humps')

const _symbolJudge = (key, convert) => {
  if (typeof key === 'symbol') {
    return key
  } else {
    return convert(key)
  }
}
function toInt (str) {
  if (typeof str === 'number') return str
  if (!str) return str
  return parseInt(str, 10) || 0
}

class BaseService extends Service {
  get DEAULT_STATUS_LIST () {
    return this.ctx.getAttr('DEAULT_STATUS_LIST')
  }

  get DEAULT_REQ_STATUS_ATTR () {
    return this.ctx.getAttr('DEAULT_REQ_STATUS_ATTR')
  }

  get DEAULT_REQ_MSG_ATTR () {
    return this.ctx.getAttr('DEAULT_REQ_MSG_ATTR')
  }

  get DEAULT_REQ_DATA_ATTR () {
    return this.ctx.getAttr('DEAULT_REQ_DATA_ATTR')
  }

  get model () {
    return this.ctx.model
  }

  get _user () {
    return this.ctx.user
  }

  // 格式化数据库返回的列表数据，将之从下划线转为驼峰
  formatDBDataToCamelize (data) {
    if (data && data.length > 0) {
      return data.map((item) => humps.camelizeKeys(item.dataValues))
    } else if (data && data.dataValues) {
      return humps.camelizeKeys(data.dataValues)
    }
    return data
  }

  // 格式化下划线为驼峰
  formatDataToCamelize (data) {
    if (data && data.length > 0) {
      return data.map((item) => humps.camelizeKeys(item))
    } else if (data) {
      return humps.camelizeKeys(data)
    }
    return data
  }

  // 格式化驼峰参数为下划线参数，便于查询
  foramtToUnderscoredParams (data) {
    if (data && data.length > 0) {
      return data.map((item) => humps.decamelizeKeys(item, _symbolJudge))
    } else if (data && data) {
      return humps.decamelizeKeys(data, _symbolJudge)
    }
    return data
  }

  formatDate (time) {
    return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
  }

  formatDay (time) {
    return dayjs(time).format('YYYY-MM-DD')
  }

  formatTimestampsField (table, callBackFn = (item) => item) {
    if (!table) {
      return table
    }
    const CREATE_ATTR = 'createdAt'
    const UPDATE_ATTR = 'updatedAt'
    const DELETE_ATTR = 'deletedAt'
    // const VERSION_ATTR = 'version'
    table[CREATE_ATTR] && (table[CREATE_ATTR] = this.formatDate(table[CREATE_ATTR]))
    table[UPDATE_ATTR] && (table[UPDATE_ATTR] = this.formatDate(table[UPDATE_ATTR]))
    DELETE_ATTR in table && (table[DELETE_ATTR] = undefined)
    // this.ctx.checkUseAuth(0) && VERSION_ATTR in table && delete table[VERSION_ATTR]
    return callBackFn(table)
  }

  dealWithTableField (table, callBackFn) {
    return table.dataValues && this.formatTimestampsField(this.formatDataToCamelize(table.dataValues), callBackFn)
  }

  async dealDBFn (callback, errHandler) {
    try {
      return await callback()
    } catch (e) {
      errHandler && await errHandler()
      this.ctx.throw(e.errors ? e.errors[0]?.message : e.message)
    }
  }

  async updateData ({ modelName, data, configOption }) {
    const _t = this
    return await _t.dealDBFn(async () => {
      const entity = _t.foramtToUnderscoredParams(data)
      return _t.dealWithTableField(await _t.model[modelName].update(entity, configOption))
    })
  }

  async modelUpdateData ({ model, data, configOption }) {
    const _t = this
    return await _t.dealDBFn(async () => {
      const entity = _t.foramtToUnderscoredParams(data)
      return _t.dealWithTableField(await model.update(entity, configOption))
    })
  }

  async createData ({ modelName, data, configOption, callBackFn }) {
    const _t = this
    return await _t.dealDBFn(async () => {
      const entity = _t.foramtToUnderscoredParams(data)
      const res = await _t.model[modelName].create(entity, configOption)
      return res ? _t.dealWithTableField(res, callBackFn) : res
    })
  }

  async findAll ({ modelName = '', configOption = {}, callBackFn }) {
    const _t = this
    return await _t.dealDBFn(async () => {
      const res = await _t.model[modelName].findAll(configOption)
      return res ? res.map(item => _t.dealWithTableField(item, callBackFn)) : res
    })
  }

  async findByPk ({ modelName = '', id = '', configOption = {}, needModal = false, callBackFn }) {
    const _t = this
    return await _t.dealDBFn(async () => {
      const res = await _t.model[modelName].findByPk(toInt(id), configOption)
      res && (res.dataValues = _t.dealWithTableField(res, callBackFn))
      return needModal ? res : res.dataValues
    })
  }

  async findOne ({ modelName = '', configOption = {}, needModal = false, callBackFn }) {
    const _t = this
    return await _t.dealDBFn(async () => {
      const res = await _t.model[modelName].findOne(configOption)
      res && (res.dataValues = _t.dealWithTableField(res, callBackFn))
      return needModal ? res : res && res.dataValues
    })
  }

  async findOrCreate ({ modelName = '', configOption = {}, callBackFn }) {
    const _t = this
    return await _t.dealDBFn(async () => {
      const res = await _t.model[modelName].findOrCreate(configOption)
      return res ? _t.dealWithTableField(res, callBackFn) : res
    })
  }

  async destroyData ({ modelName = '', configOption = {} }) {
    const _t = this
    return await _t.dealDBFn(async () => {
      await _t.model[modelName].destroy(configOption)
      return true
    })
  }

  async pagination ({ modelName = '', configOption = {}, needTranUnder = true, callBackFn }) {
    const _t = this
    const { attributes, include, order } = configOption
    let { pageNo, pageSize, where } = configOption
    pageNo = toInt(pageNo)
    pageSize = toInt(pageSize)
    where && needTranUnder && (where = _t.foramtToUnderscoredParams(where))
    return await _t.dealDBFn(async () => {
      const options = {
        attributes,
        include,
        where,
        order: order || [
          ['updated_at', 'DESC']
        ],
        offset: (pageNo - 1) * pageSize,
        limit: toInt(pageSize)
      }
      const res = await _t.model[modelName].findAndCountAll(options)
      const data = res.count > 0 ? res.rows.map(item => _t.dealWithTableField(item, callBackFn)) : []
      return { data, count: res.count }
    })
  }

  async findAndCountAll ({ modelName = '', configOption = {}, callBackFn }) {
    const _t = this
    return await _t.dealDBFn(async () => {
      const res = await _t.model[modelName].findAndCountAll(configOption)
      return res ? res.map(item => _t.dealWithTableField(item, callBackFn)) : res
    })
  }

  // set success data
  success (msg, data) {
    return this.ctx.successMsgResponse(msg, data)
  }

  // set failed msg
  fail (error) {
    return this.ctx.errorMsgResponse(error)
  }
}

module.exports = BaseService
