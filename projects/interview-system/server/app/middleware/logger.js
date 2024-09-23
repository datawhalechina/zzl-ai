module.exports = () => {
  return async function logger (ctx, next) {
    const { response, request } = ctx
    ctx.info(`request start: status:${ctx.status} ,params: ${request.params || ''} , body: ${JSON.stringify(request.body)}, query: ${JSON.stringify(request.query)}`)
    await next()
    ctx.info(`request end: status: ${ctx.status}, data: ${JSON.stringify(response.body)} `)
  }
}
