import axios from 'axios'
import {
  Modal,
  message
} from 'ant-design-vue'
import store from '@/store'
import moment from 'moment'
import router from '@/router'



const axiosPlus = {}

const errorMsg = (err = '系统错误，请稍后重新访问') => message.error(err)



const loginCheck = (config, customHeader, expireTime, needAuthArry) => {
  const theConfig = config;
  const configTemp = config.url;
  const tokenExist  = store.getters.token;

  if (needAuthArry.some((x) => configTemp.indexOf(x) !== -1) && tokenExist) {
    if (sessionStorage.getItem('t') && (moment().valueOf() - sessionStorage.getItem('t')) > expireTime) { // 如果token两小时过期
      router.push({
        path: '/',
      });
      sessionStorage.clear();
    } else {
      Object.entries(customHeader).forEach(item => {
        let key = item[0];
        let value = item[1];
        theConfig.headers[key] = value
      })
    }
  }
}


// 添加一个响应拦截器
axios.interceptors.response.use(
  response => {
    // return response
    sessionStorage.setItem('t', moment().valueOf());
    if(response.status!==200){
      message.error(res.message || 'Error')
      return Promise.reject(new Error(res.message || 'Error'))
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
      }else if(res.code === 0){
        return res
      }else {
        message.error(res.message);
      }
    }
  },
  error => {
    errorMsg(message);
    return Promise.reject(error.response.data)
  }
)

axiosPlus.install = function (Vue, options) {
  axios.defaults.baseURL = options.baseURL;
  axios.defaults.timeout = options.timeout;
  let customHeader = options.customHeader;
  let expireTime = options.expireTime || 2 * 3600 * 1000
  let needAuthArry = options.needAuthArry;
  Vue.prototype.$axios = axios



  axios.interceptors.request.use(
    config => {
      loginCheck(config, customHeader, expireTime, needAuthArry);
      return config
    },
    error => {
      return Promise.reject(error)
    }
  )

  Vue.prototype.$axiosPlus = function (
    url,
    method,
    _data = {},
    _invoking = 'invoking'
  ) {
    const param = method.toLowerCase() === 'get' ? 'params' : 'data'
    const opt = {
      url,
      method,
      [param]: _data
    }
    this[_invoking] = true;
    return new Promise((resolve, reject) =>{
      axios.request(opt)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
      .finally(() => {
        _invoking && (this[_invoking] = false)
      })
    })
  }

  Vue.mixin({
    data() {
      return {
        invoking: false,
      }
    }
  })
}

export default axiosPlus
