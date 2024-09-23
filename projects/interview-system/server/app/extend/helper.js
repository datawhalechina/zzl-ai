module.exports = {
  errorFormat (err, ctx) {
    const { response, request } = ctx
    const used = Date.now() - ctx.starttime
    const extraMsg = `${request.url}, ${request.method}, status: ${response.status}, cost: ${used}ms`
    if (err instanceof Error) {
      return `${extraMsg}, ${err.name}: ${err.message}`
    }
    return `${extraMsg}, ${err}`
  }
}
