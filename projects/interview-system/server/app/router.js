const { readdirSync } = require('fs')
const { extname, resolve } = require('path')

module.exports = app => {
  const checkFileType = (file) => extname(file) === '.js'
  const BASE_ROUTER = resolve(__dirname, './routers')
  readdirSync(BASE_ROUTER, 'utf-8')
    .filter(checkFileType)
    .map(file => {
      console.log(`[${app.config.projectName}] insert router ${file}`)
      require(resolve(BASE_ROUTER, file))(app)
    })
}
