import Vue from 'vue'
import {AjaxPlugin} from 'vux'
// import qs from 'qs'
import {$toastWarn, $loadingHide} from '../../src/config/util'

const api = () => {
  const baseURL = process.env.NODE_ENV === 'development' ? 'https://hujiaonline.com:8082' : 'https://hujiaonline.com:8082'
  AjaxPlugin.$http.defaults.baseURL = baseURL
  AjaxPlugin.$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
  AjaxPlugin.$http.defaults.timeout = 8000
// POST传参序列化(添加请求拦截器)
// http request 拦截器
  AjaxPlugin.$http.interceptors.request.use((config) => {
    let cookieArr = document.cookie.split('; ')
    let cookieobj = {}
    cookieArr.forEach((i) => {
      let arr = i.split('=')
      cookieobj[arr[0]] = arr[1]
    })
    // config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('ACCESS_TOKEN')
    config.headers['Authorization'] = 'Bearer ' + cookieobj.ACCESS_TOKEN
    let data = {
      paas: localStorage.getItem('paasName'), // 平台名字
      from_user_id: localStorage.getItem('from_user_id'), // 推荐人id
      official_openid: localStorage.getItem('official_openid'), // openID
      from_official_openid: localStorage.getItem('from_official_openid'), // from_openID
      from_platform: localStorage.getItem('from_platform'),
      location_latitude: localStorage.getItem('latitude'),
      location_longitude: localStorage.getItem('longitude')
    }
    let parameter = ''
    for (let index in data) {
      if (data[index] && data[index] !== null) {
        parameter = `${parameter}&${index}=${data[index]}`
      }
    }
    if (config.url.includes('?')) {
      config.url = config.url + `&XDEBUG_SESSION_START=1${parameter}`
    } else {
      config.url = config.url + `?XDEBUG_SESSION_START=1${parameter}`
    }
    // if (config.method === 'post') {
    //   config.data = qs.stringify(config.data)
    // }
    // $loadingShow()
    return config
  }, (error) => {
    return error
  })
  AjaxPlugin.$http.interceptors.response.use(response => {
    // $loadingHide()
    if (response.status === 200 && response.data.code === 2) { // token过期
      $loadingHide()
      localStorage.removeItem('ACCESS_TOKEN')
      $toastWarn(response.data.message)
      localStorage.setItem('jump', window.location.href)
      window.location.href = window.location.href.split('#/')[0] + '#/login'
    } else if (response.status === 200 && response.data.code === 1) {
      $loadingHide()
      return $toastWarn(response.data.message)
    }
    return response.data
  }, error => {
    console.log(error)
    $loadingHide()
  })
  Vue.use(AjaxPlugin)
  require('es6-promise').polyfill()
}
export default api()
