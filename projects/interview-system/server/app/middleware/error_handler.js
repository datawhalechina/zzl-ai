module.exports = () => {
  return async function errorHandler(ctx, next) {
    try {
      await next()
      if (ctx.status === 404 && !ctx.body) {
        ctx.failMsg('未找到对应接口')
        ctx.status = 404
        return
      }
    } catch (err) {
      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      ctx.app.emit('error', err, ctx)
      const status = err.status || 500
      const defaultErrMsg = '[catch error]'
      const reallyErrMsg = err.errors ? err.errors[0].message : err.message
      // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
      let errMsg = status === 500 && ctx.app.config.env === 'prod'
        ? 'Internal Server Error'
        : reallyErrMsg
      if (status === 422) {
        // 这里是参数校验错误
        try {
          const errs = (
            Array.isArray(err.errors) ? err.errors : [err.errors]
          ).reduce((prev, curt) => {
            const { message, field } = curt
            return prev + `${field}: ${message}; `
          }, '')
          errMsg = `字段不合法: ${errs}`
        } catch (err) {
          errMsg = '字段不合法'
        }
        ctx.failMsg(`${defaultErrMsg} ${errMsg}`)
        ctx.status = status
      } else {
        // 从 error 对象上读出各个属性，设置到响应中
        ctx.failMsg(`${defaultErrMsg} ${errMsg}`)
      }
    }
  }
}
