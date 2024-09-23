const EventEmitter = require('events')

class Emitter extends EventEmitter { }

const { log } = console

// 实例化一个事件实例
const emitter = new Emitter();

const commands = [
  'print',
  'search',
  'choose',
  'download'
];

commands.forEach(key => {
  // 加载 search/choose/find/play 四个模块方法
  const fn = require(`./lib/commands/${key}`)
  // 为 emitter 增加 4 个事件监听，key 就是模块名
  emitter.on(key, async function (...args) {
    // 在事件回调里面，调用模块方法，无脑传入事件入参
    const res = await fn(...args)
    // 执行模块方法后，再触发一个新事件 hanlder
    // 同时把多个参数，如 key/res 继续丢过去
    this.emit('handler', key, res, ...args)
  })
})

// 搜索后触发 afterSearch，它回调里面继续触发 choose 事件
emitter.on('afterSearch', function (searchResult) {
  if (!Array.isArray(searchResult) || searchResult.length <= 0) {
    log(`没搜索到 ${searchName} 的相关结果`)
    return process.exit(1)
  }
  const result = searchResult.map(item => {
    const nameKeys = Object.keys(item.hierarchy)
    return {
      name: nameKeys.reduce((pre, key) => {
        if (item.hierarchy[key]) {
          pre.push(item.hierarchy[key])
        }
        return pre;
      }, []).join('-'),
      url: item.url.replace('xiaojusurveysrc', 'xiaojusurvey')
    }
  })
  this.emit('choose', result)
})

// 在歌曲被选中后，它回调里面继续触发 find 事件
emitter.on('afterChoose', function (answers, list) {
  const filterDocs = list.filter(item => answers.result.indexOf(`[${item.name}]`) > 0)
  if (filterDocs[0] && filterDocs[0].url) {
    this.emit('download', filterDocs[0], answers.result)
  }
})

// 收到下载结束，退出程序
emitter.on('downloadEnd', function () {
  log('下载结束!')
  process.exit()
})

// 这里的 handler 精简了多个事件的判断
// 为不同的事件增加了不同的触发回调
emitter.on('handler', function (key, res, ...args) {
  switch (key) {
    case 'search':
      return this.emit('afterSearch', res, args[0])
    case 'choose':
      return this.emit('afterChoose', res, args[0])
    case 'download':
      return this.emit('downloadEnd', res)
  }
})

module.exports = emitter
