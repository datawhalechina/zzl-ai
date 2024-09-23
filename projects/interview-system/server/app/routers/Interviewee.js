module.exports = app => {
  const { router, controller } = app
  router.post('/interviewee/upload', controller.interviewee.upload)
  router.post('/interviewee/page/:param?', controller.interviewee.page)
  router.resources('Interviewee', '/interviewee', controller.interviewee)
  // 获取所有职能(id, name)列表，不分页
  // GET /interviewee	         app.controllers.interviewee.index
  // GET /interviewee/:id	     app.controllers.interviewee.show
  // PUT /interviewee/:id	     app.controllers.interviewee.update
  // DELETE /interviewee/:id	 app.controllers.interviewee.destroy
}
