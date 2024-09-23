const userAgent = require('user-agent')

const USER_AGENT = Symbol('Context#USER_AGENT')

const DEAULT_STATUS_LIST = [true, false]
const DEAULT_REQ_MSG_LIST = ['接口请求成功', '接口请求错误', '异常请求接口,请先登录']
const DEAULT_REQ_STATUS_ATTR = 'status'
const DEAULT_REQ_MSG_ATTR = 'msg'
const DEAULT_REQ_DATA_ATTR = 'data'
const DEAULT_RES_ERROR_STATUS = 200

const SESSIONID = 'SESSIONID'
const SESSIONIDS = 'SESSIONIDS'
const USER = 'USER'

module.exports = {
  getAttr (item) {
    const dic = {
      DEAULT_STATUS_LIST,
      DEAULT_REQ_MSG_LIST,
      DEAULT_REQ_STATUS_ATTR,
      DEAULT_REQ_MSG_ATTR,
      DEAULT_REQ_DATA_ATTR,
      DEAULT_RES_ERROR_STATUS
    }
    return item ? dic[item] : dic
  },
  get sessionId () {
    const currSessionId = this.session[SESSIONID]
    return this.checkSessionIds(currSessionId) ? currSessionId : ''
  },
  set sessionId (val) {
    this.session[SESSIONID] = val
    this.addSessionIds(val)
  },
  get sessionIds () {
    !this.session[SESSIONIDS] && (this.session[SESSIONIDS] = [])
    return this.session[SESSIONIDS]
  },
  set sessionIds (val) {
    this.sessionIds.push(val)
  },
  addSessionIds (sessionId) {
    this.sessionIds = sessionId
  },
  checkSessionIds (sessionId) {
    return this.sessionIds.includes(sessionId)
  },
  removeSessionIds (sessionId) {
    const currLoginIndex = this.sessionIds.indexOf(sessionId)
    currLoginIndex > -1 && this.sessionIds.slice(currLoginIndex, 1)
  },
  get user () {
    return this.session[USER]
  },
  set user (val) {
    this.session[USER] = val
  },
  checkAdmin () {
    const user = this.user
    // 确认是否是管理员
    return user && user.roleType === 3
  },
  checkManage () {
    const user = this.user
    // 确认用户是否是部门经理
    return user && user.roleType >= 2
  },
  get authErrMsg () {
    return '用户权限不够，请联系管理员'
  },
  checkUseAuth (type = 1, needTip = true) {
    const DEFAULT_RETURN = true
    const roleType = ['checkAdmin', 'checkManage']
    // 上锁的账号没有任何权限
    if (this.user.loginAttempts >= this.app.config.MAX_LOGIN_ATTEMPTS || !this[roleType[type]]()) {
      needTip && this.failMsg(this.authErrMsg)
      return !DEFAULT_RETURN
    }
    return DEFAULT_RETURN
  },
  info (msg) {
    this.logger.info('[xiaojurun]', msg)
  },
  error (msg) {
    this.logger.error('[xiaojurun]', msg)
  },
  warn (msg) {
    this.logger.warn('[xiaojurun]', msg)
  },
  formatMsgResponse (status, msg, data) {
    return {
      [DEAULT_REQ_STATUS_ATTR]: status,
      [DEAULT_REQ_MSG_ATTR]: msg,
      [DEAULT_REQ_DATA_ATTR]: data
    }
  },
  successMsgResponse (msg, data) {
    return this.formatMsgResponse(DEAULT_STATUS_LIST[0], msg, data)
  },
  errorMsgResponse (msg) {
    this[DEAULT_REQ_STATUS_ATTR] = DEAULT_RES_ERROR_STATUS
    return this.formatMsgResponse(DEAULT_STATUS_LIST[1], msg)
  },
  // set success data
  success (data) {
    this.body = this.successMsgResponse(DEAULT_REQ_MSG_LIST[0], data)
  },
  successMsg (msg) {
    this.body = this.successMsgResponse(msg || DEAULT_REQ_MSG_LIST[0])
  },
  fail (error) {
    this.errorLog(error)
    let errorMsg = ''
    if (typeof error === 'object') {
      errorMsg = error.errMsg || error.message
      this.body.error = error
    } else if (typeof error === 'string') {
      errorMsg = error
    }
    this.body = this.errorMsgResponse(errorMsg)
    this.throw(DEAULT_STATUS_LIST[1], errorMsg)
  },
  failMsg (msg) {
    const errorMsg = msg || DEAULT_REQ_MSG_LIST[1]
    this.body = this.errorMsgResponse(errorMsg)
    // this.throw(DEAULT_STATUS_LIST[1], errorMsg)
  },
  errorLog (msg) {
    this.app.logger.error(this.helper.errorFormat(msg, this))
  },
  unauthorized (msg) {
    this[DEAULT_REQ_STATUS_ATTR] = 401
    this.errorLog('异常接口请求，未获取到登录信息，请先登录！')
    this.body = this.errorMsgResponse(msg || DEAULT_REQ_MSG_LIST[2])
    this[DEAULT_REQ_STATUS_ATTR] = 401
  },
  // get parameters
  getParams (key) {
    if (key) {
      return this.request.query[key] || this.request.body[key]
    }
    return {
      ...this.request.query,
      ...this.request.body
    }
  },
  get userAgent () {
    if (!this[USER_AGENT]) {
      const agent = userAgent.parse(this.get('user-agent'))

      this[USER_AGENT] = {
        clientSysName: agent.name,
        clientSysVersion: agent.version,
        clientVersion: agent.os || 'windows'
      }
    }

    return this[USER_AGENT]
  }

}
