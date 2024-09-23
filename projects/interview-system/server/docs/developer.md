## 开发说明

### 访问接口 swagger 文档

启动项目之后，访问 http://127.0.0.1:7001/swagger-ui.html

---

### 第一次接手项目

#### 数据库启动准备

> step 01 启动 mysql

- 可以使用 brew

```sh
~ % brew services start mysql
Service `mysql` already started, use `brew services restart mysql` to restart.
~ % brew services restart mysql
```

- 也可以使用 sudo

```sh
~ % sudo mysql.server start
Starting MySQL
 SUCCESS!

```

显示如上结果说明 `mysql` 服务启动了

---

> step 02 确认 mysql 启动状态

```sh
$ sudo mysql.server status
Password:
 SUCCESS! MySQL running (43260)

```

显示如上结果说明 `mysql` 服务是正常启动的

---

> step 03 修改 mysql root 用户密码

- 登录本地 mysql

```sh
$ mysql -u root -p
Enter password:
```

- 查看密码策略

```sh
$ mysql> SHOW VARIABLES LIKE 'validate_password%';
+--------------------------------------+--------+
| Variable_name                        | Value  |
+--------------------------------------+--------+
| validate_password.check_user_name    | ON     |
| validate_password.dictionary_file    |        |
| validate_password.length             | 8      |
| validate_password.mixed_case_count   | 1      |
| validate_password.number_count       | 1      |
| validate_password.policy             | MEDIUM |
| validate_password.special_char_count | 1      |
+--------------------------------------+--------+
7 rows in set (0.03 sec)

```

关于 mysql 密码策略相关参数；

- 1. validate_password_length 固定密码的总长度；
- 2. validate_password_dictionary_file 指定密码验证的文件路径；
- 3. validate_password_mixed_case_count 整个密码中至少要包含大/小写字母的总个数；
- 4. validate_password_number_count 整个密码中至少要包含阿拉伯数字的个数；
- 5. validate_password_policy 指定密码的强度验证等级，默认为 MEDIUM；

  关于 validate_password_policy 的取值：

  - 0/LOW：只验证长度；
  - 1/MEDIUM：验证长度、数字、大小写、特殊字符；
  - 2/STRONG：验证长度、数字、大小写、特殊字符、字典文件；

- 6. validate_password_special_char_count 整个密码中至少要包含特殊字符的个数；

- 修改密码策略

首先需要设置密码的验证强度等级，设置 validate_password.policy 的全局参数为 LOW 即可

```sh
$ mysql> set global validate_password.policy=LOW;
Query OK, 0 rows affected (0.00 sec)
```

退出登录

- 修改 root 密码

修改为 `自己设置的密码` 这个时候只会警告不会强制不执行了

```sh
$ mysqladmin -u root -p password
Enter password:
New password:
Confirm new password:
Warning: Since password will be sent to server in plain text, use ssl connection to ensure password safety.

```

显示如上结果说明 `root` 用户密码修改成功了

---

#### 数据库基础数据准备

> step 01 新建 resume 数据库

新建 `resume` 数据库

```sh
$ npm run db:c
```

- 查看设置结果

```sh
$ mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| resume             |
| sys                |
+--------------------+
5 rows in set (0.01 sec)
```

- 选择数据库

```sh
mysql> use resume;
Database changed
```

---

> step 02 初始化 resume 数据库基础数据

执行以下指令，完成 `resume` 数据库数据基础迁移，主要是通过 `sequelize-cli` 将 `database` 文件夹下的内容进行快速初始化数据库

```sh
$ npm run db:m
```

如果发现入库的数据表结构是错误的，可以执行

```sh
$ npm run db:u
```

---

#### 安装依赖

```sh
$ npm i # or yarn
```

---

#### 启动项目

```sh
$ npm run dev
```

---

### 新增迁移数据表

```sh
# npm run db:g init-${table}
$ npm run db:g init-test
```

然后在 `server/database/migrations/${date}-init-test.js` ，新增数据表配置

```javascript
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("test", {
      field01: Sequelize.STRING(50),
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("test");
  },
};
```

---

### 快速填充数据表数据

先执行以下指令

```sh
# npm run db:i insert-${table}
$ npm run db:g insert-test
```

然后在 `server/database/migrations/${date}-insert-test.js` ，新增相关数据

```javascript
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.XXlkInsert("test", [
      {
        field01: "test01",
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("test");
  },
};
```

---

## 能力扩展说明

- [server/app/extend/context.js] controller 文件夹下中常用 的 `this.ctx` 能力扩展

- [server/app/extend/helper.js] application 中常用通过 helper 能访问到的扩展

- [server/app/core/controller.js] controller 文件夹下中常用 的 `this` 能力扩展

- [server/app/core/services.js] services 文件夹下中常用 的 `this` 能力扩展

---

## 新增模型结构说明

需要在以下文件夹中新增 `XX.js` 文件，注意模型命名规范是大驼峰

> 新增表结构管理

- [server/database/migrations/XX.js]
- [server/app/model/XX.js]

> 新增表结构接口能力处理

先使用接口增删改查能力

- [server/app/controller/XX.js]
- [server/app/service/XX.js]

一般遵循以下原则

| Method | Path         | Route Name | Controller. Action          |
| :----- | :----------- | :--------- | :-------------------------- |
| GET    | /XX          | XX         | app.controllers. XX.index   |
| GET    | /XX/new      | new_post   | app.controllers. XX.new     |
| GET    | /XX/:id      | post       | app.controllers. XX.show    |
| GET    | /XX/:id/edit | edit_post  | app.controllers. XX.edit    |
| POST   | /XX          | XX         | app.controllers. XX.create  |
| PUT    | /XX/:id      | post       | app.controllers. XX.update  |
| DELETE | /XX/:id      | post       | app.controllers. XX.destroy |

> 在路由文件中配置对外暴露的能力

- [server/app/routers/XX.js]

一般按照规范写的 API 通过 `router.resources`直接注入就行，如果有自定义的内容，可以直接通过`router[noun](path, controller.XX.xx)` 注入就行

```javascript
module.exports = (app) => {
  const { router, controller } = app;
  router.resources("XX", "/XX", controller.XX);
  // 获取所有XX(id, name)列表，不分页
  // GET /XX	app.controllers.XX.index
  // GET /XX/:id	app.controllers.XX.show
  // POST /XX	XX	app.controllers.XX.create
  // PUT /XX/:id	app.controllers.XX.update
  // DELETE /XX/:id	app.controllers.XX.destroy
};
```

---

> 管理 swagger 中模型接口说明

在在 swagger 配置文件中，新增对相关接口请求参数和响应参数说明

- [server/app/contract/request/XX.js]
- [server/app/contract/response/XX.js]

注意也要在 `dto.js` 文件中注入 `XX` 模型技术数据结构

- [server/app/contract/dto.js]

这个时候再到下面文件中新增接口注解说明

- [server/app/controller/XX.js]

更多配置请看[官方文档](https://github.com/Yanshijie-EL/egg-swagger-doc#readme)

---

## 用户管理说明

- 用户密码入库的时候，是使用适当的哈希函数来加密哈希值，加密权重是 10 ，用户名作为盐
- 用户在输错密码之后账号会上锁 `2 * 60 * 60 * 1000` 2 小时
- 用户密码输错次数达到 5 次，强制锁定，不允许登录。
- 用户不能给自己解锁
- 用户不允许普通管理员删除其他管理员
- 用户不能删除自己

---

## service 能力实现说明

- 注意返回给前端的字段要尽可能精简，不要返回过多的冗余字段
- 注意返回给前端的关联表数据，全部都要 flat 成 一级属性
- 注意 数据库字段模型和请求参数模型之间的转化 ，一个是下划线格式，一个是小驼峰格式

---
