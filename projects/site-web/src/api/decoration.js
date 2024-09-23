import Vue from 'vue'
let vm = new Vue()

const decoration = {
  getSiteInfo: (params)=>{//  获取所有站点
    return vm.$axiosPlus('/customer/decorate/get-site-style', 'get', params);
  },
  createDefaultSite: (params)=> {// 建立默认站点
    return vm.$axiosPlus('/customer/decorate/create-site', 'post', params);
  },
  fetchPages:(params)=>{  // 获取page列表
    return vm.$axiosPlus('/customer/decorate/fetch-pages','get', params)
  },
  saveSiteInfo: (params) => {
    return vm.$axiosPlus('/customer/decorate/save-site-info','post', params)
  },
  sitePublish: (siteId) => {
    return vm.$axiosPlus(`/customer/decorate/temporary-release/${siteId}`,'get')
  }
}
export default decoration
