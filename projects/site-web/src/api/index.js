import Vue from 'vue';
// import axiosPlus from '@/assets/js/axiosPlus'
import vueAxiosPlus from 'vue-axios-plus1'
import { getToken } from '@/utils/auth'

console.log("Bearer "+getToken())

Vue.use(vueAxiosPlus, {
  baseURL: "http://10.0.41.175:8888/",
  timeout: 150000,
  customHeader: {
    'SiteToken': "Bearer",
    // 'test':'test'
  },
  expireTime: 2*3600*1000,
  needAuthArry: ['/customer/resource', '/customer/ali-oss', '/customer/account', '/customer/decorate']
})

import user from './user';
import picture from './picture';
import dashboard from './dashboard';
import decoration from './decoration';

const api = {
  user,
  picture,
  dashboard,
  decoration,
}



Vue.prototype.$api = api;
