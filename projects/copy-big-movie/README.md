# copy-big-movie

## 项目说明

拷贝大视频的小工具

---

## 项目任务

- 可以拷贝大视频文件的工具，可以怎么实现？
- 加分细节：文件(夹)是否存在检查/文件合法检查/文件读取错误提示/大文件的流式读写(stream/pipe)

---

## 使用说明

#### 启动服务

```sh
node index.js
```

#### 查看执行结果

```javascript
// 第一种：使用 Node 自带的 API - copyfile，拷大文件时，内存很可能就不够了
await runner(item, `./video/copyfile-${name}`, name, "copyfile", ft.copyFile);

// 第二种：使用 Node 的 API copyfile 传参 COPYFILE_FICLONE，拷大文件时，内存很可能就不够了

// 尝试通过 copy-on-write(cow) 快速，底层不支持则使用备选拷贝机制，关于 cow 大家可自行搜索

await runner(
  item,
  `./video/ficlone-${name}`,
  name,
  "copyfile_ficlone",
  ft.copyFileFiclone
);

// 第三种，使用 stream pipe，通过流和管道拷贝文件，拷大文件时，内存不太会被吃爆。
await runner(
  item,
  `./video/stream-${name}`,
  name,
  "stream_pipe",
  ft.copyFileStream
);
```
