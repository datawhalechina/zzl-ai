const Service = require('egg').BaseService
const currModelName = 'Bu'
/**
 * 部门表  Service
 */
class Bu extends Service {
  async list (configOption) {
    return await super.findAll({ modelName: currModelName, configOption })
  }

  async findByPk (id, configOption, needModal) {
    return await super.findByPk({ modelName: currModelName, id, configOption, needModal })
  }

  async create (data) {
    return await this.createData({ modelName: currModelName, data })
  }

  async update (data, configOption) {
    return await this.updateData({ modelName: currModelName, data, configOption })
  }

  async pagination (configOption) {
    return await super.pagination({ modelName: currModelName, configOption })
  }

  async destroy (configOption) {
    return await this.destroyData({ modelName: currModelName, configOption })
  }
}

module.exports = Bu
