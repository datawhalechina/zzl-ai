import React, { useState, useEffect } from 'react'
import {  Redirect } from 'ice'
import { Loading } from '@alifd/next'
import { stringify } from 'query-string'
import store from '@/store'

const SecurityLayout = ({ children }: { children: React.ReactNode }) => {
  const [isReady, setIsReady] = useState<boolean>(false)
  const [user, userDispatchers] = store.useModel('user')
  useEffect(() => {
    const getUser = async () => {
      await userDispatchers.getUserInfo()
      setIsReady(true)
    }
    if (!user.id) {
      getUser()
    } else {
      setIsReady(true)
    }
    return undefined
  }, [user.id, userDispatchers])
  const isLogin = user && user.auth?.isLogin
  const queryString = stringify({
    redirect: window.location.href,
  })

  if (!isLogin || !isReady) {
    return <Loading style={{ display: 'block' }} />
  }

  if (!isLogin && window.location.pathname !== '/user/login') {
    return <Redirect to={`/user/login?${queryString}`} />
  }

  return children
}

export default SecurityLayout
