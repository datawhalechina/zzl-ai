const https = require('https')
const fs = require('fs')
const slog = require('single-line-log').stdout
const path = require('path')
const { log } = console
module.exports = (url, dirName) => new Promise((resolve, reject) => {
  // 确保 dest 路径存在
  const file = fs.createWriteStream(dirName, { flags: 'a+' })
  // 获取当前下载的音乐名称
  const musicName = path.basename(dirName)

  https.get(url, (res) => {
    if (res.statusCode !== 200) {
      reject(res.statusCode)
      return
    }
    // 获取当前文件流完整大小
    const contentLength = parseInt(res.headers['content-length'])
    let downLength = 0
    // 进度、超时等
    res.on('data', (chunk) => {
      downLength += chunk.length
      const progress = Math.floor(downLength * 100 / contentLength)
      const str = `下载 [ ${musicName} ] 进度：${progress}%`
      slog(str)
    })
    file.on('finish', () => {
      log('\t 文件保存完成')
      file.close(resolve)
    }).on('error', (err) => {
      fs.unlink(dirName)
      reject(err.message)
    })
    res.pipe(file)
  })
})
