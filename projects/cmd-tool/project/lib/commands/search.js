const { post } = require('../request')

module.exports = async (text) => {
  const url = 'https://7zzdksz660-1.algolianet.com/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.20.0)%3B%20Browser%20(lite)%3B%20docsearch%20(3.5.2)%3B%20docsearch-react%20(3.5.2)%3B%20docusaurus%20(2.4.3)&x-algolia-api-key=f66dfe137c0976161fa9ac9671206139&x-algolia-application-id=7ZZDKSZ660'
  const body = {"requests":[{"query": text,"indexName":"XIAOJUSURVEY","params":"attributesToRetrieve=%5B%22hierarchy.lvl0%22%2C%22hierarchy.lvl1%22%2C%22hierarchy.lvl2%22%2C%22hierarchy.lvl3%22%2C%22hierarchy.lvl4%22%2C%22hierarchy.lvl5%22%2C%22hierarchy.lvl6%22%2C%22content%22%2C%22type%22%2C%22url%22%5D&attributesToSnippet=%5B%22hierarchy.lvl1%3A10%22%2C%22hierarchy.lvl2%3A10%22%2C%22hierarchy.lvl3%3A10%22%2C%22hierarchy.lvl4%3A10%22%2C%22hierarchy.lvl5%3A10%22%2C%22hierarchy.lvl6%3A10%22%2C%22content%3A10%22%5D&snippetEllipsisText=%E2%80%A6&highlightPreTag=%3Cmark%3E&highlightPostTag=%3C%2Fmark%3E&hitsPerPage=20&clickAnalytics=false&facetFilters=%5B%22language%3Azh%22%2C%5B%22docusaurus_tag%3Adefault%22%2C%22docusaurus_tag%3Adocs-default-current%22%5D%5D"}]}

  try {
    const res = await post(url, body)
    if (Array.isArray(res?.results) && Array.isArray(res?.results?.[0]?.hits)) {
      return res?.results?.[0]?.hits
    }
  } catch (error) {
    console.log('请求错误：' + error.message)
  }
  return []
}
