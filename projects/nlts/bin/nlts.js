#!/usr/bin/env node
const pkg = require('../package')
const query = require('..').query
const update = require('..').update
function printResult(v) {
  update(v).then(dists => {
    const results = query(dists, v)
    console.log(results)
    process.exit()
  })
}
function printVersion() {
  console.log('nlts ' + pkg.version)
  process.exit()
}
function printHelp(code) {
  const lines = [
    '',
    '  Usage:',
    '    nlts [8]',
    '',
    '  Options:',
    '    -v, --version           print the version of vc',
    '    -h, --help              display this message',
    '',
    '  Examples:',
    '    $ ltsn 8',
    ''
  ]
  console.log(lines.join('\n'))
  process.exit(code || 0)
}
// 包的入口函数，里面对参数做剪裁处理，拿到入参并给予
// 不同入参的处理逻辑
function main(argv) {
  // 命令行的入参
  if (!argv) {
    printHelp(1)
  }
  // 兼容 nlts --lts=10
  const getArg = function() {
    let args = argv.shift()
    args = args.split('=')
    if (args.length > 1) {
      argv.unshift(args.slice(1).join('='))
    }
    return args[0]
  }
  let arg
  while (argv.length) {
    arg = getArg()
    switch(arg) {
      case '-v':
      case '-V':
      case '--version':
        printVersion()
      break
      case '-h':
      case '-H':
      case '--help':
        printHelp()
      break
        default:
        printResult(arg)
      break
    }
  }
}
// 启动程序就开始执行主函数
main(process.argv.slice(2))
module.exports = main