// 获取 package.json 内容
const pkg = require('../../package')

// 获取 log 终端输入能力
const { log } = console

function printVersion () {
  log('souge ' + pkg.version)
  process.exit()
}
/**
 * 在终端输出指令提示使用信息
 */
function printHelp (code) {
  const lines = `
    Usage:
    souge [songName]
    
    Options:
        -v, --version    print the version of souge
        -h, --help       display this message
    
    Examples:
        $ souge Hello
    `
  log(lines)
  process.exit(code || 0)
}

module.exports = (printType, param) => {
  return printType === 'version' ? printVersion() : printHelp(param)
}
