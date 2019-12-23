// import '../src/config/api'
// import wx from 'weixin-jsapi'
//
// exports.install = function (Vue, options) {
//   Vue.prototype.$wxPay = function (config) {
//     // 微信支付
//     // var url = encodeURIComponent(location.href.split('#')[0])
//     wx.config({
//       debug: true, // true:调试时候弹窗
//       appId: config.appId, // 微信appid
//       timestamp: config.timestamp, // 时间戳
//       nonceStr: config.nonceStr, // 随机字符串
//       signature: config.signature, // 签名
//       jsApiList: [
//         // 所有要调用的 API 都要加到这个列表中
//
//         'onMenuShareTimeline', // 分享到朋友圈接口
//         'onMenuShareAppMessage', //  分享到朋友接口
//         'onMenuShareQQ', // 分享到QQ接口
//         'onMenuShareWeibo' // 分享到微博接口
//       ]
//     })
//     wx.checkJsApi({
//       jsApiList: [
//         // 所有要调用的 API 都要加到这个列表中
//         'onMenuShareTimeline', // 分享到朋友圈接口
//         'onMenuShareAppMessage', //  分享到朋友接口
//         'onMenuShareQQ', // 分享到QQ接口
//         'onMenuShareWeibo' // 分享到微博接口
//       ],
//       success: function (res) {
//       }
//     })
//
//     wx.ready(function () {
//       // 微信分享的数据
//       var shareData = {
//         imgUrl: imgUrl, // 分享显示的缩略图地址
//         link: link, // 分享地址
//         desc: desc, // 分享描述
//         title: title, // 分享标题
//         success: function () {
//           // 分享成功可以做相应的数据处理
//           alert('分享成功')
//           alert('appId:' + res.appId)
//           alert('timestamp:' + res.timestamp)
//           alert('nonceStr:' + res.nonceStr)
//           alert('signature:' + res.signature)
//         },
//         fail: function () {
//           alert('调用失败')
//         },
//         complete: function () {
//           alert('调用结束')
//         }
//       }
//       console.log(shareData)
//       wx.updateTimelineShareData(shareData)
//       wx.updateAppMessageShareData(shareData)
//       wx.onMenuShareQQ(shareData)
//       wx.onMenuShareWeibo(shareData)
//     })
//     wx.error(function (res) {
//       // config信息验证失败会执行error函数，如签名过期导致验证失败，
//       // 具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，
//       // 对于SPA可以在这里更新签名。
//       // alert('分享失败')
//     })
//   }
// }
