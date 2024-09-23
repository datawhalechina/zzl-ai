import React from 'react'
import { ResponsiveGrid } from '@alifd/next'
import LoginBlock from './components/login_block'

const { Cell } = ResponsiveGrid

const Login = () => {

  return (
    <ResponsiveGrid gap={20}>
      <Cell colSpan={12}>
        <LoginBlock />
      </Cell>
    </ResponsiveGrid>
  )
}

export default Login
