// 先 npm i cheerio request-promise 安装依赖模块
const cheerio = require("cheerio");
const rp = require("request-promise");
const url = "https://juejin.cn/user/3705833332160473/posts";

// 通过 request-promise 来爬取网页
rp(url).then(function (html) {
  // 利用cheerio 来分析网页内容，拿到所有小册子的描述,
  const $ = cheerio.load(html);
  // todo: 注意主页文章是异步获取的，所以拿不到全部
  const articles = $(".content-main");
  let totalViews = 0;
  let totalLikes = 0;
  let totalArticles = articles.length;
  // 遍历文章节点，分别统计它的浏览量和点赞量
  articles.each((index, element) => {
    const article = $(element);
    const view = article.find(".view").find("span").text();
    const like = article.find(".like").find("span").text();
    console.log({ like });
    totalViews += Number(view);
    totalLikes += Number(like) | 0;
  });
  // 最后打印出来
  console.log(
    `共发表 ${totalArticles} 篇文章`,
    `共 ${totalViews} 次浏览`,
    `约 ${totalLikes} 点赞`
  );
});
