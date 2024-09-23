const Service = require('egg').BaseService
const currModelName = 'Functions'
/**
 * 职位表  Service
 */
class Functions extends Service {
  get configOption () {
    return {
      include: [
        {
          as: 'bu',
          model: this.model.Bu,
          attributes: ['id', 'name']
        }
      ]
    }
  }

  get callBackFn () {
    return (item) => {
      item.buName = item.bu && item.bu.dataValues.name
      item.bu = undefined
      return item
    }
  }

  async list () {
    return await super.findAll({ modelName: currModelName, configOption: this.configOption, callBackFn: this.callBackFn })
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
    return await super.pagination({ modelName: currModelName, configOption: { ...this.configOption, ...configOption }, callBackFn: this.callBackFn })
  }

  async findAllByBuId (buId) {
    const configOption = { ...this.configOption, where: { bu_id: buId } }
    return await this.findAll({ modelName: currModelName, configOption, callBackFn: this.callBackFn })
  }
}

module.exports = Functions
