module.exports = app => {
  const { router, controller: { sysDicItems } } = app

  router.post('/sysDicItems/find/:param?', sysDicItems.findByParam)
  router.get('/sysDicItems/group/:groupName', sysDicItems.group)
  router.post('/sysDicItems/page/:param?', sysDicItems.page)

  router.resources('SysDicItems', '/sysDicItems', sysDicItems)
  // 获取所有sysDicItems(id, name)列表，不分页
  // GET /sysDicItems	app.controllers.sysDicItems.index
  // GET /sysDicItems/:id	app.controllers.sysDicItems.show
  // POST /sysDicItems	sysDicItems	app.controllers.sysDicItems.create
  // PUT /sysDicItems/:id	app.controllers.sysDicItems.update
  // DELETE /sysDicItems/:id	app.controllers.sysDicItems.destroy
}
