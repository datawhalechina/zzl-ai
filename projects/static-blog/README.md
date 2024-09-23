## 使用教程：

### 编译markdown文件成html

```shell
npm run build
```

### 启动静态服务
```shell
npm run start
```

启动后，因为我们的路由定义的是 ```app.get('/posts/:post', ...)```，我们要访问我们刚刚build后的文件，我们访问：http://[localhost:3001/post](http://localhost:3001/posts/first-post)