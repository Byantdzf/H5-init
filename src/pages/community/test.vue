<template>
  <div class="text-center">
    <!--<h3 class="color6">视频播放测试</h3>-->
    <div class="player-container">
      <video-player class="vjs-custom-skin" :options="playerOptions"></video-player>
    </div>
  </div>
</template>
<script>
  import {Group, Cell, XHeader, Swiper, XInput, SwiperItem, Tab, TabItem} from 'vux'
  import MescrollVue from 'mescroll.js/mescroll.vue'
  import swiperComponent from '../../components/swiper'
  // import {$toastText} from '../../config/util'
  // 引入video样式
  import 'video.js/dist/video-js.css'
  import 'vue-video-player/src/custom-theme.css'
  // 引入hls.js
  import 'videojs-contrib-hls.js/src/videojs.hlsjs'
  export default {
    components: {
      Group,
      Cell,
      XHeader,
      Swiper,
      SwiperItem,
      XInput,
      Tab,
      TabItem,
      swiperComponent,
      MescrollVue
    },
    data () {
      return {
        loading: false,
        ossConfig: {},
        host: '',
        file: {},
        mescroll: null, //  mescroll实例对象
        mescrollDown: {}, // 下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
        mescrollUp: { // 上拉加载的配置.
          callback: this.getOrderList, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
          // 以下是一些常用的配置,当然不写也可以的.
          page: {
            num: 0, // 当前页 默认0,回调之前会加1; 即callback(page)会从1开始
            size: 15 // 每页数据条数,默认10
          },
          htmlLoading: '<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip">加载中..</p>', // 上拉加载中的布局
          htmlNodata: '<p class="upwarp-nodata">-- 加载完毕 --</p>' // 无数据的布局
        },
        list: [],
        playerOptions: {
          playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
          autoplay: false, // 如果true,浏览器准备好时开始回放。
          controls: true, // 控制条
          preload: 'auto', // 视频预加载
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 导致视频一结束就重新开始。
          language: 'zh-CN',
          // aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [{
            type: '',
            // http://babylife.qiniudn.com/FtRVyPQHHocjVYjeJSrcwDkApTLQ
            // http://vjs.zencdn.net/v/oceans.mp4
            src: 'http://pili-live-hls.vod.gmall88.com/gcard/dx0115w2l_792a966e-1b87-41c7-8b77-cec5e4ea8f7c.m3u8'
          }],
          poster: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1570771393678&di=e6aed649aec047e03d70c9f9088475eb&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01a5ed580f28dfa84a0e282bfd744c.jpg%401280w_1l_2o_100sh.jpg', // 你的封面地址
          height: document.documentElement.clientHeight,
          width: document.documentElement.clientWidth,
          notSupportedMessage: '此视频暂无法播放，请稍后再试' // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        }
      }
    },
    methods: {
      onChange (event) { // 移动端仅支持单文件上传
        this.file = event.target.files[0]
        if (!this.file) return
        this.uploadFile(this.file)
      },
      uploadFile (file) {
        let ACCESS_TOKEN = `25_2BMGcoJskVJF91o-tZ0Dso3coWBIu7892QlaTZG0gopKqb6IKK_MI7zoXHOkoYlULObti1Mz1v1yFm8-OhFzaG4lsk5_PPvEoyr8oL1PF4RR1dHkjb5NWFBgTiRx7aCtHe_jcmKzCkKSR0mnYOShAJAKAE`
        let URL = `https://api.weixin.qq.com/cgi-bin/media/upload?access_token=${ACCESS_TOKEN}&type=image`
        this.$http.post(URL, file, {headers: {'Content-Type': 'multipart/form-data'}}).then(({data}) => {
          console.log(data)
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    mounted () {
      // console.log(this.$store.state.intercept)
      // if (this.$store.state.intercept === 'true') {
      //   return false
      // }
      // this.playerOptions.height = document.documentElement.clientHeight
    }
  }
</script>

<style lang="less" scoped>
  .video-js .vjs-big-play-button{
    font-size: 2.5em;
    line-height: 2.3em;
    height: 2.5em;
    width: 2.5em;
    -webkit-border-radius: 2.5em;
    -moz-border-radius: 2.5em;
    border-radius: 2.5em;
    background-color: #73859f;
    background-color: rgba(115,133,159,.5);
    border-width: 0.15em;
    margin-top: -1.25em;
    margin-left: -1.75em;
  }
  /* 中间的播放箭头 */
  .vjs-big-play-button .vjs-icon-placeholder {
    font-size: 1.63em;
  }
  /* 加载圆圈 */
  .vjs-loading-spinner {
    font-size: 2.5em;
    width: 2em;
    height: 2em;
    border-radius: 1em;
    margin-top: -1em;
    margin-left: -1.5em;
  }
</style>
