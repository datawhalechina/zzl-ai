module.exports = app => {
  const { router, controller } = app
  router.post('/functions/page/:param?', controller.functions.page)
  router.get('/functions/bu/:buId', controller.functions.getDetailByBuId)
  router.resources('Functions', '/functions', controller.functions)
  // 获取所有职能(id, name)列表，不分页
  // GET /functions            app.controllers.functions.index
  // GET /functions/:id        app.controllers.functions.show
  // POST /functions           app.controllers.functions.create
  // PUT /functions/:id        app.controllers.functions.update
  // DELETE /functions/:id     app.controllers.functions.destroy
}
