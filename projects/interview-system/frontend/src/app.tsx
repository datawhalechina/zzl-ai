import React from 'react'
import { runApp, IAppConfig, logger } from 'ice'
import { Message } from '@alifd/next'
import Exception from '@/components/Exception'

const errPath = {
  401: '/user/login',
  404: '/error/404',
  403: '/error/403',
  500: '/error/500',
}

const appConfig: IAppConfig = {
  app: {
    rootId: 'ice-container',
    // 是否开启 ErrorBoundary，默认为 false
    errorBoundary: true,
    // 自定义错误边界的 fallback UI
    ErrorBoundaryFallback: () => <Exception />,
    // 自定义错误的处理事件
    onErrorBoundaryHander: (error: Error, componentStack: string) => {
      // Do something with the error
      logger.error(error)
      logger.error(componentStack)
    },
  },
  auth: {
    // 可选的，设置无权限时的展示组件，默认为 null
    // NoAuthFallback: <div>没有权限...</div>,
    // 或者传递一个函数组件
    NoAuthFallback: () => <div>没有权限..</div>,
  },
  router: {
    type: 'browser',
    basename: '/',
    fallback: <div>loading...</div>,
    modifyRoutes: (routes) => {
      return routes
    },
  },
  request: {
    // 可选的，全局设置 request 是否返回 response 对象，默认为 false
    // withFullResponse: true,
    baseURL: '/api',
    // 拦截器
    interceptors: {
      request: {
        onConfig: (config) => {
          // 发送请求前：可以对 RequestConfig 做一些统一处理
          Message.show({
            type: 'loading',
            content: '数据请求中',
          })
          return config
        },
        onError: (error) => {
          logger.log('get error')
          return Promise.reject(error)
        },
      },
      response: {
        onConfig: (response) => {
          // 关闭之前的等待进度条
          Message.hide()
          // 请求成功：可以做全局的 toast 展示，或者对 response 做一些格式化
          // Message.success(response.data.msg)
          return response
        },
        onError: (error) => {
          // 请求出错：服务端返回错误状态码
          Message.hide()
          const res = error.response
          Message.error(`[${res?.status}] ${res?.data.msg || '系统发生错误，请联系管理员'}`)
          res?.status && errPath[res?.status] && window.location.replace(errPath[res?.status])
          return Promise.reject()
        },
      },
    },
  },
}

runApp(appConfig)
