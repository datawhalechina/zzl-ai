import Vue from 'vue'
let vm = new Vue()

const dashboard = {
  overview: ()=>{
    return vm.$axiosPlus('/customer/account/overview', 'get');
  },
}
export default dashboard
