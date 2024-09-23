import Vue from 'vue'
import { getToken, setToken, removeToken, getName, setName, removeName } from '@/utils/auth'
import { resetRouter } from '@/router'

const vm = new Vue()

const getDefaultState = () => {
  return {
    token: getToken(),
    name: getName(),
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  passwordLogin({ commit }, params) {
    return new Promise((resolve, reject) => {
      const {mobile,password, ticket} = params
      vm.$api.user.passwordLogin(mobile,password, ticket).then(response => {
        const { data } = response
        console.log(data)
        commit('SET_TOKEN', data.token)
        commit('SET_NAME', params.mobile)

        setToken(data.token)
        setName(params.mobile)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  smsLogin({ commit }, params) {
    return new Promise((resolve, reject) => {
      vm.$api.user.smsLogin({...params}).then(response => {
        const { data } = response
        console.log(data)
        commit('SET_TOKEN', data.token)
        commit('SET_NAME', params.mobile)

        setToken(data.token)
        setName(params.mobile)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      // logout(state.token).then(() => {
        removeToken() // must remove  token  first
        removeName()
        resetRouter()
        commit('RESET_STATE')
        resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

