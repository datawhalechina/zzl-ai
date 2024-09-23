import { logger } from 'ice'
import { IUserProps, queryCurrent, outLogin } from '@/services/User'

interface IUserModel extends IUserProps {
  getUserInfo: () => Promise<IUserProps|void>
}

export default {
  // 定义 model 的初始 state
  state: {
    id: 0,
    name: '',
    roleType: 0,
    buName: '',
    phone: '',
    auth: {}
  } as IUserModel,

  // 定义改变该模型状态的纯函数
  reducers: {
    update(prevState, payload) {
      return {
        ...prevState,
        ...payload
      }
    },
  },

  // 定义处理该模型副作用的函数
  effects: (dispatch) => ({
    async getUserInfo() {
      // let currentUser: IUserProps = {}
      try {
        const _currentUser: IUserProps = (await queryCurrent())?.data
        if (_currentUser) {
          _currentUser.auth = {
            isLogin: !!_currentUser?.id,
            isHunting: _currentUser?.roleType === 0,
            isManage: _currentUser?.roleType === 2,
            isInterview: _currentUser?.roleType === 1,
            isAdmin: _currentUser?.roleType === 3,
          }
          // currentUser = _currentUser
          // dispatch.user.update(_currentUser)
          dispatch.user.setState(_currentUser)
        }
      } catch (error) {
        logger.error(error)
      }
    },
    async logout(payload, { user = {} }: { user: IUserProps }) {
      await outLogin(user.id)
      dispatch.user.update({})
    },
  }),
}
