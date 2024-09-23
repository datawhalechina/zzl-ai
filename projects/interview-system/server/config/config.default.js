/* eslint valid-jsdoc: "off" */


/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {}

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1602307099645_9481'

  // add your middleware config here
  config.middleware = ['logger', 'errorHandler', 'gateway']

  // https://eggjs.org/zh-cn/core/security.html#%E5%AE%89%E5%85%A8%E5%A8%81%E8%83%81csrf%E7%9A%84%E9%98%B2%E8%8C%83
  // CSRF 攻击：伪造用户请求向网站发起恶意请求。
  // https://eggjs.org/api/Config.html#security
  config.security = {
		csrf: {
			enable: false,
		}
  }

  // 日志
  config.logger = {
    appLogName: `${appInfo.name}-web.log`,
    coreLogName: 'egg-web.log',
    agentLogName: 'egg-agent.log',
    errorLogName: 'common-error.log'
  }
  // session
  // https://github.com/eggjs/egg-session
  config.session = {
    maxAge: 24 * 3600 * 1000, // ms
    // key: 'EGG_SESS',
    key: 'XIAOJUSTEVEY_SESSION',
    httpOnly: true,
    encrypt: true
    // sameSite: null,
  }
  
  // add your user config here
  const userConfig = {
    projectName: 'xiaojurun',
    authWhiteReg: /login/g,
    manageWhiteReg: /recommendRecord|user|intervieweeRecord|sysDicItems/g,
    adminWhiteReg: /functions|bu/g,
    MAX_LOGIN_ATTEMPTS: 5, // 登录最大尝试次数
    LOCK_TIME: 2 * 60 * 60 * 1000, // 登录上锁时间
    sequelize: {
      dialect: 'mysql',
      database: 'resume',
      host: '127.0.0.1',
      port: '3306',
      username: 'root',
      password: 'xiaoju1234',
      define: {
        // 使用软删除，即仅更新 deleted_at 时间戳 而不删除数据
        paranoid: true,
        // 添加  createdAt, updatedAt 时间戳字段
        timestamps: true,
        // 有 deleted_at 时间戳
        deletedAt: true,
        // 驼峰式字段默认转为下划线 将 createdAt, updatedAt 转换成 created_at, updated_at 时间戳
        underscored: true,
        // 不允许修改表名
        freezeTableName: true,
        // 添加版本字段 version
        version: true,
      },
      pool: {
        max: 100,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      timezone: '+08:00'
    },
    swaggerdoc: {
      dirScanner: './app/controller',
      apiInfo: {
        title: 'resume-swagger',
        description: 'swagger-ui for resume egg',
        version: '1.0.0'
      },
      schemes: ['http', 'https'],
      consumes: ['application/json'],
      produces: ['application/json'],
      securityDefinitions: {
        // apikey: {
        //   type: 'apiKey',
        //   name: 'clientkey',
        //   in: 'header',
        // },
        // oauth2: {
        //   type: 'oauth2',
        //   tokenUrl: 'http://petstore.swagger.io/oauth/dialog',
        //   flow: 'password',
        //   scopes: {
        //     'write:access_token': 'write access_token',
        //     'read:access_token': 'read access_token',
        //   },
        // },
      },
      enableSecurity: false,
      // enableValidate: true,
      routerMap: false,
      enable: true
    },
    // multipart: {
    //   mode: 'stream',
    //   autoFields: false,
    //   defaultCharset: 'utf8',
    //   fieldNameSize: 100,
    //   fieldSize: 102400,
    //   fields: 10,
    //   fileSize: 10485760,
    //   files: 10,
    //   fileExtensions: [],
    //   whitelist: null,
    //   tmpdir: '/var/folders/vs/0dx4gdv17jx6fzfp0bjwx9r80000gn/T/egg-multipart-tmp/server',
    //   cleanSchedule: [Object]
    // },
    // 配置上传文件白名单
    multipart: {
      fileExtensions: ['.pdf'],
      tmpdir: 'app/public/temp'
    }
  }

  return {
    ...config,
    ...userConfig
  }
}
