# frontend

## 简介

基于 fusion 和 ice.js 的简历管理后台

## 使用

```bash
# 安装依赖
$ npm install

# 启动服务
$ npm start  # visit http://localhost:3333
```

## 开发记录

[详细开发记录](./docs/developer.md)

## 目录

```md
tree -I "node_modules"
.
├── docs                           # 项目开发文档说明
│   ├── developer.md
│   └── start.md
├── src                           # 源码路径
│   ├── app.tsx                   # 应用入口脚本
│   ├── assets                    # 应用资源
│   │   ├── logo.svg
│   │   ├── menu_logo.svg
│   │   └── mini_menu_logo.svg
│   ├── components               # 自定义业务组件
│   │   ├── CustomDialog         # 基础弹窗组件
│   │   │   └── index.tsx
│   │   ├── DialogTable          # 带弹窗处理的表格组件
│   │   │   └── index.tsx
│   │   ├── EmptyBlock           # 空组件
│   │   │   ├── index.module.scss
│   │   │   └── index.tsx
│   │   ├── Exception            # 异常组件
│   │   │   ├── index.module.scss
│   │   │   └── index.tsx
│   │   ├── FilterTable          # 带筛选处理的表格组件
│   │   │   ├── components
│   │   │   │   └── TableException
│   │   │   │       └── index.tsx
│   │   │   ├── index.module.scss
│   │   │   └── index.tsx
│   │   ├── FixedBottom          # 固定在页面底部组件
│   │   │   ├── index.module.scss
│   │   │   └── index.tsx
│   │   ├── FontRender          # 统一字体颜色管理组件
│   │   │   └── index.tsx
│   │   ├── FormItem            # 表单项组件
│   │   │   └── index.tsx
│   │   ├── PageHeader          # 系统默认的页头路径组件
│   │   │   ├── index.module.scss
│   │   │   └── index.tsx
│   │   ├── SuccessDetail       # 成功页面组件
│   │   │   ├── index.module.scss
│   │   │   ├── index.tsx
│   │   │   └── utils.tsx
│   │   └── WrapperPage        # 权限管理组件
│   │       └── index.tsx
│   ├── config.ts              # 通用配置项
│   ├── global.scss            # 全局样式
│   ├── layouts                # 布局组件
│   │   ├── BasicLayout        # 默认的项目主框架布局
│   │   │   ├── components
│   │   │   │   ├── Footer
│   │   │   │   │   ├── index.module.scss
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── HeaderAvatar
│   │   │   │   │   ├── index.module.scss
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── HeaderContent
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── Logo
│   │   │   │   │   ├── index.module.scss
│   │   │   │   │   └── index.tsx
│   │   │   │   └── PageNav
│   │   │   │       └── index.tsx
│   │   │   ├── index.tsx
│   │   │   ├── menuConfig.ts
│   │   │   └── util.tsx
│   │   ├── SecurityLayout        # 含有权限管理布局
│   │   │   └── index.tsx
│   │   └── UserLayout            # 不含 Tab 卡的基础布局
│   │       ├── index.module.scss
│   │       └── index.tsx
│   ├── models                    # 应用级数据状态
│   │   └── user.ts
│   ├── pages                     # 页面
│   │   ├── Auth                  # 权限页面
│   │   │   └── index.tsx
│   │   ├── Feedback              # 异常页面处理
│   │   │   ├── Forbidden         # 无权限
│   │   │   │   └── index.tsx
│   │   │   ├── NotFound          # 页面未找到
│   │   │   │   └── index.tsx
│   │   │   └── ServerError       # 服务器异常
│   │   │       └── index.tsx
│   │   ├── Interview             # 面试相关处理页面
│   │   │   ├── Detail            # 面试流程页面
│   │   │   │   ├── components
│   │   │   │   │   └── FlowForm
│   │   │   │   │       ├── index.module.scss
│   │   │   │   │       └── index.tsx
│   │   │   │   └── index.tsx
│   │   │   └── Manage            # 面试列表页面
│   │   │       ├── components
│   │   │       │   └── FilterTable
│   │   │       │       └── index.tsx
│   │   │       └── index.tsx
│   │   ├── Login                 # 登录页面
│   │   │   ├── components
│   │   │   │   └── LoginBlock
│   │   │   │       ├── index.module.scss
│   │   │   │       ├── index.tsx
│   │   │   │       └── utils.tsx
│   │   │   └── index.tsx
│   │   ├── Resume                 # 简历相关处理页面
│   │   │   ├── Manage             # 简历管理页面
│   │   │   │   ├── components
│   │   │   │   │   └── FilterTable
│   │   │   │   │       └── index.tsx
│   │   │   │   └── index.tsx
│   │   │   └── Upload             # 简历上传页面
│   │   │       ├── components
│   │   │       │   └── BasicForm
│   │   │       │       ├── index.module.scss
│   │   │       │       ├── index.tsx
│   │   │       │       └── map.tsx
│   │   │       └── index.tsx
│   │   ├── System               # 系统管理页面
│   │   │   ├── DicitemManage    # 字典管理页面
│   │   │   │   ├── components
│   │   │   │   │   └── FilterTable
│   │   │   │   │       └── index.tsx
│   │   │   │   └── index.tsx
│   │   │   ├── Function         # 岗位管理页面
│   │   │   │   ├── components
│   │   │   │   │   └── FilterTable
│   │   │   │   │       └── index.tsx
│   │   │   │   └── index.tsx
│   │   │   ├── Job              # 职位管理页面
│   │   │   │   ├── components
│   │   │   │   │   └── FilterTable
│   │   │   │   │       └── index.tsx
│   │   │   │   └── index.tsx
│   │   │   ├── Organization    # 部门管理页面
│   │   │   │   ├── components
│   │   │   │   │   └── FilterTable
│   │   │   │   │       └── index.tsx
│   │   │   │   └── index.tsx
│   │   │   └── UserManage      # 用户管理页面
│   │   │       ├── components
│   │   │       │   └── FilterTable
│   │   │       │       └── index.tsx
│   │   │       └── index.tsx
│   │   └── components       # 页面通用简历组件
│   │       └── ResumeForm
│   │           └── util.tsx
│   ├── routes.ts              # 路由配置
│   ├── services               # 接口对接处理
│   │   ├── API.d.ts
│   │   ├── Bu.tsx
│   │   ├── Dicitem.tsx
│   │   ├── Function.tsx
│   │   ├── Interviewee.tsx
│   │   ├── IntervieweeRecord.tsx
│   │   ├── Jobs.tsx
│   │   ├── RecommendRecord.tsx
│   │   ├── User.tsx
│   │   └── util.tsx
│   └── store.ts                   # store 初始化配置
├── build.json                     # 工程配置
├── README.md                      # 项目基础说明
├── package-lock.json
├── package.json
├── .editorconfig
├── .eslintignore
├── .eslintrc.js
├── .gitignore
├── .stylelintignore
├── .stylelintrc.js
├── .gitignore
└── tsconfig.json             # tsconfig.json 初始化配置


73 directories, 94 files
```

## 使用到的技术

* [ice.work](https://ice.work/)
* [fusion UI demo](https://fusion.design/)
* [ahooks](https://ahooks.js.org/zh-CN/hooks/)
* [bizcharts](https://bizcharts.net/product/bizcharts)
* [主题定制](https://ice.work/docs/guide/advance/fusion)
* [所有主题变量](https://fusion.design/pc/component/tokens)