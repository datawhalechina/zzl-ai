const formatUrl = (url) => {
  const tempUrl = url.toString()
  return tempUrl.indexOf('/') > -1 ? tempUrl.replace(/\//g, '') : tempUrl
}
module.exports = () => {
  return async function gateway (ctx, next) {
    if (ctx.url.indexOf('swagger') > -1) {
      return await next()
    }
    // 非白名单请求，需要添加相关必备请求参数
    ctx.info('[gateway check user]: ')
    ctx.info(ctx.user)
    const isLoginPath = formatUrl(ctx.url).search(ctx.app.config.authWhiteReg) > -1
    if (isLoginPath) {
      return await next()
    }
    // 后台持久化登录数据
    const hasRightParam = !isLoginPath && !ctx.sessionId
    if (hasRightParam) {
      ctx.info(`${ctx.app.config.authWhiteReg},  ${ctx.url},  ${isLoginPath}`)
      return ctx.unauthorized()
    }
    const isSafeMethod = ctx.method.toLowerCase() === 'get'
    if (isSafeMethod) {
      return await next()
    }

    const needAdminAuth = ctx.app.config.adminWhiteReg.test(ctx.url)
    if (needAdminAuth && !ctx.checkUseAuth(0)) {
      return ctx.failMsg(ctx.authErrMsg)
    }
    const needManageAuth = ctx.app.config.manageWhiteReg.test(ctx.url)
    if (needManageAuth && !ctx.checkUseAuth()) {
      return ctx.failMsg(ctx.authErrMsg)
    }
    await next()
  }
}
