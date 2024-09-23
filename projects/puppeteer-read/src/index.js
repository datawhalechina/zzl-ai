const cheerio = require('cheerio')
const puppeteer = require('puppeteer');
const url = 'https://juejin.cn/user/3705833332160473/posts'
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      let totalHeight = 0;
      const distance = 100; // 每次滚动的距离
      const scrollTime = 1000
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, scrollTime); // 每次滚动的间隔时间
    });
  });
}

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: '/Applications/Chromium.app/Contents/MacOS/Chromium',
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' })
  // 自动滚动页面，加载所有内容
  await autoScroll(page);
  const html = await page.content()
  const $ = cheerio.load(html)
  const articles = $('.content-main')
  let totalViews = 0 
  let totalLikes = 0 
  let totalArticles = articles.length 
  // 遍历文章节点，分别统计它的浏览量和点赞量 
  articles.each(( index, element ) => {
    const article = $(element) 
    const view = article.find('.view').find('span').text()
    const like = article.find('.like').find('span').text()
    // console.log({like});
    totalViews += Number(view) 
    totalLikes += Number(like) | 0
    if(index === articles.length -1 ){
      console.log($(element).text())
    }
  })
  // 最后打印出来 
  console.log( 
  `共发表 ${totalArticles} 篇文章`, 
  `共 ${totalViews} 次浏览`, 
  `约 ${totalLikes} 点赞` 
  )


  await browser.close();
})();
