import Vue from 'vue'
import Vuex from 'vuex'
import { sync } from 'vuex-router-sync'
import vuexI18n from 'vuex-i18n'
import router from '../../src/router/index.js'

Vue.use(Vuex)

const state = {
  // isLoading: false,
  direction: 'forward',
  count: 0,
  paas: '',
  chat_message_num: '',
  notice_num: '',
  intercept: localStorage.getItem('intercept'),
  data: {
    XDEBUG_SESSION_START: 1,
    paas: window.localStorage.getItem('paas')
  }
}
let store = new Vuex.Store({
  state,
  mutations: {
    increment (state) {
      state.count++
    },
    setPaas (state, text) {
      state.paas = text
    },
    UPDATE_DIRECTION (state, direction) {
      state.direction = direction
    }
  },
  modules: {
    i18n: vuexI18n.store
  },
  actions: {
    login ({state, commit}) {
      setTimeout(() => {
        alert('登录成功')
        commit('route/ROUTE_CHANGED', {to: {path: '/b'}})
      }, 200)
    }
  }
})
sync(store, router)
export default store
