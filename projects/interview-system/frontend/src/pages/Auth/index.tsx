import React, { useEffect } from 'react'
import store from '@/store'
import {  Redirect, withRouter } from 'ice'
import { stringify } from 'query-string'

const LoginCheck = (props) => {
  const { location } = props
  const { pathname: oldPath } = location
  const [userInfo] = store.useModel('user')
  const currAuth = userInfo.auth
  const pathname = !currAuth?.isLogin ? '/user/login' : '/'
  const search = !currAuth?.isLogin
    ? stringify({
      redirect: oldPath,
    })
    : ''
  return <Redirect to={{ pathname, search }} push={false} />
}

export default withRouter(LoginCheck)
