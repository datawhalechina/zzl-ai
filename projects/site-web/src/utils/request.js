import axios from 'axios'
import {
  Modal,
  message
} from 'ant-design-vue'
// import Vue from 'vue';
import store from '@/store'
import {
  getToken
} from '@/utils/auth'

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // baseURL: "https://pscard.adyun.com/",
  // baseURL: "http://10.0.41.175:8888/",
  // baseURL: "http://192.168.198.2:8888",


  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
  // headers: {
  //   'Content-Type': "application/json;charset=utf-8",
  //   'Access-Control-Allow-Origin': "http://localhost:8080",
  //   'Access-Control-Allow-Credential': true
  // }

})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['SiteToken'] = "Bearer " + getToken()

    }
    // console.log(config)
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    if(response.status!==200){
      message.error(res.message || 'Error')
    } else {
      const res = response.data;
      if (res.code === 9993) {
        Modal.confirm({
          title: 'Confirm logout',
          content: 'You have been logged out, you can cancel to stay on this page, or log in again',
          onOk: () => {
            store.dispatch('user/resetToken').then(() => {
              location.reload()
            })
          },
          onCancel: () => {
            message.info("已取消");
          }
        })
        return Promise.reject(new Error(res.message || 'Error'))
      }else {
        return res
      }
    }

  },
  error => {
    console.log('err' + error) // for debug
    message.error(error.message || 'Error')
    return Promise.reject(error)
  }
)




export default service
