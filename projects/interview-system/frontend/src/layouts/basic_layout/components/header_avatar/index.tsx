import React from 'react'
import {  withRouter } from 'ice'
import store from '@/store'
import { outLogin, IUserProps } from '@/services/User'
import { Overlay, Menu, Icon } from '@alifd/next'
import styles from './index.module.scss'
import { RouteItemProps } from '.ice/router/types/base'

const { Item } = Menu
const { Popup } = Overlay

const UserProfile = ({ name, buName }: IUserProps) => {
  return (
    <div className={styles.profile}>
      <div className={styles.content}>
        <h3>
          {buName}/{name}
        </h3>
      </div>
    </div>
  )
}

const HeaderAvatar = (props: IUserProps & RouteItemProps) => {
  const { name = '', history, location } = props
  const [userInfo, userDispatchers] = store.useModel('user')
  /**
   * 退出登录，并且将当前的 url 保存
   */
  const loginOut = async () => {
    userInfo.id && (await userDispatchers.logout())
    const { pathname } = location
    // Note: There may be security issues, please note
    if (pathname.indexOf('login') === -1) {
      history.replace({ pathname: '/user/login' })
    }
  }
  // const onItemClick = (key: String, item?: Object, event?: Object) => {
  const onItemClick = (key: String) => {
    switch (key) {
      case 'logout': {
        loginOut()
        break
      }
      case 'upload': {
        history.push(`/resume/${key}`)
        break
      }
      default: {
        break
      }
    }
  }
  const firstNameLetter = name.match(/^./)?.[0]

  return (
    <Popup
      trigger={
        <div className={styles.headerAvatar}>
          <p className={styles.avatarName} title={`欢迎, ${name}登录人才库`}>
            {firstNameLetter}
          </p>
        </div>
      }
      triggerType="click"
    >
      <div className={styles.avatarPopup}>
        <UserProfile {...props} />
        <Menu className={styles.menu} onItemClick={onItemClick}>
          <Item key="upload">
            <Icon size="small" type="upload" />
            上传简历
          </Item>
          {/* <Item key="account"><Icon size="small" type="account" />个人设置</Item> */}
          <Item key="logout">
            <Icon size="small" type="exit" />
            退出
          </Item>
        </Menu>
      </div>
    </Popup>
  )
}

HeaderAvatar.defaultProps = {
  name: '',
  phone: '',
}

export default withRouter(HeaderAvatar)
