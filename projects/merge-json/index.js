/*
目标：把 json 下几千个 json 文件合并成一个大的 json 文件

- json
  - 1.json {"a": 1, "b": "b"}
  - 2.json {"b": 1}
  - 3.json {"c": 1}
  - 4.json {"d": 1}
  ...

  去重 key, 合并后的 data.json
  {"a":1,"b":"b","c":1,"d":1}

  实际方案的取舍优化，需要结合实际的场景，参考如下四个指标：
  1. 文件数量多（需要处理并发）
  2. 文件体积大（需要处理内存）
  3. 合并速度优先（最大并发思路）
  4. 合并稳定性优先（有限使用内存思路）

  还有服务器内存、硬盘...等因素，本项目仅抛砖引玉，提供几种思路
*/
const { resolve } = require('path')
const { writeFileSync, existsSync, unlinkSync } = require('fs')
const BatcherTool = require('./lib/batch')
const LineTool = require('./lib/line')

// 清理生成的 JSON 文件
const deleteAndTouchFile = file => {
  if (file && existsSync(file)) {
    try {
      unlinkSync(file)
      console.log(`已删除 ${file}`)
    } catch (err) {
      console.log(err)
    }
  }

  try {
    writeFileSync(file, '')
    console.log(`已创建空的 ${file}`)
  } catch (err) {
    console.log(err)
  }
}

// ([+- 以及正则开头的斜杠前面要加上分号
;(async function () {
  const dir = resolve(__dirname, './json')
  const btdest = resolve(__dirname, './data_bt.json')
  const ltdest = resolve(__dirname, './data_lt.json')

  // 方案 1，文件分组，每次读 N 个，避免一次性读入太多文件
  // 缺点是写的时候，可能会持有一个太大的字符串导致写入失败
  deleteAndTouchFile(btdest)
  console.time('文件分组耗时')
  const bt = new BatcherTool({ dir, dest: btdest, step: 2 })
  bt.merge()
  console.timeEnd('文件分组耗时')

  deleteAndTouchFile(ltdest)
  // 方案 2，人肉控制读写速度，把 JSON 数据逐条逐条写入文件
  // 缺点是不灵活，人肉控制文件逐一同步读出和逐行写入，效率不高
  console.time('逐行写入耗时')
  const lt = new LineTool({ dir, dest: ltdest })
  lt.merge()
  console.timeEnd('逐行写入耗时')
})()
