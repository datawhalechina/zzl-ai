// 一个核心 jQuery 实现的库，用于在服务器端进行 DOM 操作
// https://github.com/cheeriojs/cheerio
const cheerio = require('cheerio')
// 一个用来控制 Chrome 或 Chromium 的 Node库
// https://github.com/puppeteer/puppeteer
const puppeteer = require('puppeteer')

const url = 'https://juejin.cn/user/3705833332160473/posts'

async function scrollToBottom (page) {
  // page.evaluate() 为在浏览器中执行函数, 相当于在控制台中执行函数, 返回一个 Promise
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      let totalHeight = 0
      // 懒加载每次会增加的峰值是 2590 像素 ScrollHeight, 所以设置 2600
      const scrollStep = 2600
      // 定时器触发时间会决定能爬到动态页面（懒加载）的内容量
      // 如果值太小, 那么可能提前结束页面内容的抓取 (请求时间 > 定时器, 提前触发清除定时器的条件)
      const scrollTime = 1000

      const bodyScorllHeightInit = document.body.scrollHeight
      let bodyScorllHeight = document.body.scrollHeight

      const intervalId = setInterval(() => {
        // 把内容滚动指定的像素数，相对滚动
        window.scrollBy(10, scrollStep)
        totalHeight += scrollStep
        // 因为页面是懒加载的，document.body.scrollHeight 是会变化的
        // 当 document.body.scrollHeight 不再变化的时候，就滚到页面底部了
        const lastBodyScrollHeight = bodyScorllHeight
        bodyScorllHeight = document.body.scrollHeight
        if (lastBodyScrollHeight === bodyScorllHeight && bodyScorllHeight > bodyScorllHeightInit) {
          clearInterval(intervalId)
          resolve(totalHeight)
        }
      }, scrollTime)
    })
  })
}

async function run () {
  // 启动一个 Chrome 引擎实例，加上 await 会一直等待它启动完成
  const browser = await puppeteer.launch({
    // headless: false,
    slowMo: 250, // 可选：减慢 Puppeteer 的操作速度
    args: ['--remote-debugging-port=9222'],
    executablePath: '/Applications/Chromium.app/Contents/MacOS/Chromium',
  })
  // 启动成功后，打开一个新页面
  // // 官方打开页面: await browser.pages(), 会产生两个 tab 页, 一个是目标 tab 页, 一个是 blank 页
  const page = await browser.newPage()
  // // 仅仅打开目标页面
  // const page = (await browser.pages())[0]

  // networkidle2: 500ms 内有不超过 2 个网络连接时就算成功
  await page.goto(url, { waitUntil: 'networkidle2' })
  // 自定义浏览器宽高
  await page.setViewport({
    width: 1200,
    height: 2000
  })
  // 页面滚动至底部
  await scrollToBottom(page).catch(console.error);

  const html = await page.content()
  const $ = cheerio.load(html)
  const articles = $('.content-main')
  let totalViews = 0 
  let totalLikes = 0 
  let totalArticles = articles.length 
  // 遍历文章节点，分别统计它的浏览量和点赞量 
  articles.each(( element, index) => {
    const article = $(element) 
    const view = article.find('.view').find('span').text()
    const like = article.find('.like').find('span').text()
    console.log({like});
    totalViews += Number(view) 
    totalLikes += Number(like) | 0
    // if(index === articles.length -1 ){
    //   console.log($(element).text())
    // }
  })
  // 最后打印出来 
  console.log( 
  `共发表 ${totalArticles} 篇文章`, 
  `共 ${totalViews} 次浏览`, 
  `约 ${totalLikes} 点赞` 
  )

  await browser.close()
}

run()
