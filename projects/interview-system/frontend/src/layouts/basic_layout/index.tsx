import React, { useState } from 'react'
import {  Redirect, withRouter } from 'ice'
import store from '@/store'
import { EUserRoleType } from '@/services/User'
import { Shell, ConfigProvider, Typography, ResponsiveGrid, Button, Icon } from '@alifd/next'
import PageNav from './components/page_nav'
import logoSrc from '@/assets/logo.svg'
import HeaderAvatar from './components/header_avatar'
import HeaderContent from './components/header_content'
import Logo from './components/logo'
import Footer from './components/footer'

import './util'
// import moment from 'moment'
// import { useInterval, useMount } from 'ahooks'
import { useMount } from 'ahooks'

interface IGetDevice {
  (width: number): 'phone' | 'tablet' | 'desktop';
}

const BasicLayout = ({ children, history }: { history: History; children: React.ReactNode }) => {
  const getDevice: IGetDevice = (width) => {
    const isPhone = typeof navigator !== 'undefined' && navigator && navigator.userAgent.match(/phone/gi)

    if (width < 680 || isPhone) {
      return 'phone'
    } else if (width < 1280 && width > 680) {
      return 'tablet'
    } else {
      return 'desktop'
    }
  }
  const [device, setDevice] = useState(getDevice(NaN))
  const [user, userDispatchers] = store.useModel('user')
  // const [nowTime, setNowTime] = useState(moment(Date.now()).format('YYYY.MM.DD HH:mm:ss'))
  useMount(() => {
    const getUser = async () => {
      await userDispatchers.getUserInfo()
    }
    !user.id && getUser()
  })
  // useInterval(() => {
  //   setNowTime(moment(Date.now()).format('YYYY.MM.DD HH:mm:ss'))
  // }, 1000)

  if (typeof window !== 'undefined') {
    window.addEventListener('optimizedResize', (e) => {
      const deviceWidth = (e && e.target && (e.target as Window).innerWidth) || NaN
      setDevice(getDevice(deviceWidth))
    })
  }
  if (!user.id) {
    return (
      <div>
        <Redirect to="/user/login" push={false} />
      </div>
    )
  }
  // https://ice.work/component/shell/
  return (
    <ConfigProvider device={device}>
      <Shell
        type="brand"
        style={{
          minHeight: '100vh',
        }}
      >
        <Shell.Branding>
          <Logo image={logoSrc} text="人才库" />
        </Shell.Branding>
        <Shell.AppBar>
          <Typography.Text strong>
            <h3 style={{ textAlign: 'right' }}>
              {' '}
              欢迎 {EUserRoleType[user.roleType]} {user.name}, 人才是企业的核心资产{' '}
              <Button type="primary" onClick={() => history.go(0)}>
                <Icon type="refresh" />
              </Button>
            </h3>
          </Typography.Text>
        </Shell.AppBar>
        <Shell.Action>
          <HeaderAvatar {...user} />
        </Shell.Action>
        <Shell.Navigation>
          <PageNav auth={user.auth} />
        </Shell.Navigation>

        <Shell.Content>
          <ResponsiveGrid gap={20}>
            <ResponsiveGrid.Cell colSpan={12}>
              <HeaderContent />
            </ResponsiveGrid.Cell>
            <ResponsiveGrid.Cell colSpan={12}>{children}</ResponsiveGrid.Cell>
          </ResponsiveGrid>
        </Shell.Content>
        <Shell.Footer>
          <Footer />
        </Shell.Footer>
      </Shell>
    </ConfigProvider>
  )
}
export default withRouter(BasicLayout)
