const fs = require('fs')
const downloadFile = require('../download-file.js')
const path = require('path')
const { log } = console

module.exports = async ({ name, url }) => {
  const docsPath = path.resolve(process.cwd(), './', 'documents')
  // 如果文件夹不存在，则直接创建
  if (!fs.existsSync(docsPath)) {
    fs.mkdirSync(docsPath, { recursive: true })
  }
  const docFilePath = path.join(docsPath, `${name}.html`)

  if (!fs.existsSync(docFilePath)) {
    log(`开始下载 [${name}]  ...`)
    await downloadFile(url, docFilePath)
  } else {
    log(`[${name}] 已下载过啦 ...`)
  }
}
