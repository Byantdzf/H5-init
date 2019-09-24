<template>
  <div class="z_box">
    <div class="right"></div>
    <div class="player-container text-center">
      <video-player class="vjs-custom-skin" :options="playerOptions"></video-player>
      <div class="z_person">
        <span class="parent_num">{{click_num}}</span>
        <img src="https://images.ufutx.com/201909/18/b9db8ba4f8b6134a8df2748c14dbcdf8.png" alt="" class="icon_person">
      </div>
      <div class="z_home" @click="$router.push({path: `/live`})">
        <img src="https://images.ufutx.com/201909/18/982e873c34b48881d10519435e0c0188.png" alt="" class="icon_home">
      </div>
    </div>
    <div class="left"></div>
    <div class="tab-list">
      <div class="tab-li"
           :class="actiove == index ?'Active' : '' "
           v-for="(item,index) in tabList" @click="cutTabClick(index)"
           :key="index">{{item}}
      </div>
    </div>
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" class="scrollView">
      <div v-if="actiove === 0" class="z_interaction">
        <div class="j_page" v-for="item in comments">
          <p class="text-center z_time">{{item.created_at}}</p>
          <div class="clearfix">
            <div class="Avatar flo_l backCover" v-bind:style="{backgroundImage:'url(' + item.photo + ')'}" ></div>
            <div class="z_message_box flo_l">
              <div class="z_name">{{item.name}}</div>
              <div class="z_message">{{item.comment}}</div>
            </div>
            <div class="clearfloat"></div>
          </div>
        </div>
      </div>
      <div v-if="actiove === 1" class="z_introduce">
        <div class="z_introduce_data">
          <img :src="guest_avatar" alt="" class="z_introduce_head">
          <p class="z_introduce_name">{{guest_name}}</p>
          <p class="z_type">主播</p>
        </div>
        <div v-for="item in intro">
          <img :src="item" alt="" class="z_poster">
        </div>
      </div>
      <div v-if="actiove === 2" class="z_list">
        <div v-for="item,index in ranking" class="z_list_data" :key="index">
          <img src="https://images.ufutx.com/201909/18/b9691d848e448093cad649450ca710da.png" alt="" class="medal_one" v-if="index === 0">
          <img src="https://images.ufutx.com/201909/18/26c5e78bb28316e3b46f5beda4cd06ad.png" alt="" class="medal_two" v-if="index === 1">
          <img src="https://images.ufutx.com/201909/18/0d8fc057c1169eb336ff01a789e8471a.png" alt="" class="medal_three" v-if="index === 2">
          <img :src="item.photo" alt="" class="z_list_head">
          <span class="z_list_name">{{item.name}}</span>
          <p class="z_invite">邀请<span style="color: #D92553">{{item.share_num}}</span>人</p>
        </div>
      </div>
      <div v-if="actiove === 3" class="z_attention">
        <p class="z_qrcode_title">{{qrcode_intro}}</p>
        <img :src="qrcode" alt="" class="z_qrcode">
      </div>
      <div class="z_button" v-if="actiove === 0">
        <input type="text" class="wire" v-model="content">
        <div class="z_btn" @click="onSend">发送</div>
      </div>
    </mescroll-vue>
  </div>
</template>
<script>
  import {Group, Cell, XHeader, Swiper, XInput, SwiperItem, Tab, TabItem} from 'vux'
  import MescrollVue from 'mescroll.js/mescroll.vue'
  import swiperComponent from '../../components/swiper'
  import {$loadingHide} from '../../config/util'
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
        arena_id: '',
        tabList: ['互动', '介绍', '榜单', '关注'],
        arena: [],
        guest_avatar: '',
        guest_name: '',
        intro: [],
        qrcode: '',
        qrcode_intro: '',
        ranking: [],
        time: '',
        photo: '',
        commented_name: '',
        commented_id: '',
        created_at: '',
        comments: [],
        content: '',
        status: '',
        play_url: '',
        medal: [
          {
            one: 'https://images.ufutx.com/201909/18/b9691d848e448093cad649450ca710da.png',
            two: 'https://images.ufutx.com/201909/18/26c5e78bb28316e3b46f5beda4cd06ad.png',
            three: 'https://images.ufutx.com/201909/18/0d8fc057c1169eb336ff01a789e8471a.png'
          }
        ],
        actiove: 0,
        host: '',
        click_num: 0,
        file: {},
        page: 1,
        select: false,
        mescroll: null, //  mescroll实例对象
        mescrollDown: {}, // 下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
        mescrollUp: { // 上拉加载的配置.
          callback: this.getinteraction, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
          // 以下是一些常用的配置,当然不写也可以的.
          page: {
            num: 0, // 当前页 默认0,回调之前会加1; 即callback(page)会从1开始
            size: 15 // 每页数据条数,默认10
          },
          // htmlLoading: '<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip">加载中..</p>'
          htmlNodata: '<p class="upwarp-nodata" v-if="list.length > 0">-- 暂无更多 --</p>' // 无数据的布局
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
          aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [{
            type: 'application/x-mpegURL',
            // src: 'http://edu.ufutx.com/653481/132126762748928094/live.m3u8'
            src: ''
          }],
          poster: 'https://images.ufutx.com/201909/12/ee972fdefd0d65c2a43fb2ea2bd7e56c.png', // 你的封面地址
          width: document.documentElement.clientWidth,
          notSupportedMessage: '此视频暂无法播放，请稍后再试' // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        }
      }
    },
    methods: {
      cutTabClick (index) {
        this.actiove = index
      },
      onChange (event) { // 移动端仅支持单文件上传
        this.file = event.target.files[0]
        if (!this.file) return
        this.uploadFile(this.file)
      },
      mescrollInit (mescroll) {
        this.mescroll = mescroll
      },
      uploadFile (file) {
        let ACCESS_TOKEN = `25_2BMGcoJskVJF91o-tZ0Dso3coWBIu7892QlaTZG0gopKqb6IKK_MI7zoXHOkoYlULObti1Mz1v1yFm8-OhFzaG4lsk5_PPvEoyr8oL1PF4RR1dHkjb5NWFBgTiRx7aCtHe_jcmKzCkKSR0mnYOShAJAKAE`
        let URL = `https://api.weixin.qq.com/cgi-bin/media/upload?access_token=${ACCESS_TOKEN}&type=image`
        this.$http.post(URL, file, {headers: {'Content-Type': 'multipart/form-data'}}).then(({data}) => {
          console.log(data)
        }).catch((error) => {
          console.log(error)
        })
      },
      getinteraction (page, mescroll) {
        let vm = this
        this.$http.get(`official/arenas/` + this.arena_id + `/comments?page=${page.num}`).then(({data}) => {
          this.comments = page.num === 1 ? [] : this.comments
          let comments = data.data.map((item) => {
            return {
              created_at: item.created_at,
              id: item.user.id,
              photo: item.user.photo,
              name: item.user.name,
              comment: item.comment
            }
          })
          this.comments.push(...comments)
          $loadingHide(false)
          vm.$nextTick(() => {
            mescroll.endSuccess(data ? data.data : 3)
          })
        })
      },
      getList () {
        let vm = this
        this.$http.get(`official/arenas/` + this.arena_id + `/lists`).then(({data}) => {
          vm.ranking = data.map((item) => {
            return {
              created_at: item.created_at,
              photo: item.user.photo,
              share_num: item.share_num,
              name: item.user.name
            }
          })
          console.log(vm.ranking.length, '000')
          $loadingHide(false)
          // vm.$nextTick(() => {
          //   mescroll.endSuccess(data.data ? data.data : 1)
          // })
        })
      },
      getParticulars () {
        let vm = this
        this.$http.get(`/official/arenas/` + this.arena_id).then(({data}) => {
          vm.playerOptions.sources[0].src = data.arena.play_url
          vm.arena = data.arena
          vm.click_num = vm.arena.click_num
          vm.guest_avatar = vm.arena.guest_avatar
          vm.guest_name = vm.arena.guest_name
          vm.intro = vm.arena.intro
          vm.qrcode_intro = vm.arena.qrcode_intro
          vm.qrcode = vm.arena.qrcode
          vm.status = vm.arena.status
          if (vm.status === 1) {
            vm.play_url = vm.arena.play_url
          } else {
            vm.play_url = vm.arena.playback_url
          }
          $loadingHide(false)
        })
      },
      onSend () {
        let data = {
          content: this.content
        }
        this.$http.post(`official/comment/arenas/` + this.arena_id, data).then(({data}) => {
          this.photo = data.user.photo
          this.commented_name = data.user.name
          this.commented_id = data.user.id
          this.created_at = data.created_at
          this.comments.push(
            {
              comment: this.content,
              id: this.commented_id,
              name: this.commented_name,
              photo: this.photo,
              created_at: this.created_at
            }
          )
          this.content = ''
          this.getinteraction({num: 1}, this.mescroll)
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    mounted () {
      this.arena_id = this.$route.params.id
      this.getParticulars()
      this.getList()
      // console.log(this.playerOptions)
      // console.log(this.$store.state.intercept)
      // if (this.$store.state.intercept === 'true') {
      //   return false
      // }
    }
  }
</script>

<style lang="less" scoped>
  body {
    background: #f7f7f7 !important;
    .announcementIcon {
      margin-bottom: 8px;
      vertical-align: middle;
    }
  }
  .main-member{
    padding: 28px 22px 28px 44px ;
    border-bottom: 1px solid #b0b0b0;
    overflow: hidden;
    .img{
      width: 90px;
      height: 90px;
      border-radius: 50%;
      margin-right: 12px;
      background-size: cover;
      background-repeat: no-repeat;
    }
    p{
      margin-top: 8px;
    }
  }
  .main-input{
    width: 86vw;
    background: #EBEAEA;
    margin: 28px auto;
    padding: 0 12px;
    border-radius: 12px;
    padding-left: 43px;
    position: relative;
    &:after{
      content: '';
      width: 42px;
      height: 42px;
      position: absolute;
      left: 6px;
      top: 10px;
      background-image: url("https://images.ufutx.com/201907/20/f8b7d5da439d74b54f56121eabf93246.png");
      background-size: contain;
      background-repeat: no-repeat;
    }
    ::-webkit-input-placeholder {
      color: #b0b0b0;
    }
    ::-moz-placeholder {
      color: #b0b0b0;
    }
    :-ms-input-placeholder {
      color: #b0b0b0;
    }
    input{
      background: none;
      border: none;
      width: 100%;
      height: 62px;
      padding-top: 2px;
    }
  }
  .main-creation{
    overflow: hidden;
    padding: 36px  28px 28px 28px;
    img{
      width: 90px;
      height: 90px;
      margin-right: 22px;
      border-radius: 50%;
    }
    p{
      margin-top: 8px;
    }
    .infor{
      width: 80%;
      margin-top: 28px;
      .infor-item{
        width: 33%;
        position: relative;
        &:nth-child(1),&:nth-child(2){
          &:before{
            content: ' ';
            width: 1px;
            height: 52px;
            background: #e2e2e2;
            position: absolute;
            right: 0;
            top: 12px;
          }
        }
      }
    }
  }
  .bc_num{
    background: #f6f6f6;
    height: 14px;
  }
  .animationData {
    animation: myMove2 800ms linear;
    animation-fill-mode: forwards;
  }

  @keyframes myMove2 {
    from {
      height: 302px;
    }
    to {
      height: 347px;
    }
  }

  .animationData2 {
    animation: myMove1 800ms linear;
    animation-fill-mode: forwards;
  }

  @keyframes myMove1 {
    from {
      height: 347px;
    }
    to {
      height: 302px;
    }
  }
  .vessel {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, .7);
    .close{
      width: 60px;
      position: absolute;
      top: 20%;
      right: 12%;
    }
    .modal-vessel {
      background-image: url("http://images.ufutx.com/201907/09/7f45e1fa8d1774f7f1e9f30b7516221d.png");
      background-size: contain;
      background-repeat: no-repeat;
      animation: myMove 300ms linear;
      animation-fill-mode: forwards;
      @keyframes myMove {
        from {
          width: 0;
          height: 0;
          margin: 27% auto;
        }
        to {
          width: 86%;
          height: 72%;
          margin: 30% auto;
        }
      }
    }
  }
  ::-webkit-scrollbar {
    width: 0;
    display: none;
    background-color: #fff;
  }
  .mescroll-upwarp{
    margin-top: 30px !important;
  }
  .mescroll {
    height: auto;
    position: relative;
    background: #f6f6f6;
    padding-bottom: 0;
  }
  .z_box{
    height: 100vh;
    position: relative;
    background: #f6f6f6;
    .right{
      height: 420px;
    }
    .player-container{
      z-index: 999;
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      .z_person{
        position: relative;
        position: absolute;
        top: 24px;
        right: 20px;
        .parent_num{
          width: 66px;
          position: absolute;
          top: 6px;
          right: 14px;
          font-size: 22px;
          color: white;
        }
        .icon_person{
          width: 126px;
        }
      }
      .z_home{
        position: absolute;
        top: 262px;
        left: 20px;
        .icon_home{
          width: 62px;
        }
      }
    }
  }
  .left{
    height: 100px;
  }
  .tab-list{
    background: #fff;
    z-index: 9999;
    position: fixed;
    top: 420px;
    left: 0;
    right: 0;
    width: 100%;
    margin: auto;
    overflow: hidden;
    .tab-li {
      float: left;
      display: inline-block;
      width: 24.99%;
      height: 80px;
      font-weight: bold;
      text-align: center;
      line-height: 80px;
      font-size: 24px;
      color: #666666;
    }
    /*点击后样式*/
    .Active{
      color: #ffffff;
      background: #D92553;
    }
    .attention{
      float: left;
      width: 16%;
      line-height: 80px;
      text-align: center;
      font-weight: bold;
      color: #ffffff;
      background: #D92553;
      font-size: 24px;
    }
  }
  .z_interaction{
    background: #f6f6f6;
    .j_page{
      padding: 0px 30px 0 30px;
      .z_time{
        font-size: 24px;
        color: #666666;
        margin-bottom: 12px;
      }
      .clearfloat{
        margin-bottom: 30px;
      }
      .clearfix{
        margin-bottom: 12px;
        .Avatar {
          width: 84px;
          height: 84px;
          border-radius: 50%;
        }
        .z_message_box{
          .z_name{
            font-size: 24px;
            margin-left: 20px;
            color: #666666;
          }
          .z_message{
            color: #666666;
            font-size: 24px;
            max-width: 400px;
            word-wrap: break-word;
            padding: 10px;
            margin-left: 38px;
            margin-top: 10px;
            border: 1px solid #b0b0b0;
            background: white;
            line-height: 40px;
            border-radius: 8px;
            position: relative;
            &:before{
              content: ' ';
              position: absolute;
              left: -40px;
              top: 14px;
              width: 0;
              height: 0;
              border-top: 12px solid transparent;
              border-right: 20px solid #b0b0b0;
              border-left: 20px solid transparent;
              border-bottom: 12px solid transparent;
            }
            &:after{
              content: ' ';
              z-index: 222;
              position: absolute;
              left: -34px;
              top: 16px;
              width: 0;
              height: 0;
              border-top: 10px solid transparent;
              border-right: 18px solid #ffffff;
              border-left: 18px solid transparent;
              border-bottom: 10px solid transparent;
            }
          }
        }
      }
    }
  }
  .z_introduce{
    .z_introduce_data{
      position: relative;
      padding: 24px 0 30px 30px;
      .z_introduce_head{
        width: 84px;
        height: 84px;
        border-radius: 50%;
      }
      .z_introduce_name{
        position: absolute;
        top: 32px;
        left: 134px;
        font-size: 22px;
      }
      .z_type{
        position: absolute;
        top: 72px;
        left: 134px;
        font-size: 16px;
        color: #D92553;
      }
    }
    .z_poster{
      width: 100vw;
      height: 422px;
      margin-bottom: 20px;
    }
  }
  .z_attention{
    text-align: center;
    margin-top: 28%;
    .z_qrcode_title{
      margin-bottom: 30px;
      color: #D92553;
      font-size: 30px;
      font-weight: bold;
    }
    .z_qrcode{
      width: 340px;
      height: 340px;
      border-right: 6px;
    }
  }
  .z_list{
    overflow: hidden;
    .z_list_data{
      overflow: hidden;
      width: 100vw;
      height: 140px;
      border-bottom: 1px solid #b6b6b6;
      .medal_two, .medal_one, .medal_three{
        width: 50px;
        position: absolute;
        margin-left: 30px;
        margin-top: 24px;
      }
      .z_list_head{
        margin-top: 30px;
        margin-left: 110px;
        width: 84px;
        height: 84px;
        border-radius: 50%;
      }
      .z_list_name{
        margin-top: 54px;
        margin-left: 20px;
        font-size: 24px;
      }
      .z_invite{
        float: right;
        margin-right: 30px;
        margin-top: 54px;
        font-size: 24px;
      }
    }
  }
  .z_button{
    height: 92px;
    width: 100vw;
    z-index: 9999;
    overflow: hidden;
    background: white;
    position: relative;
    position: fixed;
    left: 0;
    bottom: 0;
    .wire{
      position: absolute;
      left: 32px;
      bottom: 20px;
      width: 78%;
      height: 44px;
      box-shadow:0 0 0 rgba(0,0,0,0);
      -webkit-appearance:none;
      border-left-width: 0;
      border-top-width: 0;
      border-right-width: 0;
    }
    .z_btn{
      z-index: 2222;
      position: absolute;
      right: 14px;
      top: 20px;
      width: 112px;
      height: 55px;
      font-size: 26px;
      color: #ffffff;
      border-radius: 6px;
      background: #D92553;
      text-align: center;
      line-height: 55px;
    }
  }
</style>
