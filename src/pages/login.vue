<template>
  <div id="login" class="wrapper text-center">
    <div class="center"></div>
    <div class="main-center">
      <div class="main-paas">
        <div class="logo inline-block" v-bind:style="{backgroundImage:'url(' + logo + ')'}" ></div>
        <span class="title">{{paasTitle}}</span>
      </div>
      <div style="position: relative;">
        <input type="number" v-model="mobile" class="font30 colorff mobile" placeholder="请输入您的手机号">
        <img src="https://images.ufutx.com/201907/20/cbfe1071a8b4aad7ba98540b52d864b8.png" alt="icon" class="iphone_icon">
        <img src="https://images.ufutx.com/201903/28/f04cd2fd382dbd6da45260e825ff61ef.png" alt="icon" class="del_icon"
             v-show="mobile" @click="mobile = ''">
        <!--<img src="https://images.ufutx.com/201903/28/458109eca8206129719b768be914382f.png" alt="icon" class="del_icon"-->
             <!--v-show="warn && mobile" style="right: 28px;">-->
      </div>
      <div style="position: relative;">
        <input type="number" v-model="code" class="font30 colorff code" placeholder="验证码" @keyup.enter="login">
        <img src="https://images.ufutx.com/201907/20/eb6285a118416b8b4cf7125d5348e46f.png" alt="icon" class="iphone_icon"
             style="top: 5.2vw;">
        <p class="getCode font28" @click="getCode" v-if="time == 60">{{text}}</p>
        <p class="getCode font28" v-else>{{time}} 秒后重试</p>
      </div>
      <!--<div class="colorTheme font26 text-right register" @click="$router.push({name: 'register'})">还没有账号？</div>-->
      <button class="colorff button text-center font28" @click="login">立即登录</button>
      <p class="font26 protocol">
      <span class="color6">
        点击立即登录默认您同意
      </span>
        <span style="color: #cadefc;text-decoration:underline;">
        <router-link to="protocol" style="color: #D92553; text-decoration: none;">《{{paasTitle}}注册协议》</router-link>
      </span>
      </p>
    </div>
  </div>
</template>

<script>
  import {$toastSuccess, $toastWarn} from '../../src/config/util'

  export default {
    name: 'login',
    components: {},
    data () {
      return {
        mobile: '',
        paasTitle: '福恋平台',
        logo: 'https://images.ufutx.com/201907/26/cc3ffebefa449d3555bc8746dcc6123f.png',
        code: '',
        value: '',
        time: 60,
        warn: true,
        text: '获取验证码',
        timer: ''
      }
    },
    watch: {
      time () {
        if (this.time === 0) {
          clearInterval(this.timer)
          this.time = 60
          this.text = '重新发送'
        }
      },
      mobile () {
        if (!(/^1(3|4|5|7|8|9)\d{9}$/.test(this.mobile))) {
          this.warn = true
        } else {
          this.warn = false
        }
      }
    },
    methods: {
      getCode () {
        let data = {
          mobile: this.mobile
        }
        this.$http.post('/official/sms/register', data).then(({data}) => {
          $toastSuccess('发送成功')
          this.timer = setInterval(() => {
            this.time--
          }, 1000)
        }).catch((error) => {
          console.log(error)
        })
      },
      login () {
        let data = {}
        console.log(localStorage.getItem('community_share'), 'asssssssss')
        // if (localStorage.getItem('community_share') == '1') {
        data = {
          mobile: this.mobile,
          code: this.code,
          community_share: localStorage.getItem('community_share'),
          avatar: localStorage.getItem('avatar'),
          nickname: localStorage.getItem('nickname'),
          official_openid: localStorage.getItem('official_openid')
        }
        // } else {
        //   data = {
        //     mobile: this.mobile,
        //     code: this.code
        //   }
        // }
        if (!this.mobile) {
          return $toastWarn('无手机号码')
        }
        if (!this.code) {
          return $toastWarn('无验证码')
        }
        if (this.warn === true) {
          return $toastWarn('手机号码错误')
        }
        this.$http.post('/official/login/mobile', data).then(({data}) => {
          if (data.wechat && data.wechat.official_openid) {
            localStorage.setItem('official_openid', data.wechat.official_openid)
          } else {
            localStorage.removeItem('official_openid')
          }
          localStorage.setItem('ACCESS_TOKEN', data.token)
          localStorage.setItem('mobile', data.user.mobile)
          if (data.avatar) {
            let userInfo = {
              id: data.user.id,
              name: data.user.name,
              photo: data.user.photo,
              type: data.user.type
            }
            localStorage.setItem('userInfo', JSON.stringify(userInfo))
            if (localStorage.getItem('jump')) {
              window.location.href = localStorage.getItem('jump')
            } else {
              if (localStorage.getItem('paasName')) {
                this.$router.push({name: 'home'})
              } else {
                this.$router.push({name: 'communityHome'})
              }
            }
          } else {
            this.$router.push({
              name: 'personalData'
            })
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      loginFn () {
        this.$http.get('/official/login').then(({data}) => {
          if (!data.official_openid && this.$isWeiXin() === true) {
            const baseURL = process.env.NODE_ENV === 'development' ? 'http://love.hankin.ufutx.cn' : 'https://love.ufutx.com'
            console.log(`${baseURL}/wechat/auth?type=login`)
            window.location.href = `${baseURL}/wechat/auth?type=login`
            return
          }
          if (!data.token) {
            return
          }
          this.mobile = data.user.mobile
          localStorage.setItem('ACCESS_TOKEN', data.token)
          localStorage.setItem('official_openid', data.official_openid)
          localStorage.setItem('mobile', data.user.mobile)
          if (localStorage.getItem('jump')) {
            window.location.href = localStorage.getItem('jump')
          } else {
            if (localStorage.getItem('paasName')) {
              this.$router.push({name: 'home'})
            } else {
              this.$router.push({name: 'communityHome'})
            }
          }
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    mounted () {
      if (localStorage.getItem('paasName') !== null && localStorage.getItem('paasName') !== 'FL') {
        this.paasTitle = localStorage.getItem('paasTitle')
        this.logo = localStorage.getItem('logo')
      }
      this.loginFn()
    }
  }
</script>

<style lang="less" scoped>
  body {
    .wrapper {
      width: 100vw;
      height: 100vh;
      background: #1a1a1a;
      background-size: cover;
      background-repeat: no-repeat;
      position: relative;
      background-position-x: center;
      background-image: url('https://images.ufutx.com/201907/26/ee1ba88327a47ae94c9d34f8755d0a63.png');
      .register{
        padding-right: 46px;
        margin-top: 12px;
      }
      .main-paas{
        /*position: absolute;*/
        /*top: 0;*/
        overflow: hidden;
        margin: auto;
        margin-top: -260px;
        text-align: center;
        margin-bottom: 40px;
        .title{
          color: white;
          font-size: 72px;
          font-weight: bold;
          font-family: "Adobe 楷体 Std R";
        }
        .logo{
          width: 160px;
          height: 160px;
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
          display: inline-block;
          vertical-align: middle;
          margin-bottom: 62px;
        }
      }
      input {
        width: 68%;
        height: 90px;
        background: none;
        border: none;
        background: #eaeaea;
        border-radius: 12px;
        margin-top: 20px;
        color: #666666;
      }

      .center {
        padding-top: 340px;
      }
      .main-center{
        background: white;
        width: 86vw;
        margin: auto;
        padding: 68px 0 96px 0;
        border-radius: 12px;
        box-shadow: 1px 1px 16px #cfcfcf;
      }

      .mobile {
        padding: 0 50px 0 76px;
      }

      .getCode {
        min-width: 164px;
        position: relative;
        position: absolute;
        right: 48px;
        top: 44px;
        color: #D92553;
      }

      .iphone_icon {
        width: 52px;
        position: absolute;
        left: 58px;
        top: 40px;
      }

      .del_icon {
        width: 36px;
        position: absolute;
        right: 56px;
        top: 48px;
      }

      .code {
        width: 56%;
        background: #eaeaea;
        padding: 0 20% 0 12%;
      }

      .button {
        width: 88%;
        height: 86px;
        background: #D92553;
        border: none;
        border-radius: 12px;
        margin-top: 32px;
      }
    }

    .protocol {
      margin-top: 30px;
      /*letter-spacing: 1px;*/
    }
  }
</style>
