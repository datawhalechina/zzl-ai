module.exports = app => {
  const { router, controller } = app
  router.get('/intervieweeRecord/steps/:intervieweeId', controller.intervieweeRecord.allProgress)
  router.post('/intervieweeRecord/next/:id', controller.intervieweeRecord.nextProgress)
  router.post('/intervieweeRecord/page/:param?', controller.intervieweeRecord.page)
  router.resources('intervieweeRecord', '/intervieweeRecord', controller.intervieweeRecord)
  // 获取所有 面试记录(id, name)列表，不分页
  // GET /intervieweeRecord            app.controllers.intervieweeRecord.index
  // GET /intervieweeRecord/:id        app.controllers.intervieweeRecord.show
  // POST /intervieweeRecord           app.controllers.intervieweeRecord.create
  // PUT /intervieweeRecord/:id        app.controllers.intervieweeRecord.update
  // DELETE /intervieweeRecord/:id     app.controllers.intervieweeRecord.destroy
}
