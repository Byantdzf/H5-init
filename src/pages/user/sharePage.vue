<template>
  <div class="main-box">
    <!--@click="hideModal"-->
    <!--活动时间未到-->
    <div class="vessel" v-if="showModalTimeDown">
      <img src="http://images.ufutx.com/201907/09/cc558035065ad83a89bb7b5754d918c4.png" alt="" class="close"
           @click="hideModal">
      <div class="modal-vessel" v-if="showModalTimeDown">
        <div class="main-countDown">
          <div class="bc_countDown" @click="hideModal" v-if="status == 0">
            <div class="countDown-text text-center">
              <count-down v-on:end_callback="countDownE_cb()"
                          :currentTime="currentTime"
                          :startTime="startTime"
                          :endTime="endTime"
                          :dayTxt="'天'"
                          :hourTxt="':'"
                          :minutesTxt="':'"
                          :secondsTxt="''" >
              </count-down>
            </div>
          </div>
          <div v-else>
            <img src="https://images.ufutx.com/201907/11/331c92c7442d5f16a1abcd2d8c11cfb4.png" alt="" @click.stop="hideModal">
          </div>
          <!--<img src="https://images.ufutx.com/201907/11/2ee6c592e362854b5d0ed8d8ab7e4fca.png" alt="" @click.stop="hideModal">-->
        </div>
      </div>
    </div>
    <!--活动时间到了-->
    <div class="vessel" v-if="showModalTimeUp">
      <img src="http://images.ufutx.com/201907/09/cc558035065ad83a89bb7b5754d918c4.png" alt="" class="close"
           @click="hideModal">
      <div class="modal-vessel shake-slow">
        <div v-if="!showPic">
          <img src="https://images.ufutx.com/201907/11/403d2174039ff35f9267fa1c3b14a7b7.png" alt=""
               @click.stop="openRedBag" :class="image_amin?'image_amin':''">
        </div>
        <div v-else>
          <div class="change">
            <p class="text-center colorff"><span class="bc_p">{{red_amount}}</span> <span class="colorff">元</span></p>
            <p class="font22 text-center" style="color: #f2eef0">邀请好友，更大的红包等你抢！</p>
            <div class="text-center bc_input ff">
              <div class="bc_mobile">
                <input type="number" placeholder="请输入微信绑定手机号" v-focus="mobileFocus" class="font28" v-model="mobile"/>
                <img src="https://images.ufutx.com/201903/28/458109eca8206129719b768be914382f.png" class="icon"
                     v-show="warn && mobile">
              </div>
              <input type="number" placeholder="验证码" v-focus="codeFocus" class="font28" v-model="code"/>
              <span class="flo_l font26" @click="getCode" v-if="showCode">{{text}}</span>
              <span class="flo_l font26" v-else>{{time}} 秒后重试</span>
            </div>
            <div class="linkbtn" @click="pullDown"></div>
            <div class="rule white font26 text-right">
              活动规则
              <img src="https://images.ufutx.com/201907/11/fa401a4a9f91d6eaad56e3ece1e5383e.png" alt="" class="">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="main-paas">
      <img src="http://images.ufutx.com/201907/09/f4666cc8c335cb67e9a0ddfc22c7f815.png" alt="" class="bc-image">
      <div class="text-center">
        <img src="http://images.ufutx.com/201907/09/8f2443d5a12769c43b6548130b0d8ca8.png" class="bc-icon">
        <p class="color6 font32">福恋交友平台</p>
        <p class="colorb0 font26">用科技让交友变简单</p>
      </div>
    </div>
    <div class="main-rule text-center">
      <img src="https://images.ufutx.com/201907/10/3977842b6aeb97d9dfc681e45401696f.png" class="bc-icon flo_l">
      <img src="https://images.ufutx.com/201907/10/390dd6af8e29356a3c7d68bf06424b78.png" class="bc-icon">
      <img src="https://images.ufutx.com/201907/10/b610ac9d82f446f211c833ac7f52ae39.png" class="bc-icon flo_r">
    </div>
    <div class="main-btn text-center colorff" @click="robFn"
         v-if="information.is_register&&information.is_register != 1">立 即 抢 红 包
    </div>
    <div class="main-btn text-center colorff main-btn-gray" v-else @click="toastText">
      立 即 抢 红 包
      <div class="time" v-if="endTime && status == 0">
        （<count-down v-on:end_callback="countDownE_cb()"
                     :currentTime="currentTime"
                     :startTime="startTime"
                     :endTime="endTime"
                     :dayTxt="'天'"
                     :hourTxt="':'"
                     :minutesTxt="':'"
                     :secondsTxt="''" class="inline-block font26 ">
      </count-down>）
      </div>
    </div>
    <div class="text-right font28 shareList" @click="gotoPage">红包列表</div>
    <div @click="robFn" style="width: 80px;height: 80px;position: absolute;bottom: 0;left: 0;"></div>
    <!--<div class="countDown text-center">-->
    <!--距离活动开始：-->
    <!--<count-down v-on:end_callback="countDownE_cb()"-->
                  <!--:currentTime="currentTime"-->
                  <!--:startTime="startTime"-->
                  <!--:endTime="endTime"-->
                  <!--:dayTxt="'天'"-->
                  <!--:hourTxt="':'"-->
                  <!--:minutesTxt="':'"-->
                  <!--:secondsTxt="''" class="inline-block">-->
      <!--</count-down>-->
    <!--</div>-->
    <shareModal :show.sync="showShare" @hideModal="hideShare"></shareModal>
    <div class="main-group">
      <div style="width: 100%;" v-for="item,index in groupData"
           @click="$router.push({name:'wxGroup',params:{id: item.id}})">
        <div class="bc-img flo_l" v-bind:style="{backgroundImage:'url(' + item.logo + ')'}"></div>
        <div class="color6 font32 flo_l title">{{item.title}}</div>
        <div class="flo_l colorb0 info font26 ellipsis_2 infoH">{{item.intro}}</div>
        <div class="flo_l color6 info font22" style="margin-top: 8px;">
          <img src="http://images.ufutx.com/201907/09/8506a4b082060d9a03dadec282cca3d2.png" alt="" class="icon">
          入群会员：<span class="colorb0">{{item.member_num}}</span>
          <img src="http://images.ufutx.com/201907/09/b0fce85bcff15a7798fd96f7bd4a3085.png" alt="" class="icon"
               style="margin-left: 8px;">
          <span class="colorb0">{{item.click_num}}</span>
          <div class="min-btn text-center colorff flo_r">入群</div>
        </div>
        <div class="dost flo_r"></div>
      </div>
    </div>
  </div>

</template>

<script>
  import {$loadingShow, $loadingHide, $toastSuccess, $toastWarn} from '../../../src/config/util'
  import shareModal from '../../components/shareMoadl'
  import CountDown from 'vue2-countdown'

  export default {
    name: 'sharePage',
    components: {shareModal, CountDown},
    directives: {
      focus: { // 自定义指令 获取焦点
        inserted (el, {value}) {
          if (value) {
            el.focus()
          }
        }
      }
    },
    data () {
      return {
        currentTime: 0,
        startTime: 0,
        endTime: 0,
        groupData: [],
        information: {},
        red_amount: 0,
        showModalTimeDown: false, // 时间未到
        showModalTimeUp: false, // 时间到了
        mobile: '',
        code: '',
        image_amin: false, // 红包动画
        showShare: false,
        showPic: false,
        time: 60,
        warn: true,
        text: '获取验证码',
        status: 0,
        timer: '',
        showCode: true,
        official_openid: '',
        mobileFocus: false, // 获取焦点mobile
        codeFocus: false // 获取焦点code
      }
    },
    watch: {
      time () {
        if (this.time === 0) {
          clearInterval(this.timer)
          this.time = 60
          this.text = '重新发送'
          this.showCode = true
        }
      },
      mobile () {
        if ((/^1(3|4|5|7|8)\d{9}$/.test(this.mobile))) {
          this.warn = false
        } else {
          this.warn = true
        }
      }
    },
    methods: {
      toastText () {
        $toastWarn('红包已抢完，敬请期待下一轮...')
      },
      getCode () { // 发送验证码
        if (this.warn) return
        this.showCode = false
        this.timer = setInterval(() => {
          this.time--
        }, 1000)
        let data = {
          mobile: this.mobile
        }
        this.$http.post('/official/sms/register', data).then(({data}) => {
        }).catch((error) => {
          console.log(error)
        })
      },
      countDownS_cb (x) {
        console.log(x)
      },
      countDownE_cb (x) {
        console.log(x)
      },
      hideShare (value) {
        this.showShare = value
      },
      openRedBag () { // 拆开红包
        this.image_amin = true
        setTimeout(() => {
          this.showPic = true
          this.image_amin = false
        }, 1800)
      },
      pullDown () {
        let vm = this
        if (!this.mobile) {
          this.mobileFocus = true
        } else if (!this.code) {
          this.codeFocus = true
        } else {
          let data = {
            from_official_openid: localStorage.getItem('from_official_openid'),
            official_openid: localStorage.getItem('official_openid'),
            red_amount: this.red_amount,
            mobile: this.mobile,
            code: this.code
          }
          vm.$http.post(`/official/wx/bind/mobile`, data).then(({data}) => {
            if (data.token) {
              localStorage.setItem('ACCESS_TOKEN', data.token)
            }
            vm.hideModal()
            $loadingShow('疯抢中...')
            setTimeout(() => {
              $loadingHide()
              setTimeout(() => {
                $toastSuccess('领取成功')
                vm.information.is_register = 1
              }, 500)
            }, 500)
          }).catch((error) => {
            vm.hideModal()
            // vm.information.is_register = 1
            console.log(error)
          })
        }
      },
      robFn () {
        let vm = this
        vm.showModalTimeUp = true
        console.log('qian')
      },
      hideModal () {
        this.showModalTimeDown = false
        this.showModalTimeUp = false
        this.showPic = false
        // this.$router.push({name: 'sharePage'})
      },
      gotoPage () {
        this.$router.push(
          {
            path: 'shareList',
            query: {
              official_openid: localStorage.getItem('official_openid')
            }
          }
        )
      },
      getData () {
        let vm = this
        vm.$http.get(`/official/community/share?official_openid=${vm.information.official_openid}&is_register=${vm.information.is_register}`).then(({data}) => {
          if (data.official_openid) {
            localStorage.setItem('official_openid', data.official_openid)
            this.official_openid = data.official_openid
          }
          this.getDate(data.start_time)
          this.groupData = data.communities
          this.red_amount = data.red_amount.toFixed(2)
          if (data.token) {
            localStorage.setItem('ACCESS_TOKEN', data.token)
          }
          this.status = data.status
          if (data.status === 0 || data.status === 1) {
            this.showModalTimeDown = true
          }
          let url = `http://love.ufutx.com/wx/bind/v2?from_official_openid=${this.official_openid}`
          let pic = 'http://images.ufutx.com/201907/09/29eeb6bfe457e92d0c3624abd86d47e7.png'
          let title = `福恋红包大派送，领红包还帮身边的单身脱单！`
          let intro = `很多单身群，和热心的介绍人群，总有适合的等你进！`
          console.log(pic, url, intro, title)
          this.$shareList(pic, url, intro, title)
        }).catch((error) => {
          console.log(error)
        })
      },
      getDate (startTime) { // 获取倒计时时间
        // let start = new Date(
        //   new Date(new Date().toLocaleDateString()).getTime()
        // ) // 当天0点
        // let end = new Date( // 当天23:59
        //   new Date(new Date().toLocaleDateString()).getTime() +
        //   18 * 60 * 60 * 1000
        // )
        // let startTime = new Date(new Date().getTime() - 1 * 60 * 60 * 1000) // 当前时间的前一小时
        let endTime = new Date(new Date().getTime()) // 当前时间

        // console.log(start, end)
        // console.log(startTime, endTime)
        this.currentTime = endTime.getTime()
        this.startTime = endTime.getTime()
        this.endTime = startTime
        // console.log(
        //   new Date(parseInt(startTime) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ')
        // )
      }
    },
    mounted () {
      // this.getDate() // 时间
      this.information.is_register = this.$route.query.is_register
      this.information.official_openid = this.$route.query.official_openid
      console.log(this.information)
      this.getData()  // 数据
    }
  }
</script>

<style lang="less">
  @import '../../assets/style/csshake.css';

  .main-box {
    .main-paas {
      width: 100vw;
      position: relative;
      z-index: 9;
      overflow: hidden;

      .bc-image {
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
        z-index: -1;
      }

      .bc-icon {
        width: 126px;
        margin-top: 70px;
      }

      p {
        letter-spacing: 2px;
      }
    }

    .main-rule {
      margin: 22px 40px;

      .bc-icon {
        width: 126px;
      }

      .bc-icon:nth-child(1) {
      }
    }

    .main-btn {
      width: 672px;
      height: 76px;
      background: #d92553;
      margin: auto;
      border-radius: 6px;
      line-height: 76px;
      margin-bottom: 24px;
    }
    .main-btn-gray{
      background: #d9d9d9;
      position: relative;
      .time{
        position: absolute;
        right: 22px;
        bottom: 0px;
      }
    }
    .shareList{
      padding: 0 40px 22px 6px;
      color: #d92553;
    }

    .main-group {
      border-top: 40px solid #f6f6f6;
      /*margin: 24px 0 40px 40px;*/
      padding: 0 40px 26px 40px;
      overflow: hidden;

      .bc-img {
        width: 232px;
        height: 160px;
        background-image: url("http://images.ufutx.com/201907/09/51a610ebffbd3fbdb061fe15303487cc.jpeg");
        background-size: cover;
        background-repeat: no-repeat;
        margin-right: 22px;
        margin-top: 30px;
      }

      .infoH {
        min-height: 66px;
      }

      .title {
        margin-top: 28px;
      }

      .info {
        width: 62%;

        .icon {
          width: 26px;
          vertical-align: middle;
          margin-bottom: 12px;
        }
      }

      .min-btn {
        width: 92px;
        height: 40px;
        background: #D82653;
        border-radius: 6px;
        line-height: 40px;
      }

      .dost {
        width: 100%;
        height: 1px;
        background: #b0b0b0;
        margin-top: 24px;
      }
    }
  }

  .vessel {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, .7);
    z-index: 12;

    .close {
      width: 60px;
      position: absolute;
      top: 12%;
      right: 12%;
    }

    .modal-vessel {
      animation: myMove 300ms linear;
      animation-fill-mode: forwards;

      img {
        width: 110%;
        margin-left: -5%;
      }

      .image_amin {
        animation: shake-slow 1800ms linear;
        animation-fill-mode: forwards;
        @-webkit-keyframes shake-slow {
          0% {
            -webkit-transform: translate(0px, 0px) rotate(0deg);
          }
          2% {
            -webkit-transform: translate(-1px, 3px) rotate(-1.5deg);
          }
          4% {
            -webkit-transform: translate(-4px, 5px) rotate(-1.5deg);
          }
          6% {
            -webkit-transform: translate(-1px, 6px) rotate(-0.5deg);
          }
          8% {
            -webkit-transform: translate(5px, -4px) rotate(-3.5deg);
          }
          10% {
            -webkit-transform: translate(-7px, -3px) rotate(-3.5deg);
          }
          12% {
            -webkit-transform: translate(-1px, 8px) rotate(2.5deg);
          }
          14% {
            -webkit-transform: translate(3px, -5px) rotate(-1.5deg);
          }
          16% {
            -webkit-transform: translate(1px, 0px) rotate(2.5deg);
          }
          18% {
            -webkit-transform: translate(-6px, -10px) rotate(-0.5deg);
          }
          20% {
            -webkit-transform: translate(3px, -2px) rotate(1.5deg);
          }
          22% {
            -webkit-transform: translate(0px, 0px) rotate(-2.5deg);
          }
          24% {
            -webkit-transform: translate(-5px, -4px) rotate(1.5deg);
          }
          26% {
            -webkit-transform: translate(-1px, 3px) rotate(-3.5deg);
          }
          28% {
            -webkit-transform: translate(1px, 1px) rotate(-3.5deg);
          }
          30% {
            -webkit-transform: translate(-4px, 8px) rotate(1.5deg);
          }
          32% {
            -webkit-transform: translate(-9px, 7px) rotate(-3.5deg);
          }
          34% {
            -webkit-transform: translate(4px, -9px) rotate(-2.5deg);
          }
          36% {
            -webkit-transform: translate(1px, -6px) rotate(-2.5deg);
          }
          38% {
            -webkit-transform: translate(-4px, 0px) rotate(-2.5deg);
          }
          40% {
            -webkit-transform: translate(3px, -7px) rotate(0.5deg);
          }
          42% {
            -webkit-transform: translate(4px, 4px) rotate(-0.5deg);
          }
          44% {
            -webkit-transform: translate(8px, -4px) rotate(-2.5deg);
          }
          46% {
            -webkit-transform: translate(9px, 9px) rotate(-3.5deg);
          }
          48% {
            -webkit-transform: translate(6px, -8px) rotate(-0.5deg);
          }
          50% {
            -webkit-transform: translate(-1px, 4px) rotate(-3.5deg);
          }
          52% {
            -webkit-transform: translate(4px, 6px) rotate(-1.5deg);
          }
          54% {
            -webkit-transform: translate(9px, -3px) rotate(2.5deg);
          }
          56% {
            -webkit-transform: translate(8px, -2px) rotate(-3.5deg);
          }
          58% {
            -webkit-transform: translate(-2px, -9px) rotate(-0.5deg);
          }
          60% {
            -webkit-transform: translate(-1px, -5px) rotate(2.5deg);
          }
          62% {
            -webkit-transform: translate(-8px, 3px) rotate(2.5deg);
          }
          64% {
            -webkit-transform: translate(6px, -2px) rotate(-3.5deg);
          }
          66% {
            -webkit-transform: translate(-5px, 9px) rotate(-1.5deg);
          }
          68% {
            -webkit-transform: translate(3px, 1px) rotate(-0.5deg);
          }
          70% {
            -webkit-transform: translate(6px, 4px) rotate(-1.5deg);
          }
          72% {
            -webkit-transform: translate(-6px, -5px) rotate(1.5deg);
          }
          74% {
            -webkit-transform: translate(-8px, 0px) rotate(-0.5deg);
          }
          76% {
            -webkit-transform: translate(-5px, -8px) rotate(1.5deg);
          }
          78% {
            -webkit-transform: translate(5px, -3px) rotate(-1.5deg);
          }
          80% {
            -webkit-transform: translate(-6px, -3px) rotate(-1.5deg);
          }
          82% {
            -webkit-transform: translate(7px, 8px) rotate(-1.5deg);
          }
          84% {
            -webkit-transform: translate(-6px, 9px) rotate(0.5deg);
          }
          86% {
            -webkit-transform: translate(1px, 8px) rotate(-3.5deg);
          }
          88% {
            -webkit-transform: translate(-9px, -2px) rotate(1.5deg);
          }
          90% {
            -webkit-transform: translate(4px, -6px) rotate(-1.5deg);
          }
          92% {
            -webkit-transform: translate(0px, -1px) rotate(0.5deg);
          }
          94% {
            -webkit-transform: translate(2px, -9px) rotate(2.5deg);
          }
          96% {
            -webkit-transform: translate(-9px, 1px) rotate(-2.5deg);
          }
          98% {
            -webkit-transform: translate(-9px, -5px) rotate(-3.5deg);
          }
        }
      }

      .change {
        width: 150%;
        height: 60vh;
        margin-left: -23%;
        background-image: url("https://images.ufutx.com/201907/11/4b9701a3b723281db0edc3b3f20ff196.png");
        background-repeat: no-repeat;
        background-size: contain;
        position: relative;
        padding-top: 56%;

        .bc_p {
          font-size: 72px;
        }

        .bc_input {
          width: 56%;
          padding: 12px 0;
          /*height: 60px;*/
          border: none;
          margin: auto;
          margin-top: 20px;
          border-radius: 8px;
          overflow: hidden;

          input {
            width: 80%;
            border: none;
            padding: 8px 22px;
            font-size: 26px;
          }

          input::-webkit-input-placeholder {
            color: #b0b0b0;
          }

          input:nth-child(1) {
            width: 85%;
          }

          input:nth-child(2) {
            /*background: pink;*/
            padding-right: 0;
            width: 48%;
            float: left;
            margin-left: 6px;
            padding-top: 10px;
          }

          .bc_mobile {
            position: relative;
            text-align: left;
            border-bottom: 1px solid #b0b0b0;

            .icon {
              width: 26px;
            }

            input {
              width: 76%;
              margin-left: 6px;
            }
          }

          span {
            color: #D92553;
            height: 40px;
            line-height: 40px;
            margin-top: 8px;
            padding-left: 14px;
            border-left: 1px solid #b0b0b0;
            /*background: chartreuse;*/
          }
        }

        .linkbtn {
          width: 52%;
          height: 90px;
          background: url("https://images.ufutx.com/201907/11/5a78221329597409108ecd09210f1001.png") no-repeat;
          background-size: contain;
          margin: auto;
          margin-top: 20px;
        }

        .rule {
          width: 52%;
          margin: auto;
          /*background: white;*/
          margin: auto;
          margin-top: 6px;
          color: white;
          font-size: 20px;

          img {
            width: 14px;
            vertical-align: middle;
            margin-left: 4px;
          }
        }
      }
      .main-countDown{
        .bc_countDown{
          width: 130%;
          height: 65vh;
          margin-left: -15%;
          background-image: url("https://images.ufutx.com/201907/11/d2f972d3f4dc66ff3fe0ce008162c079.png");
          background-size: contain;
          background-repeat: no-repeat;
          position: relative;
        }
        .countDown-text{
          position: relative;
          top: 17%;
          font-size: 80px;
          color: #f75c5a;
        }
      }

      @keyframes myMove {
        from {
          width: 0;
          height: 0;
          margin: 27% auto;
        }
        to {
          width: 60%;
          height: 40%;
          margin: 36% auto;
        }
      }
    }
  }

  .countDown {
    margin: 12px;
    color: red;
  }
</style>
