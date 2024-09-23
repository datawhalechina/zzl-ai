
const BaseController = require('../core/controller')

const currServiceName = 'user'

/**
 * @Controller
 */
class UsersController extends BaseController {
  get modelName () {
    return 'User'
  }

  get serviceName () {
    return currServiceName
  }

  /**
   * @Summary 获取所有用户
   * @Description 获取所有用户
   * @Router get /user
   * @Request query boolean isInner
   * @Response 200 users 获取所有用户成功
   */
  async index () {
    if (!this.checkUseAuth()) {
      return
    }
    const { ctx } = this
    ctx.validate(ctx.rule.listUserRequest)
    const {
      ...restParam
    } = ctx.query

    const where = this.formatOptions({
      ...restParam
    })
    this.success(await this.service[currServiceName].list({ where }))
  }

  /**
  * @Summary 分页获取用户
  * @Description 分页获取用户
  * @Router post /user/page/
  * @Request body pageUserRequest *body
  * @Response 200 users 获取所有用户成功
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
    const config = { pageNo, pageSize, where }
    const res = await this.service[currServiceName].pagination(config)
    if (res.count) {
      this.success(res)
    } else {
      this.failMsg(`未找到第 ${pageNo} 页的用户信息`)
    }
  }

  /**
   * @Summary 获取指定用户
   * @Description 根据 id 获取用户信息
   * @Router get /user/{id}
   * @Request path integer id 标识
   * @Response 200 users 获取指定用户信息成功
   */
  async show () {
    if (!this.checkUseAuth()) {
      return
    }
    const { ctx } = this
    this.validatePk()
    const res = await this.find(ctx.params.id)
    res && this.success(res)
  }

  /**
   * @Summary 新增用户
   * @Description 新增用户信息
   * @Router post /user
   * @Request body createUserRequest *body
   * @Response 200 defaultBaseResponse 新增用户成功
   */
  async create () {
    const { ctx } = this
    if (!this.checkUseAuth()) {
      return
    }
    ctx.validate(ctx.rule.createUserRequest, ctx.request.body)
    const { name, phone, password, buId, roleType } = ctx.request.body
    const res = await this.service[currServiceName].create({ name, phone, password, buId, roleType })
    this.success({ id: res.id })
  }

  /**
   * @Summary 修改指定用户
   * @Description 根据 id 修改用户信息
   * @Router put /user/{id}
   * @Request path integer id 标识
   * @Request body updateUserRequest *body
   * @Response 200 defaultBaseResponse 修改指定用户成功
   */
  async update () {
    const { ctx } = this
    this.validatePk()
    if (!this.checkUseAuth()) {
      return
    }
    const id = ctx.params.id
    const User = await this.find(id)
    if (User) {
      ctx.validate(ctx.rule.updateUserRequest)
      const { name, phone, password, buId, roleType } = ctx.request.body
      await this.service[currServiceName].modelUpdateData({
        model: User, data: { name, phone, password, buId, roleType }
      })
      this.success({ id })
    }
  }

  /**
   * @Summary 删除指定用户
   * @Description 根据 id 删除用户信息
   * @Router delete /user/{id}
   * @Request path integer id 标识
   * @Response 200 defaultResponse 删除指定用户成功
   */
  async destroy () {
    this.validatePk()
    const res = await this.service[currServiceName].destroy()
    res === true ? this.successMsg(`删除用户${this.ctx.params.id}成功`) : this.failMsg(res)
  }

  /**
   * @Summary 用户登录
   * @Description 通过账号密码进行登录
   * @Router post /login/
   * @Request body userLoginRequest *body
   * @Response 200 defaultBaseResponse 用户登录成功
   */
  async login () {
    const { ctx } = this
    ctx.validate(ctx.rule.userLoginRequest)
    const { userName, password } = ctx.request.body
    const currUserModel = await this.service[currServiceName].findOneByName(userName)
    if (!currUserModel) {
      return this.failMsg(`${userName} 账户不存在`)
    }
    const currUser = currUserModel.toJSON()
    if (currUser.loginAttempts >= this.app.config.MAX_LOGIN_ATTEMPTS) {
      return this.failMsg(`用户 ${currUser.name} 密码输错次数已达到上限，已经上锁，请联系管理员进行解锁`)
    }
    const isRightPassword = await this.service[currServiceName].checkPassword(password, currUser.password)
    if (!isRightPassword) {
      this.failMsg('账户或密码错误，请校验输入内容!')
      return await this.service[currServiceName].modelLock(currUserModel)
    }
    const currLoginId = currUser.id
    ctx.sessionId = currLoginId
    ctx.user = currUser
    this.success({ id: currLoginId })
  }

  /**
   * @Summary 上锁指定用户
   * @Description 根据 id 上锁用户信息
   * @Router put /user/lock/{id}
   * @Request path integer id 标识
   * @Response 200 defaultResponse 上锁指定用户成功
   */
  async lock () {
    if (!this.checkUseAuth(1)) {
      return
    }

    this.validatePk()
    const userId = this.ctx.params.id
    const res = await this.service[currServiceName].lock()
    res === true ? this.successMsg(`用户 ${userId} 上锁成功`) : this.failMsg(res)
  }

  /**
   * @Summary 解锁指定用户
   * @Description 根据 id 解锁用户信息
   * @Router get /user/unlock/{id}
   * @Request path integer id 标识
   * @Response 200 defaultResponse 解锁指定用户成功
   */
  async unlock () {
    if (!this.checkUseAuth(1)) {
      return
    }
    this.validatePk()
    const userId = this.ctx.params.id
    const res = await this.service[currServiceName].unlock(userId)
    res === true ? this.successMsg(`用户 ${userId} 解锁成功`) : this.failMsg(res)
  }

  /**
   * @Summary 用户登出
   * @Description 用户登出
   * @Router delete /login
   * @Response 200 defaultResponse 用户登出成功
   */
  async outLogin () {
    this.ctx.sessionId = ''
    this.ctx.user = ''
    this.successMsg('已经登出')
  }

  /**
   * @Summary 获取当前登录用户
   * @Description 获取当前登录用户
   * @Router get /user/current
   * @Response 200 users 获取当前登录用户
   */
  async current () {
    const { id, name, phone, buName, roleType } = this.ctx.user || {}
    const res = { id, name, phone, buName, roleType }
    this.success(res)
  }
}

module.exports = UsersController
