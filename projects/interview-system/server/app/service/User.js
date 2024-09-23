const Service = require('egg').BaseService
const currModelName = 'Users'

/**
 * 用户表  Service
 */
class User extends Service {
  get configOption () {
    return {
      attributes: ['id', 'name', 'phone', 'bu_id', 'role_type', 'version'],
      include: [
        {
          as: 'bu',
          model: this.model.Bu,
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
      delete item.bu
      return item
    }
  }

  async list (configOption = {}) {
    const { Op } = this.app.Sequelize
    const { isInner } = configOption.where
    configOption.where = this.foramtToUnderscoredParams(configOption.where)
    isInner !== undefined && delete configOption.where.is_inner && isInner && (configOption.where.role_type = {
      [Op.ne]: 0
    })
    return await super.findAll({ modelName: currModelName, configOption: { ...this.configOption, ...configOption }, callBackFn: this.callBackFn })
  }

  async findByPk (id, configOption, needModal) {
    return await super.findByPk({ modelName: currModelName, id, configOption: { ...this.configOption, ...configOption }, needModal, callBackFn: this.callBackFn })
  }

  async findOneByName (name) {
    const { Op } = this.app.Sequelize
    const configOption = {
      attributes: ['id', 'name', 'phone', 'bu_id', 'password', 'role_type', 'version'],
      where: {
        // 可以通过用户名和 手机号进行登录
        [Op.or]: [
          { name },
          { phone: name }
        ]
      }
    }
    return await super.findOne({ modelName: currModelName, configOption: { ...this.configOption, ...configOption }, callBackFn: this.callBackFn, needModal: true })
  }

  async checkPassword (_password, password) {
    const res = await this.model[currModelName].comparePassword(_password, password)
    return res
  }

  async create (data) {
    return await this.createData({ modelName: currModelName, data })
  }

  async update (data, configOption) {
    return await this.updateData({ modelName: currModelName, data, configOption: { ...this.configOption, ...configOption } })
  }

  async login (data) {
    return await this.updateData({ modelName: currModelName, data, configOption: this.configOption })
  }

  async pagination (configOption) {
    configOption.attributes = ['id', 'name', 'phone', 'bu_id', 'role_type', 'created_at', 'lock_until', 'updated_at']
    return await super.pagination({ modelName: currModelName, configOption: { ...this.configOption, ...configOption }, callBackFn: this.callBackFn })
  }

  async destroy () {
    const user = this._user
    const _id = this.ctx.params.id

    // 不允许普通删除其他管理员
    if (!user || user.roleType <= 2) {
      this.ctx.error(`${user.name}尝试给${_id}用户解锁`)
      return '不允许普通管理员删除其他管理员'
    }
    const { id } = user
    // 自己不能删除自己
    if (id === _id) {
      return '自己不能删除自己'
    }
    const configOption = {
      where: {
        id: _id
      }
    }
    return await this.destroyData({ modelName: currModelName, configOption })
  }

  async lock () {
    const userId = this.ctx.params.id
    const LOCK_TIME = this.app.config.LOCK_TIME
    const userData = {
      lockUntil: Date.now() + LOCK_TIME
    }
    const configOption = {
      where: {
        id: userId
      }
    }
    await this.update(userData, configOption)
    this.ctx.error(`${userId} 用户已上锁`)
    return true
  }

  async modelLock (model) {
    const user = model.toJSON()
    const loginAttempts = Number(user.loginAttempts) + 1
    const userData = {}
    const MAX_LOGIN_ATTEMPTS = this.app.config.MAX_LOGIN_ATTEMPTS
    const LOCK_TIME = this.app.config.LOCK_TIME
    loginAttempts <= MAX_LOGIN_ATTEMPTS && (userData.loginAttempts = loginAttempts)
    if (!user.isLocked || loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      userData.lockUntil = Date.now() + LOCK_TIME // 只有新的错误密码周期中，才重置上锁时间
    }
    await this.modelUpdateData({ model, data: userData })
    this.ctx.error(`${user.id} ${user.name}用户已上锁`)
    this.ctx.error(`${user.id} ${user.name}用户输入密码已错误 ${loginAttempts} 次`)
  }

  async unlock (_id) {
    const user = this._user
    // 自己不能给自己解锁
    if (user.id === _id) {
      return '自己不能给自己解锁'
    }
    const options = {
      where: {
        id: _id
      }
    }
    const userData = {
      loginAttempts: 0,
      lockUntil: 0
    }
    await this.update(userData, options)
    this.ctx.info(`成功给${_id}用户解锁`)
    return true
  }

  /**
   * 判断用户是否存在
   * @return true 表示已存在，false 不存在
   */
  async exist (where) {
    // 判断是否已存在
    const configOption = {
      attributes: ['id'],
      where: this.foramtToUnderscoredParams(where)
    }
    return !!await super.findOne({ modelName: currModelName, configOption })
  }
}

module.exports = User
