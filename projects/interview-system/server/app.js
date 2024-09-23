const BaseController = require('./app/core/controller')
const BaseService = require('./app/core/services')

const loggerHelp = (appBook, msg) => appBook.app.coreLogger.info(`[xiaojurun] ${msg}`)
const errorHelp = (appBook, msg) => appBook.app.coreLogger.error(`[xiaojurun] ${msg}`)

class AppBootHook {
  constructor (app) {
    this.app = app
  }

  // 配置文件即将加载，这是最后动态修改配置的时机
  configWillLoad () {
    loggerHelp(this, 'config will load')
  }

  // 配置文件加载完成
  configDidLoad () {
    const _t = this
    loggerHelp(this, 'config did load')
    const app = _t.app
    loggerHelp(this, 'load base controller')
    app.Controller = BaseController
    require('egg').Controller = BaseController
    app.BaseController = BaseController
    require('egg').BaseController = BaseController

    loggerHelp(this, 'load base service')
    app.Service = BaseService
    require('egg').Service = BaseService
    app.BaseService = BaseService
    require('egg').BaseService = BaseService

    app.on('error', (err, ctx) => {
      errorHelp(_t, err)
    })
  }

  // 文件加载完成
  async didLoad () {
    loggerHelp(this, ' all files did load')
  }

  // 插件启动完毕
  async willReady () {
    loggerHelp(this, 'all plugin started')
  }

  // worker 准备就绪
  async didReady () {

  }

  // 应用启动完成
  async serverDidReady () {
    loggerHelp(this, 'server did ready')
  }

  // 应用即将关闭
  async beforeClose () {
    loggerHelp(this, 'server will close')
  }
}

module.exports = AppBootHook
