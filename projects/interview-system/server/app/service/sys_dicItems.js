const Service = require('egg').BaseService
const currModelName = 'SysDicItems'
// 招聘类型  RESUME_ORIGIN
/**
 * 数据字典Service
 */
class SysDicItems extends Service {
  get storeName () {
    return 'dicdata'
  }

  getConfigOption (name) {
    const { Op } = this.app.Sequelize
    const option = {
      where: {
        // 只查找有效的
        enable: 1
      },
      order: [
        ['sort_num', 'ASC']
      ]
    }

    name && (option.where[Op.or] = [
      { group_name: name },
      { note: name }
    ]
    )// 数据字典分组 名称
    return option
  }

  getCache (key) {
    const storeKey = this.storeName
    !this.ctx.app.config[storeKey] && (this.ctx.app.config[storeKey] = {})
    const lru = this.ctx.app.config
    const dicdata = lru[storeKey]
    if (dicdata) {
      return dicdata[String(key)]
    }
    return null
  }

  setCache (key, value) {
    const lru = this.ctx.app.config
    const dicdata = lru[this.storeName]
    if (dicdata) {
      dicdata[key] = value
    }
  }

  async checkStoreData (key, getDBData) {
    const data = this.getCache(key)
    if (data) {
      this.ctx.info(`[dictionary store]  读取 ${key} 缓存`)
      return data
    }
    this.ctx.info(`[dictionary store]  读取 ${key} 数据库数据`)
    const res = await getDBData()
    this.setCache(key, res)
    return res
  }

  async group (groupName) {
    const getDBData = async () => {
      // 从数据库获取
      return await super.findAll({ modelName: currModelName, configOption: this.getConfigOption(groupName) })
    }
    return await this.checkStoreData(groupName, getDBData)
  }

  async list (configOption = {}) {
    configOption.where = this.foramtToUnderscoredParams(configOption.where)
    configOption.attributes = ['name', 'value', 'group_name']
    return await super.findAll({ modelName: currModelName, configOption })
  }

  async findByPk (id, configOption, needModal) {
    const getDBData = async () => {
      return await super.findByPk({ modelName: currModelName, id, configOption, needModal })
    }
    return await this.checkStoreData(id, getDBData)
  }

  async create (data) {
    return await this.createData({ modelName: currModelName, data })
  }

  async update (data, configOption) {
    return await this.updateData({ modelName: currModelName, data, configOption })
  }

  async destroy (configOption) {
    return await this.destroyData({ modelName: currModelName, configOption })
  }

  async pagination (configOption) {
    return await super.pagination({ modelName: currModelName, configOption: { ...this.getConfigOption(), ...configOption } })
  }
}

module.exports = SysDicItems
