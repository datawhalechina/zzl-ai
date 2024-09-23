module.exports = app => {
  const { router, controller } = app
  router.get('/bu/page/:param?', controller.bu.page)
  router.resources('Bu', '/bu', controller.bu)
  // 获取所有bu(id, name)列表，不分页
  // GET /bu	app.controllers.bu.index
  // GET /bu/:id	app.controllers.bu.show
  // POST /bu	bu	app.controllers.bu.create
  // PUT /bu/:id	app.controllers.bu.update
  // DELETE /bu/:id	app.controllers.bu.destroy
}
