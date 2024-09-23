const cheerio = require('cheerio')
const puppeteer = require('puppeteer')
const url = 'https://juejin.cn/user/3705833332160473/posts'

async function run () {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(url, {waitUntil: 'networkidle2'})
  const html = await page.content()
  const $ = cheerio.load(html);
  const articles = $('.content-main')
  let totalViews = 0 
  let totalLikes = 0 
  let totalArticles = articles.length 
  // 遍历文章节点，分别统计它的浏览量和点赞量 
  articles.each((index, element) => {
    const article = $(element) 
    const view = article.find('.view').find('span').text()
    const like = article.find('.like').find('span').text()
    console.log({like});
    totalViews += Number(view) 
    totalLikes += Number(like) | 0
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
