const Service = require('egg').BaseService
const currModelName = 'Job'
/**
 * 岗位表  Service
 */
class Job extends Service {
  get configOption () {
    return {
      attributes: ['id', 'name', 'version'],
      include: [
        {
          as: 'bu',
          model: this.model.Bu,
          attributes: ['id', 'name']
        },
        {
          as: 'function',
          model: this.model.Functions,
          attributes: ['id', 'name']
        },
        {
          as: 'user',
          model: this.model.Users,
          attributes: ['id', 'name']
        }
      ],
      order: [
        ['updated_at', 'DESC']
      ]
    }
  }

  get callBackFn () {
    return (item) => {
      item.buName = item.bu && item.bu.dataValues.name
      item.bu = undefined
      item.userName = item.user && item.user.dataValues.name
      item.user = undefined
      item.functionName = item.function && item.function.dataValues.name
      item.function = undefined
      return item
    }
  }

  async list (configOption = {}) {
    configOption.where = this.foramtToUnderscoredParams(configOption.where)
    return await super.findAll({ modelName: currModelName, configOption: { ...this.configOption, ...configOption }, callBackFn: this.callBackFn })
  }

  async findByPk (id, configOption, needModal) {
    return await super.findByPk({ modelName: currModelName, id, configOption: { ...this.configOption, ...configOption }, needModal, callBackFn: this.callBackFn })
  }

  async create (data) {
    return await this.createData({ modelName: currModelName, data })
  }

  async update (data, configOption) {
    return await this.updateData({ modelName: currModelName, data, configOption: { ...this.configOption, ...configOption } })
  }

  async destroy (configOption) {
    return await this.destroyData({ modelName: currModelName, configOption })
  }

  async pagination (configOption) {
    configOption.attributes = ['id', 'name', 'responsibility', 'description', 'bu_id', 'function_id', 'user_id', 'state', 'version', 'created_at', 'updated_at']
    return await super.pagination({ modelName: currModelName, configOption: { ...this.configOption, ...configOption }, callBackFn: this.callBackFn })
  }
}

module.exports = Job
