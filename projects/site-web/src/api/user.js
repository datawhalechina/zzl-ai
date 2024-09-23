import Vue from 'vue'
let vm = new Vue()

const user = {
  sendMsgCode: (mobile, ticket, sceneType) => {
    return vm.$axiosPlus('/customer/sms/send-sms-code', 'get', {mobile, ticket, sceneType})
  },
  passwordLogin: (mobile,password, ticket) => {
    return vm.$axiosPlus('/customer/auth/password-login', 'post', {mobile, password, ticket})
  },
  smsLogin: (mobile, smsCode) => {
    return vm.$axiosPlus('/customer/auth/sms-login', 'post', {mobile, smsCode})
  },
  register: (mobile, smsCode, password) => {
    return vm.$axiosPlus('/customer/auth/register', 'post', {mobile, smsCode, password})
  }
}

export default user
