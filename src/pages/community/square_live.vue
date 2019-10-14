<template>
  <div>
    <!--<h3 class="color6">视频播放测试</h3>-->
    <div class="player-container">
      <video-player class="vjs-custom-skin" id="player"
                    :options="playerOptions"
                    width="100%"
                    height="100"
                    x5-video-player-type="h5"
                    webkit-playsinline
                    playsinline
                    x5-playsinline
                    x5-video-player-fullscreen="true"></video-player>
      <liveAttention></liveAttention>
      <chatMessage></chatMessage>
    </div>
  </div>
</template>
<script>
  import {Group, Cell, XHeader, Swiper, XInput, SwiperItem, Tab, TabItem} from 'vux'
  import MescrollVue from 'mescroll.js/mescroll.vue'
  import swiperComponent from '../../components/swiper'
  import chatMessage from './chat_message'
  import liveAttention from './live_attention'
  // import {$toastText} from '../../config/util'
  // 引入video样式
  import 'video.js/dist/video-js.css'
  import 'vue-video-player/src/custom-theme.css'
  // 引入hls.js
  import 'videojs-contrib-hls.js/src/videojs.hlsjs'
  export default {
    components: {
      chatMessage,
      liveAttention,
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
        content: '',
        src: 'http://tx.haiqq.com/uploads/allimg/170505/0424395200-4.jpg',
        chat: [],
        i: 1,
        arena_id: '',
        loading: false,
        ossConfig: {},
        host: '',
        file: {},
        list: [],
        playerOptions: {
          height: '',
          playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
          autoplay: false, // 如果true,浏览器准备好时开始回放。
          controls: false, // 控制条
          preload: 'auto', // 视频预加载
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 导致视频一结束就重新开始。
          language: 'zh-CN',
          // aspectRatio: '8:15', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: false, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [{
            type: '',
            // http://babylife.qiniudn.com/FtRVyPQHHocjVYjeJSrcwDkApTLQ
            // http://vjs.zencdn.net/v/oceans.mp4
            src: 'http://love.ufutx.com/653481/132126762748928094/live.m3u8'
          }],
          // poster: 'http://img2.imgtn.bdimg.com/it/u=1449347812,1523653846&fm=15&gp=0.jpg', // 你的封面地址
          width: document.documentElement.clientWidth,
          notSupportedMessage: '此视频暂无法播放，请稍后再试' // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        }
      }
    },
    methods: {
    },
    mounted () {
      this.playerOptions.height = document.documentElement.clientHeight
      this.arena_id = this.$route.params.id
    }
  }
</script>

<style lang="less" scoped>
  #player{
    object-fit: fill !important;
  }
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
