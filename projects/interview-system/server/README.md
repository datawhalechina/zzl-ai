## server

#### 启动项目

如果是第一次接触项目请先看[初始开发文档](./docs/developer.md)

``` sh
$ npm i 
$ npm run dev

```

---

#### 后台接口规范

> 接口默认返回值

|参数名称|参数含义|参数类型|参数可能值|
|:---|:---|:---|:---|
|status|请求状态|boolean|true, false|
|data|请求响应内容|object|{}|
|msg|请求返回文本内容|string|''|

umi 官方建议的是 {success,data},但是这样会接管错误处理 不方便做接入操作

---

### 目录结构

目录约定规范

``` sh
tree -I "node_modules|logs|run|public"
.
├── README.md
├── app
│   ├── contract
│   │   ├── dto.js
│   │   ├── request
│   │   │   ├── Base.js
│   │   │   ├── Bu.js
│   │   │   ├── Functions.js
│   │   │   ├── Interviewee.js
│   │   │   ├── IntervieweeRecord.js
│   │   │   ├── Job.js
│   │   │   ├── SysDicItems.js
│   │   │   └── Users.js
│   │   └── response
│   │       ├── Base.js
│   │       ├── Bu.js
│   │       ├── Functions.js
│   │       ├── Interviewee.js
│   │       ├── IntervieweeRecord.js
│   │       ├── Job.js
│   │       ├── SysDicItems.js
│   │       └── Users.js
│   ├── controller
│   │   ├── Bu.js
│   │   ├── Functions.js
│   │   ├── Interviewee.js
│   │   ├── IntervieweeRecord.js
│   │   ├── Job.js
│   │   ├── SysDicItems.js
│   │   └── Users.js
│   ├── core
│   │   ├── controller.js
│   │   └── services.js
│   ├── extend
│   │   ├── context.js
│   │   └── helper.js
│   ├── middleware
│   │   ├── errorHandler.js
│   │   ├── gateway.js
│   │   └── logger.js
│   ├── model
│   │   ├── Bu.js
│   │   ├── Functions.js
│   │   ├── Interviewee.js
│   │   ├── IntervieweeRecord.js
│   │   ├── Job.js
│   │   ├── SysDicItems.js
│   │   └── Users.js
│   ├── router.js
│   ├── routers
│   │   ├── Bu.js
│   │   ├── Functions.js
│   │   ├── Interviewee.js
│   │   ├── IntervieweeRecord.js
│   │   ├── Job.js
│   │   ├── SysDicItems.js
│   │   └── Users.js
│   └── service
│       ├── Bu.js
│       ├── Functions.js
│       ├── Interviewee.js
│       ├── IntervieweeRecord.js
│       ├── Job.js
│       ├── SysDicItems.js
│       └── User.js
├── app.js
├── config
│   ├── config.default.js
│   ├── config.prod.js
│   └── plugin.js
├── database
│   ├── config.json
│   └── migrations
│       ├── 20201016071220-init-users.js
│       ├── 20201016071241-init-dic_items.js
│       ├── 20201016071337-init-job.js
│       ├── 20201016071344-init-interviewee_record.js
│       ├── 20201016071353-init-interviewee.js
│       ├── 20201018122209-insert-dic_items.js
│       ├── 20201018122223-insert-users.js
│       ├── 20201026131214-init-bu.js
│       ├── 20201026131223-init-function.js
│       ├── 20201026131236-insert-bu.js
│       └── 20201026131242-insert-function.js
├── docs
│   ├── developer.md
│   └── model.md
├── jsconfig.json
├── package-lock.json
├── package.json
└── typings
    ├── app
    │   ├── controller
    │   │   └── index.d.ts
    │   ├── extend
    │   │   ├── context.d.ts
    │   │   └── helper.d.ts
    │   ├── index.d.ts
    │   ├── middleware
    │   │   └── index.d.ts
    │   ├── model
    │   │   └── index.d.ts
    │   └── service
    │       └── index.d.ts
    └── config
        ├── index.d.ts
        └── plugin.d.ts

23 directories, 84 files
```

如上，由框架约定的目录：

- `app/router.js` 用于配置 URL 路由规则，具体参见 [Router](https://eggjs.org/zh-cn/basics/router.html)。
- `app/controller/**` 用于解析用户的输入，处理后返回相应的结果，具体参见 [Controller](https://eggjs.org/zh-cn/basics/controller.html)。
- `app/service/**` 用于编写业务逻辑层，可选，建议使用，具体参见 [Service](https://eggjs.org/zh-cn/basics/service.html)。
- `app/middleware/**` 用于编写中间件，可选，具体参见 [Middleware](https://eggjs.org/zh-cn/basics/middleware.html)。
- `app/extend/**` 用于框架的扩展，可选，具体参见[框架扩展](https://eggjs.org/zh-cn/basics/extend.html)。
- `config/config.{env}.js` 用于编写配置文件，具体参见[配置](https://eggjs.org/zh-cn/basics/config.html)。
- `config/plugin.js` 用于配置需要加载的插件，具体参见[插件](https://eggjs.org/zh-cn/basics/plugin.html)。
- `app.js` 用于自定义启动时的初始化工作，可选，具体参见[启动自定义](https://eggjs.org/zh-cn/basics/app-start.html)。

> 若需自定义自己的目录规范，参见 Loader API

- `app/model/**` 用于放置领域模型，可选，由领域类相关插件约定，如 `egg-sequelize`。

> `sequelize-cli`

- `database/config.json` 用于放置`sequelize-cli`配置项。
- `database/migrations/*.js` 用于放置`sequelize` 快速迁移库相关配置文件。

> `egg-swagger-doc`

- `app/contract/**` 用于放置 swagger api 接口校验管理文件，可选，由模板插件约定。

---

## 项目使用技术

- [typescript](https://eggjs.org/zh-cn/tutorials/typescript.html)
- [egg-lifecycle](https://eggjs.org/zh-cn/basics/app-start.html)
- [egg-extend](https://eggjs.org/zh-cn/basics/extend.html)
- [egg-router](https://eggjs.org/zh-cn/basics/router.html)
- [egg-request](https://eggjs.org/api/Request.html)
- [sequelize](https://www.sequelize.com.cn/core-concepts/getting-started)
- [sequelize-cli](https://github.com/sequelize/cli)
- [response-aliases](https://koajs.com/#response-aliases)
- [egg-swagger-doc](https://github.com/Yanshijie-EL/egg-swagger-doc#readme)
- [parameter-validate](https://github.com/node-modules/parameter)

---