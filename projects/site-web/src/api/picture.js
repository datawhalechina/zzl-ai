import Vue from 'vue'
let vm = new Vue()

const picture = {
  pagainationList: (params)=>{
    return vm.$axiosPlus('/customer/resource/fetch-list', 'get', params);
  },
  getOSSToken: (params) => {
    return vm.$axiosPlus('/customer/ali-oss/get-token', 'get', params);
  },
  deleteResource:(params)=>{
    return vm.$axiosPlus('/customer/resource/del-resource', 'delete', params)
  },
  renameResource(params) {
    return vm.$axiosPlus('/customer/resource/rename-resource', 'put', params)
  }
}



import request from '@/utils/request'
// import QS from 'qs'
export function pagainationList(params) {
  return request({
    url: '/customer/resource/fetch-list',
    method: 'get',
    params,
  })
}

// 获取OSS直传签名
export function getOSSToken(params) {
  return request({
    url: '/customer/ali-oss/get-token',
    method: 'get',
    params,
  })
}

// 资源删除
export function deleteResource(params) {
  return request({
    url: '/customer/resource/del-resource',
    method: 'delete',
    data: params
  })
}

// 资源改名
export function renameResource(params){
  return request({
    url: '/customer/resource/rename-resource',
    method: 'put',
    data: params,
  })
}

export default picture
