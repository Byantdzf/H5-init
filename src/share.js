import '../src/config/api'
import wx from 'weixin-jsapi'
// import {$toastWarn} from './config/util'

exports.install = function (Vue, options) {
  Vue.prototype.$shareList = function (imgUrl, link, desc, title) { // 分享
    let vm = this
    let url = encodeURIComponent(location.href.split('#')[0])
    let parameter = {url: url}
    // let wxConfig = JSON.parse(localStorage.getItem('wxConfig'))
    // if (wxConfig) return wxInit(wxConfig, imgUrl, link, desc, title)
    vm.$http.post(`/official/js/config`, parameter).then(({data}) => {
      wxInit(data, imgUrl, link, desc, title)
      localStorage.setItem('wxConfig', JSON.stringify(data))
    }).catch((error) => {
      console.log(error)
    })
  }
}

function wxInit (res, imgUrl, link, desc, title) {
  // let url = window.location.href.split('?')[0] // 获取锚点之前的链接
  wx.config(res)
  wx.ready(function () {
    wx.onMenuShareAppMessage({
      title: title, // 分享标题
      desc: desc, // 分享描述
      link: link, // 分享链接
      imgUrl: imgUrl, // 分享图标
      success: function () {
        console.log('分享成功')
      },
      cancel: function () {
        console.log('分享失败')
      }
    })
    // 微信分享菜单测试
    wx.onMenuShareTimeline({
      title: title, // 分享标题
      desc: desc, // 分享描述
      link: link, // 分享链接
      imgUrl: imgUrl, // 分享图标
      success: function () {
        console.log('分享成功')
      },
      cancel: function () {
        console.log('分享失败')
      }
    })
  })
  wx.error(function (err) {
    alert(JSON.stringify(err))
  })
}
