module.exports = app => {
  const { router, controller } = app
  router.post('/job/page/:param?', controller.job.page)
  router.post('/job/find/:param?', controller.job.findByParam)
  router.resources('Job', '/job', controller.job)
  // 获取所有职能(id, name)列表，不分页
  // GET /job	        app.controllers.job.index
  // GET /job/:id	    app.controllers.job.show
  // POST /job	job	  app.controllers.job.create
  // PUT /job/:id	    app.controllers.job.update
  // DELETE /job/:id	app.controllers.job.destroy
}
