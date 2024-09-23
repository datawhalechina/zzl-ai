
const Table = require('cli-table')
// 在服务器端进行 DOM 操作
const cheerio = require('cheerio')
const axios = require('axios')
const promiseLimit = require('promise-limit')
// 限制并发数量，防止爬虫被封
const limit = promiseLimit(2)

// 获取最新版本的Node.js API文档
const LatestApi = 'https://nodejs.org/docs/latest/api/'

async function run() {
    const { data } = await axios(LatestApi)
    // 使用cheerio解析HTML
    const $ = cheerio.load(data);

    const moduleList = $('#column2 ul').eq(1).find('a')
    const modulePathList = []
    moduleList.each((_,item) => {
        const apiName = item.children[0].data
        const apiPath = item.attribs.href
        modulePathList.push({apiName, apiPath})
    })

    const table = new Table({
        head: ['Module', 'Deprecated API']
    })

    async function getDeprecateApi(apiName, apiPath) {
        const apiUrl = `${LatestApi}${apiPath}`
        const { data } = await axios(apiUrl)
        const $ = cheerio.load(data)
        // 只从顶部的导航目录中筛选出已废弃的API
        const deprecatedList = Array.from($('#toc ul').find('.stability_0 code'))

        if (deprecatedList.length) {
            // 将已废弃的API拼接成字符串, 每个api换行
            const apiList = deprecatedList.reduce((pre,cur) => `${pre}${cur.children[0].data}\n`, '')
            table.push([apiName, apiList ])
        }
    }

    await Promise.all(modulePathList.map(item => limit(() => getDeprecateApi(item.apiName, item.apiPath))))

    // 输出废弃API的表格
    console.log(table.toString())
}

run()