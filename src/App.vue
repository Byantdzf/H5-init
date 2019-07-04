<template>
  <div id="app" style="height:100%;">
    <view-box ref="viewBox" body-padding-bottom="50">
      <div v-transfer-dom>
        <loading v-model="isLoading"></loading>
        <!--<loadingPage :init="!isLoading"></loadingPage>-->
      </div>
      <div class="layout">
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
      </div>
      <div style="height: 50px;" v-show="!isTabbarDemo"></div>
      <!--{{entryUrl}}-->
      <!--<x-header-->
      <!--v-if="isShowNav"-->
      <!--slot="header"-->
      <!--style="width:100%;position:absolute;left:0;top:0;z-index:100;"-->
      <!--:left-options="leftOptions"-->
      <!--:right-options="rightOptiongens"-->
      <!--:title="title"-->
      <!--@on-click-more="onClickMore">-->
      <!--<span v-if="route.path === '/'" slot="overwrite-left" @click="drawerVisibility = !drawerVisibility">-->
      <!--<x-icon type="navicon" size="35" style="fill:#fff;position:relative;top:-8px;left:-3px;"></x-icon>-->
      <!--</span>-->
      <!--</x-header>-->
      <tabbar class="vux-demo-tabbar" icon-class="vux-center tabbar-icon" v-show="!isTabbarDemo" slot="bottom">
        <tabbar-item :link="{path:'/'}" :selected="path === '/'">
          <span class="demo-icon-22 vux-demo-tabbar-icon-home" slot="icon" style="position:relative;top: -2px;">
            <img src="../src/assets/icon/home.png" alt="home">
          </span>
          <span class="demo-icon-22" slot="icon-active">
            <img src="../src/assets/icon/homeActive.png" alt="home">
          </span>
          <span slot="label">首页</span>
        </tabbar-item>
        <tabbar-item :link="{path:'/activity'}" :selected="path === '/activity'">
          <span class="demo-icon-22" slot="icon">
            <img src="../src/assets/icon/attention.png" alt="home">
          </span>
          <span class="demo-icon-22" slot="icon-active">
            <img src="../src/assets/icon/attentionActive.png" alt="home">
          </span>
          <span slot="label">活动</span>
        </tabbar-item>
        <tabbar-item :link="{path:'/chitchat'}" :badge="chat_num == 0?'':chat_num" :selected="path === '/chitchat'">
          <span class="demo-icon-22 vux-demo-tabbar-icon-home" slot="icon" style="position:relative;top: -2px;">
            <img src="../src/assets/icon/message.png" alt="home">
          </span>
          <span class="demo-icon-22" slot="icon-active">
            <img src="../src/assets/icon/messageActive.png" alt="home">
          </span>
          <span slot="label">聊天</span>
        </tabbar-item>
        <tabbar-item :link="{path:'/user'}" :badge="notice_num == 0?'':notice_num" :selected="path === '/user'">
          <span class="demo-icon-22 vux-demo-tabbar-icon-home" slot="icon" style="position:relative;top: -2px;">
            <img src="../src/assets/icon/my.png" alt="home">
          </span>
          <span class="demo-icon-22" slot="icon-active">
            <img src="../src/assets/icon/myActive.png" alt="home">
          </span>
          <span slot="label">我的</span>
        </tabbar-item>
      </tabbar>
    </view-box>
  </div>
</template>

<script>
  import {XHeader, Tabbar, TabbarItem, ViewBox, Loading, TransferDom} from 'vux'
  import {mapState, mapActions} from 'vuex'
  import loadingPage from './components/loading'
  import {$toastWarn} from './config/util'

  export default {
    name: 'app',
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      Tabbar,
      TabbarItem,
      ViewBox,
      Loading,
      loadingPage
    },
    data () {
      return {
        entryUrl: document.location.href,
        chat_num: '',
        notice_num: ''
      }
    },
    watch: {
      isLoading () {
        // console.log(this.isLoading)
      },
      $route (to, from) {
        this.shareInfo()
      }
    },
    computed: {
      ...mapState({
        route: state => state.route,
        path: state => state.route.path,
        deviceready: state => state.app.deviceready,
        isLoading: state => state.vux.isLoading,
        direction: state => state.vux.direction
      }),
      isTabbarDemo () {
        if (this.route.path === '/') return false
        if (this.route.path === '/activity') return false
        if (this.route.path === '/chitchat') return false
        if (this.route.path === '/user') return false
        return true
      },
      isDemo () {
        return /component|demo/.test(this.route.path)
      },
      isShowNav () {
        if (this.entryUrl.indexOf('hide-nav') > -1) {
          return false
        }
        return true
      },
      leftOptions () {
        return {
          showBack: this.route.path === '/'
        }
      },
      rightOptions () {
        return {
          showMore: true
        }
      },
      title () {
        if (this.route.path === '/') return '主页'
        if (this.route.path === '/activity') return '活动'
        if (this.route.path === '/chitchat') return '聊天'
        if (this.route.path === '/user') return '我的'
        return this.componentName ? `Demo/${this.componentName}` : 'Demo/~~'
      }
    },
    methods: {
      ...mapActions([
        'updateDemoPosition'
      ]),
      onClickMore () {
        this.showMenu = true
      },
      geolocation () {
        if (this.$isWeiXin()) {
          wx.ready(function () {
            wx.getLocation({
              type: 'gcj02',
              success: (res) => {
                localStorage.setItem('latitude', res.latitude)
                localStorage.setItem('longitude', res.longitude)
              },
              cancel: (res) => {
                $toastWarn('定位失败，权限不足')
              }
            })
          })
        } else {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
              localStorage.setItem('latitude', position.coords.latitude)
              localStorage.setItem('longitude', position.coords.longitude)
            })
          } else {
            $toastWarn('未获取到地理定位.')
          }
        }
      },
      shareInfo () {
        let vm = this
        let url = ''
        if (!localStorage.getItem('userInfo') || localStorage.getItem('userInfo') === null) {
          url = location.href
        } else {
          let userInfo = JSON.parse(localStorage.getItem('userInfo'))

          if (location.href.includes('?')) {
            url = location.href + '&from_user_id=' + userInfo.id
          } else {
            url = location.href + '?from_user_id=' + userInfo.id
          }
        }
        if (localStorage.getItem('paasTitle')) {
          this.$shareList(localStorage.getItem('logo'), url, localStorage.getItem('paasIntro'), localStorage.getItem('paasTitle'))
          document.title = localStorage.getItem('paasTitle')
        } else {
          this.$shareList('https://images.ufutx.com/201904/19/80a9db83c65a7c81d95e940ef8a2fd0e.png', url, '用科技让交友变简单', '福恋交友平台')
          document.title = '福恋交友平台'
        }
        if (location.href.includes('paas')) {
          // if (localStorage.getItem('paasName') != location.href.split('paas=')[1]) {
          vm.$http.get(`/official/paas`).then(({data}) => {
            if (data && data !== null) {
              localStorage.setItem('paasTitle', data.title)
              localStorage.setItem('paasIntro', data.intro)
              this.$shareList(data.logo, url, data.intro, data.title)
              if (data.logo) {
                localStorage.setItem('logo', data.logo)
              }
              document.title = data.title
            } else {
              this.$shareList('https://images.ufutx.com/201904/19/80a9db83c65a7c81d95e940ef8a2fd0e.png', url, '用科技让交友变简单', '福恋交友平台')
              document.title = '福恋交友平台'
              localStorage.setItem('paasName', 'FL')
            }
          }).catch((error) => {
            console.log(error)
          })
          // }
        }
      }
    },
    mounted () {
      let href = window.location.href
      if (href.indexOf('groupmessage') > -1 || href.indexOf('singlemessage') > -1 || href.indexOf('timeline') > -1) {
        href = href.replace(/\?from=(groupmessage|singlemessage|timeline)(\S*)#/, '#')
        window.location.href = href
      }
      this.chat_num = localStorage.getItem('chat_num')
      this.notice_num = localStorage.getItem('notice_num')
    },
    created () {
      this.geolocation()
    }
  }
</script>

<style lang="less">
  @import '../src/assets/style/reset';

  html, body {
    height: 100%;
    width: 100%;
    overflow-x: hidden;
    background: white;
  }

  input, button, select, textarea {
    outline: none
  }

  .weui-tabbar, .vux-header {
    position: fixed;
    width: 100%;
    z-index: 9999;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }

  .vux-header {
  }

  .weui-tabbar {
    padding: 6px 0 !important;

    .weui-tabbar__icon {
      width: 22px !important;
      height: 22px !important;
    }
  }

  .dp-header .dp-item {
    color: #04be02;
    font-size: 4vw;
    height: 5.867vw;
    line-height: 5.867vw;
    margin: 16px 0;
    cursor: pointer;
  }

  .vux-no-group-title {
    margin-top: 0 !important;
  }

  .mescroll {
    position: fixed;
    padding-bottom: 1rem;
    top: 0px;
    bottom: 60px;
    height: auto;
    font-size: 32px;
  }

  a {
    text-decoraction: none !important;
    cursor: none;
  }

  a:-webkit-any-link {
    /*color: -webkit-link;*/
    cursor: none;
    text-decoration: none;
  }

  .router-link-active {
    text-decoration: none;
  }

  .tabbar-icon {
    /*background: yellow;*/
    width: 32px;
    height: 32px;
  }

  .vux-demo-tabbar {
    background-color: #FAFAFB !important;
  }
</style>
