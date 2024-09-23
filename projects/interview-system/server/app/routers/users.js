module.exports = app => {
  const { router, controller } = app
  const { users } = controller
  router.get('/user/current/:param?', users.current)
  router.post('/user/page/:param?', users.page)
  router.put('/user/unlock/:id', users.unlock)
  router.put('/user/lock/:id', users.lock)
  router.post('/login/', users.login)
  router.delete('/login/', users.outLogin)

  router.resources('users', '/user', users)
}
