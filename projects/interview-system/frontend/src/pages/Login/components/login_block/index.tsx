import React, { useState } from 'react'
import logoSrc from '@/assets/logo.svg'
import { useHistory,  Redirect } from 'ice'
import store from '@/store'
import { Input, Message, Form } from '@alifd/next'

import styles from './index.module.scss'

import { ILoginParamsType, IUserProps, accountLogin } from '@/services/User'
import { IResponseType } from '@/services/api'

const { Item } = Form

interface LoginProps {
  dataSource?: ILoginParamsType;
}

const LoginBlock: React.FunctionComponent<LoginProps> = (props: LoginProps) => {
  const [user, userDispatchers] = store.useModel('user')

  const history = useHistory()
  const { dataSource } = props

  const [postData, setValue] = useState(dataSource)

  // 如果已经登录过了 就直接跳转
  if (user.id || user.auth?.isLogin) {
    return <Redirect to={`/`} />
  }
  /**
   * 此方法会跳转到 redirect 参数所在的位置
   */
  const replaceGoto = () => {
    // https://ice.work/docs/guide/basic/api
    setTimeout(() => {
      history.replace('/')
    }, 100)
  }
  const formChange = (values: ILoginParamsType) => {
    setValue(values)
  }

  const handleSubmit = async (values: ILoginParamsType, errors: []) => {
    if (errors) {
      return
    }
    let res: IResponseType = {}
    try {
      // 登录
      res = await accountLogin({ ...values })
      if (res.status) {
        Message.success('登录成功！')
        await userDispatchers.getUserInfo()
        const [_user] = store.useModel('user')
        console.log(_user)
        // replaceGoto()
        return
      }
      Message.error(res.msg)
      // 如果获取到用户信息 就去设置登录信息
      // setUserLoginState(res);
    } catch (error) {
      Message.error(res?.msg || '登录失败，请重试！')
    }
  }

  const accountForm = (
    <>
      <Item required requiredMessage="必填">
        <Input name="userName" maxLength={20} placeholder="用户名" />
      </Item>
      <Item required requiredMessage="必填" style={{ marginBottom: 0 }}>
        <Input.Password name="password" htmlType="password" placeholder="密码" />
      </Item>
    </>
  )

  return (
    <div className={styles.LoginBlock}>
      <div className={styles.innerBlock}>
        <a href="https://www.yuque.com/5k/l2-doc/k20">
          <img className={styles.logo} src={logoSrc} alt="logo" />
          <span>人才库</span>
        </a>

        <Form value={postData} onChange={formChange} size="large" style={{ marginTop: 20 }}>
          {accountForm}
          <Item style={{ marginBottom: 10, marginTop: 20 }}>
            <Form.Submit type="primary" onClick={handleSubmit} className={styles.submitBtn} validate>
              登录
            </Form.Submit>
          </Item>
        </Form>
        <div className={styles.infoLine} />
      </div>
    </div>
  )
}

export default LoginBlock
