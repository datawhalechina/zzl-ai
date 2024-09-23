// 把之前安装到 node_modules 下的 puppeteer 模块加载进来
const puppeteer = require('puppeteer')
// 在 getHomePage 函数里面，定制一系列任务，让他们顺序执行
async function getHomePage (link) {
// 启动一个 Chrome 引擎实例，加上 await 会一直等待它启动完成
// 加上 headless: false 会打开一个浏览器，可以眼睁睁看这一切发生，如果是 true 则 静默执行
// const browser = await puppeteer.launch({headless: false})
const browser = await puppeteer.launch({headless: false})
// 启动成功后，打开一个新页面
const page = await browser.newPage()
// 新页面里面输入目标网址，跳到这个网页，一直等待页面加载完成
await page.goto(link)
// 设置网页视窗的宽高
await page.setViewport({width: 1080, height: 750})
// 告诉 puppeteer 开始截图，直到截图完成，存储图片到当前目录
await page.screenshot({path: Date.now() + '.png'})
// 最后关闭浏览器，销毁所有变量
await browser.close()
return 'done!'
}
// 调用这个异步函数 getHomePage，传入待截图网站，任务开始执行
getHomePage('https://juejin.cn/user/3705833332160473/posts').then(v => {})