// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import FastClick from 'fastclick'
import App from './App'
import store from '../src/vuex/store'
import router from '../src/router/index.js'
import {LoadingPlugin, WechatPlugin, DatetimePlugin, ConfirmPlugin, XImg} from 'vux'
import '../src/config/api'
// import '../src/config/wxConfig'
import md5 from 'js-md5'
import {$toastWarn, $alert} from './config/util'
import share from './share'
import clipboard from 'clipboard' // 复制
import VideoPlayer from 'vue-video-player'
import SliderVerificationCode from 'slider-verification-code' // 滑动验证
import 'slider-verification-code/lib/slider-verification-code.css' // 滑动验证css
// 导入
Vue.use(VideoPlayer)
Vue.use(SliderVerificationCode)
Vue.prototype.$clipboard = clipboard
Vue.use(share)
Vue.prototype.$md5 = md5
FastClick.attach(document.body)
require('es6-promise').polyfill()
Vue.use(DatetimePlugin)
Vue.use(LoadingPlugin)
Vue.use(ConfirmPlugin)
Vue.use(WechatPlugin)
Vue.use(Vuex)
Vue.component('x-img', XImg)

store.registerModule('vux', { // 名字自己定义
  state: {
    isLoading: false
  },
  mutations: {
    updateLoadingStatus (state, payload) {
      state.isLoading = payload.isLoading
    }
  }
})
router.beforeEach((to, from, next) => {
  if (from.name === 'wxGroup' && to.name === 'register') {
    localStorage.setItem('fromPage', 'wxGroup')
  } else {
    localStorage.setItem('fromPage', 'otherPage')
  }
  if (to.query.ACCESS_TOKEN) {
    localStorage.setItem('ACCESS_TOKEN', to.query.ACCESS_TOKEN)
  }
  if (to.query.from_official_openid) {
    localStorage.setItem('from_official_openid', to.query.from_official_openid)
  }
  if (to.query.community_share) {
    localStorage.setItem('community_share', to.query.community_share)
  }
  if (to.query.from_user_id) {
    localStorage.setItem('from_user_id', to.query.from_user_id)
  }
  if (to.query.official_openid) {
    localStorage.setItem('official_openid', to.query.official_openid)
  }
  if (to.query.from_platform) {
    localStorage.setItem('from_platform', to.query.from_platform)
  }
  if (to.query.community_share) {
    localStorage.setItem('community_share', to.query.community_share)
  }
  // console.log(to.query)
  if (to.query.openid_bind === '1') {
    let bindMobile = to.query.bind_mobile
    $alert('温馨提示', `该微信已绑定账号 ${bindMobile}`)
  }
  // if (to.name === 'wxGroup') {
  //   localStorage.setItem('community_share', 1)
  // } else {
  //   localStorage.setItem('community_share', 0)
  // }
  store.commit('updateLoadingStatus', {isLoading: true})
  next()
  if (to.query && to.query.paas) {
    // store.commit('setPaas', store.state.route.query.paas)
    localStorage.setItem('paasName', to.query.paas)
  }
})

router.afterEach((to) => {
  if (window.ga) {
    window.ga('set', 'page', to.path) // 你可能想根据请求参数添加其他参数，可以修改这里的 to.fullPath
    window.ga('send', 'pageview')
  }
  store.commit('updateLoadingStatus', {isLoading: false})
})

Vue.prototype.$href = (url) => {
  if (!url) {
    $toastWarn('暂无详情链接')
    return
  }
  window.location.href = url
}
Vue.prototype.$isWeiXin = () => {
  var ua = window.navigator.userAgent.toLowerCase()
  if (ua.includes('micromessenger')) {
    console.log('微信平台', 'true')
    return true
  } else {
    console.log('非微信平台', 'false')
    return false
  }
}

FastClick.attach(document.body)
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
