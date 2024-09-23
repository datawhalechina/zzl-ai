// lowdb是一个 ESM package，所以需要使用import语法导入
import Koa from 'koa'
import Router from 'koa-router'
import { JSONFilePreset } from 'lowdb/node'

// 创建一个 Koa 服务实例
const app = new Koa()
// 创建一个路由的实例
const router = new Router()

// 创建一个数据库实例，这里用 lowdb 的 JSON 存储来模拟数据库而已
// 初始化数据库，可以看做是数据库的字段定义
const defaultData = {
    visits: [],
}
const db = await JSONFilePreset('db.json', defaultData)

// 当有请求进来，路由中间件的异步回调会被执行
router.get('/', async (ctx, next) => {
    const ip = ctx.header['x-real-ip'] || ''
    const { user, page, action } = ctx.query
    // 更新数据库
    await db.update(({ visits }) => {
        const visit = { ip, user, page, action }
        visits.push(visit)
     })
    // 返回更新后的数据库字段
    await db.read()
    ctx.body = { success: 1, visits: db.data }
})
// 把中间件压入队列，等待执行
app
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(7000, function(){
        console.log('please visit http://localhost:7000/?user=a&page=1&action=click')
    })