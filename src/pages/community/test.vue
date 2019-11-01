<template>
  <div>
    <!--<h3 class="color6">视频播放测试</h3>-->
    <div class="liker_box">
      <div class="liker">
        <canvas class="hearts-canvas" id="canvas" width="200" height="400"></canvas>
        <button class="btn">
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
  import {Group, Cell, XHeader, Swiper, XInput, SwiperItem, Tab, TabItem} from 'vux'
  import MescrollVue from 'mescroll.js/mescroll.vue'
  import swiperComponent from '../../components/swiper'
  import testV2 from './testV2'
  import componentLike from '../../components/componentLike'
  // import {$toastText} from '../../config/util'
  // 引入video样式
  import 'video.js/dist/video-js.css'
  import 'vue-video-player/src/custom-theme.css'
  // 引入hls.js
  import 'videojs-contrib-hls.js/src/videojs.hlsjs'
  import '../../javascript/bubbling'
  export default {
    components: {
      testV2,
      Group,
      Cell,
      XHeader,
      Swiper,
      SwiperItem,
      XInput,
      Tab,
      TabItem,
      swiperComponent,
      componentLike,
      MescrollVue
    },
    data () {
      return {
        content: '',
        src: 'http://tx.haiqq.com/uploads/allimg/170505/0424395200-4.jpg',
        chat: [],
        i: 1,
        loading: false,
        ossConfig: {},
        host: '',
        file: {}
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
  @import '../../assets/style/bubbling.css';
  /*.liker_box{*/
    /*position: absolute;*/
    /*bottom: 480px;*/
    /*right: 100px;*/
  /*}*/
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
  .z_box{
    position: absolute;
    bottom: 20px;
    z-index: 99;
    .chat_box{
      width: 100vw;
      max-height: 500px;
      overflow: auto;
      .chat_photo{
        width: 44px;
        height: 44px;
        margin-left: 10px;
        border-radius: 50%;
      }
      .chat_message {
        max-width: 460px;
        word-wrap: break-word;
        line-height: 42px;
        padding: 4px 10px;
        font-size: 22px;
        border-radius: 10px;
        margin-bottom: 20px;
        margin-left: 10px;
        background-color: rgba(0,0,0,0.6);
        .chat_name{
          font-size: 22px;
          color: #D92553;
        }
      }
    }
    .chat_content{
      height: 40px;
      border-radius: 6px;
      -webkit-appearance:none;
      outline: none;
      margin-left: 10px;
      width: 400px;
      margin-top: 30px
    }
    .chat_send{
      display: inline-block;
      width: 80px;
      height: 40px;
      margin-bottom: 20px;
      text-align: center;
      line-height: 40px;
      background: #D92553;
      border: 1px solid #D92553;
      border-radius: 6px;
      color: #ffffff;
      font-size: 22px;
    }
  }
</style>
