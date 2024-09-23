import React from 'react'
import { Redirect } from 'ice'
import { Loading } from '@alifd/next'
import { stringify } from 'query-string'
import store from '@/store'
import { useMount } from 'ahooks'

const LoginWrapper = (WrappedComponent) => {
  const Wrapped = () => {
    const [user, userDispatchers] = store.useModel('user')

    useMount(() => {
      const getUser = async () => {
        await userDispatchers.getUserInfo()
      }
      !user.id && getUser()
      return undefined
    })

    const isLogin = user && user.id
    const queryString = stringify({
      redirect: window.location.href,
    })

    if (!isLogin) {
      return <Loading style={{ display: 'block' }} />
    }

    if (!isLogin && window.location.pathname !== '/user/login') {
      return <Redirect to={`/user/login?${queryString}`} />
    }
    return <div>{<WrappedComponent />}</div>
  }

  return Wrapped
}

export default LoginWrapper
