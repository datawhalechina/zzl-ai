# track-server

## 项目说明

使用 Koa 实现一个埋点服务

---

## 项目任务

- 创建一个包含路由内容的 Koa 服务，记录每次请求信息到数据库

---

## 使用说明

#### 启动服务

```sh
npm run start
```

在浏览器访问 http://localhost:7000/?user=a&page=1&action=click，在 db.json 查看记录结果
