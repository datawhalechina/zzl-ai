# merge-json

中英文 JSON 合并工具

---

#### 启动服务

```sh
node index.js
```

#### 执行结果说明

```javascript
// 方案 1，文件分组，每次读 N 个，避免一次性读入太多文件
// 缺点是写的时候，可能会持有一个太大的字符串导致写入失败
const bt = new BatcherTool({ dir, dest: btdest, step: 2 });
bt.merge();

// 方案 2，人肉控制读写速度，把 JSON 数据逐条逐条写入文件
// 缺点是不灵活，人肉控制文件逐一同步读出和逐行写入，效率不高
const lt = new LineTool({ dir, dest: ltdest });
lt.merge();

// 方案 3，借助读写流的管道管控，更灵活的配置管道中文件数据量，及批量写入数据
const st = new StreamTool({ dir, dest: stdest, highWaterMark: 2 });
st.merge();
```

---

## 项目结构说明

```sh
$ tree -I node_modules
.
├── index.js                                    # 项目主功能入口
├── lib                                         # 项目处理类文件夹
│   ├── batch.js                                # 文件分组拷贝处理代码文件
│   ├── line.js                                 # 逐行写入处理代码文件
│   ├── stream.js                               # 管道管控处理代码文件
├── package-lock.json                           # 项目 lock 依赖版本说明
├── package.json                                # 项目依赖和版本相关说明
├── .gitignore                                  # 项目 git 提交忽略文件说明
└── README.md                                   # 项目通用说明

1 directories, 8 files
```

## License

ISC

---
