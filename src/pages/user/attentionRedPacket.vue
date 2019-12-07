<template>
  <div>
    <div class="z_box_bg">
      <div class="z_head">
        <!--关注公众号领红包-->
        <div class="z_head_pic">
          <p>福恋派红包、助脱单！</p>
        </div>
        <div class="z_head_box">
          <!--未开启-->
          <div v-if="deblocking == 0"  class="modal-amin">
            <img src="https://images.ufutx.com/201911/28/e1097f3ec06f485a67564db016a48622.png" alt="" class="z_head_pic1"  :class="image_amin?'image_amin':''">
            <div class="attention_box">
              <p class="attention_text" @click="onPacket">点击领取</p>
            </div>
          </div>
          <div class="modal-amin" v-if="deblocking == 1">
            <img src="https://images.ufutx.com/201912/03/36179c8d52af5857afebee79bf605c61.jpeg" alt="" class="z_head_pic1">
            <div class="attention_box">
              <p class="attention_text">长按识别</p>
            </div>
          </div>
          <!--开启-->
          <div v-if="deblocking == 2" class="modal-amin">
            <img src="https://images.ufutx.com/201911/29/306caf03f3bec2bb282509ae75ba5d8b.png" alt="">
            <div class="attention_box">
              <p class="attention_text" @click="toastText('您已领取过啦，分享领取更多红包...')">已领取</p>
            </div>
          </div>
        </div>
      </div>
      <div class="z_end">
        <!--分享赢红包-->
        <div class="z_end_pic">
          <p>分享单身，一起领红包!</p>
        </div>
        <!--<img src="https://images.ufutx.com/201911/28/f22fc6094272816a8f5fc941ad767cfc.png" alt="" class="z_end_pic">-->
        <div class="z_share_box">
          <div class="font28 exclusive">分享-他领你也领</div>
          <div class="z_share_within">
            <div style="border-bottom: 1px solid #fee1a8;overflow: hidden">
              <!--立即分享ICON-->
              <img src="https://images.ufutx.com/201911/28/1cdf9defb4efad7b232631758ac4629e.png" alt="" class="z_share_pic flo_l">
              <!--立即分享bottom-->
              <button class="z_bottom flo_r" @click="showshare">立即分享</button>
              <div class="z_share_text">
                <p class="text_invite">我要领更多</p>
                <p class="text_wait">数10万红包等你拿</p>
              </div>
            </div>
            <div class="z_share_user">
              <div style="border-bottom: 1px solid #fee1a8;overflow: hidden" v-for="item,index in shareList">
                <!--用户头像-->
                <img :src="item.from_wechat? item.from_wechat.avatar : ''" alt="" class="z_user_photo flo_l">
                <p style="font-weight: bold;color: #333333;margin-top: 6%" class="flo_l font30 user_text">{{item.from_wechat? item.from_wechat.nickname : ''}}</p>
                <p class="flo_r acquisition_text">获得￥{{item.amount? item.amount : ''}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="vessel" v-if="showModalTimeUp">
        <!--弹框红包取消icon-->
        <img src="http://images.ufutx.com/201907/09/cc558035065ad83a89bb7b5754d918c4.png" alt="" class="close"
             @click="hideModal">
        <!--弹框红包-->
        <div class="modal-vessel">
          <div>
            <img src="https://images.ufutx.com/201911/28/c36ade1d37a2bb088343568428490042.png" alt="">
            <div v-if="showPic">
              <p class="colorff text-center gain_money">￥{{money}}<span> 元</span></p>
              <button class="confirm" @click="hideModal">确定</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <shareModal :show.sync="showShare" @hideModal="hideShare"></shareModal>
  </div>
</template>

<script>
  // import {$loadingShow, $loadingHide, $toastSuccess, $toastWarn} from '../../config/util'
  import {$toastWarn} from '../../config/util'
  // import {$toastWarn} from '../../config/util'
  import shareModal from '../../components/shareMoadl'
  import CountDown from 'vue2-countdown'

  export default {
    name: 'attentionRedPacket',
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
        title: '快来分享给身边单身，一起领红包、助脱单啦！',
        form_openid: '',
        attention: '', // 关注状态
        showShare: false, // 指引分享
        showPic: false, // 遮罩红包图片
        image_amin: true, // 红包左右抖动状态
        showModalTimeUp: false, // 弹框
        deblocking: '', // 开启红包
        open_id: '',
        money: '',
        shareList: []
        // test: 'ou713vx7f8dkEO3gOXRI2JeEcsf8'
      }
    },
    methods: {
      toastText (title) {
        $toastWarn(title)
      },
      getData () {
        let vm = this
        vm.$http.get(`/redinspect?openid=${this.open_id}&fromopenid=${this.form_openid}`)
          .then(({code, data}) => {
            if (code === 0) {
              this.deblocking = data.status
            }
          })
          .catch((error) => {
            console.log(error)
          })
      },
      hideShare (value) {
        this.showShare = value
      },
      getShare () {
        let vm = this
        vm.$http.get(`/sharelist?openid=${this.open_id}`)
          .then(({data}) => {
            vm.shareList = data.list
            let href = `https://love.ufutx.com/wechatoauth?fromopenid=${this.open_id}`
            vm.$shareList('https://images.ufutx.com/201912/07/c77bd4732dc78fc7c635b1a691835ec9.png', href, vm.title, `福恋派红包、助脱单啦！`)
          })
          .catch((error) => {
            console.log(error)
          })
      },
      getRed () {
        let vm = this
        vm.$http.get(`/receivered?openid=${this.open_id}`)
          .then(({data}) => {
            if (data.status.toString() === '1') {
              $toastWarn('请先关注公众号...')
            } else if (data.status.toString() === '2') {
              $toastWarn('您已领取过啦，分享领取更多红包...')
              this.deblocking = 2
            } else {
              this.money = data.msg.toFixed(2)
              setTimeout(() => {
                this.showPic = true
                vm.image_amin = false
              }, 500)
            }
          })
          .catch((error) => {
            console.log(error)
          })
      },
      onPacket () {
        this.getRed()
        this.showModalTimeUp = true
      },
      showshare () {
        this.showShare = true
      },
      hideModal () {
        this.showModalTimeUp = false
        this.getData()
        this.getShare()
      }
    },
    mounted () {
      document.title = '福恋派红包、助脱单啦！'
      let loc = location.href
      let obj = {}
      let n2 = loc.indexOf('?') + 1
      let str = loc.substr(n2)
      let arr = str.split('&')
      for (let i = 0; i < arr.length; i++) {
        var arr2 = arr[i].split('=')
        obj[arr2[0]] = arr2[1]
      }
      this.open_id = obj.openid
      this.form_openid = obj.fromopenid
      if (!this.open_id) {
        window.location.href = `https://love.ufutx.com/wechatoauth?fromopenid=${this.form_openid}`
        // window.location.href = `http://wlj.test/wechatoauth`
        return
      }
      this.getData()
      this.getShare()
    }
  }
</script>

<style lang="less">
  @import '../../assets/style/csshake.css';
  body{
    background: #ff1e6f;
    ::-webkit-scrollbar {display:none}
  }
  .z_box_bg{
    width: 100vw;
    height: 100vh;
    background: url(https://images.ufutx.com/201912/02/230ec6d3c7e284b178b1bf898851990d.png) center top no-repeat;
    background-size: cover;
    .z_head{
      padding-top: 42%;
      img{
        display: block;
      }
      .z_head_pic{
        position: relative;
        width: 412px;
        height: 80px;
        line-height: 80px;
        text-align: center;
        border-radius: 10px;
        background-image: linear-gradient(#fff, #fee0a4);
        margin: 0 auto;
        p{
          color: #542326;
          font-weight: bold;
          letter-spacing: 3px;
          font-size: 32px;
        }
      }
      .z_head_box{
        width: 686px;
        height: 380px;
        border-radius: 10px;
        background-image: url(https://images.ufutx.com/201912/03/467c8520d88e521c3a22ad747c4f8a20.png);
        background-size: cover;
        background-repeat: no-repeat;
        margin: -30px auto 0 auto;
        .modal-amin{
          animation: myMove 300ms linear;
          animation-fill-mode: forwards;
          img{
            width: 240px;
            padding-top: 6%;
            margin: 0 auto;
          }
          .attention_box{
            width: 160px;
            height: 60px;
            background-color: #fbda30;
            line-height: 60px;
            text-align: center;
            margin: 10px auto 0 auto;
            border-radius: 10px;
            .attention_text{
              color: #fd5d37;
              font-weight: bold;
              letter-spacing: 2px;
              font-size: 28px
            }
          }
          .image_amin {
            animation:move 3s 0s infinite;
            -webkit-animation:move 3s 0s infinite;
            transform-origin:bottom;
            -webkit-transform-origin:bottom;
            display:block;
            @keyframes move
            {
              0%, 65%{
                -webkit-transform:rotate(0deg);
                transform:rotate(0deg);
              }
              70% {
                -webkit-transform:rotate(6deg);
                transform:rotate(6deg);
              }
              75% {
                -webkit-transform:rotate(-6deg);
                transform:rotate(-6deg);
              }
              80% {
                -webkit-transform:rotate(6deg);
                transform:rotate(6deg);
              }
              85% {
                -webkit-transform:rotate(-6deg);
                transform:rotate(-6deg);
              }
              90% {
                -webkit-transform:rotate(6deg);
                transform:rotate(6deg);
              }
              95% {
                -webkit-transform:rotate(-6deg);
                transform:rotate(-6deg);
              }
              100% {
                -webkit-transform:rotate(0deg);
                transform:rotate(0deg);
              }
            }

            @-webkit-keyframes move
            {
              0%, 65%{
                -webkit-transform:rotate(0deg);
                transform:rotate(0deg);
              }
              70% {
                -webkit-transform:rotate(6deg);
                transform:rotate(6deg);
              }
              75% {
                -webkit-transform:rotate(-6deg);
                transform:rotate(-6deg);
              }
              80% {
                -webkit-transform:rotate(6deg);
                transform:rotate(6deg);
              }
              85% {
                -webkit-transform:rotate(-6deg);
                transform:rotate(-6deg);
              }
              90% {
                -webkit-transform:rotate(6deg);
                transform:rotate(6deg);
              }
              95% {
                -webkit-transform:rotate(-6deg);
                transform:rotate(-6deg);
              }
              100% {
                -webkit-transform:rotate(0deg);
                transform:rotate(0deg);
              }
            }
          }
        }
      }
      .z_head_pic1{
        width: 240px;
        padding-top: 2%;
        margin: 0 auto;
      }
    }
  }
  .z_end{
    position: relative;
    margin-top: 8%;
    margin-bottom: 5%;
    .z_end_pic{
      position: relative;
      width: 412px;
      height: 80px;
      line-height: 80px;
      text-align: center;
      border-radius: 10px;
      background-image: linear-gradient(#fff, #fee0a4);
      margin: 0 auto;
      p{
        color: #542326;
        letter-spacing: 3px;
        font-weight: bold;
        font-size: 32px;
      }
    }
    .z_share_box{
      width: 686px;
      height: 650px;
      border-radius: 10px;
      background-color: #fff;
      margin: -30px auto 0 auto;
      .exclusive{
        width: 100%;
        text-align: center;
        padding: 42px 0 10px 0;color: #666666
      }
      .z_share_within{
        width: 644px;
        height: 520px;
        border-radius: 10px;
        background-color: #fffdf6;
        border: 1px solid #fee1a8;
        margin: 0 auto;
        .z_share_pic{
          width: 98px;
          display: block;
          margin: 3% 10px 0 20px;
        }
        .z_bottom{
          width: 156px;
          height: 56px;
          font-size: 20px;
          background-color: #ff416a;
          color: #fff;
          border-radius: 10px;
          border: none;
          margin: 7% 30px 0 0;
        }
        .z_share_text{
          margin: 5% 0 30px 0;
          .text_invite{
            font-size: 26px;
            font-weight: bold;
            color: #333333
          }
          .text_wait{
            font-size: 20px;
            color: #666666
          }
        }
        .z_share_user{
          width: 100%;
          height: 380px;
          overflow: auto;
          .z_user_photo{
            width: 80px;
            height: 80px;
            border-radius: 50%;
            margin: 3% 20px 2% 30px;
          }
          .acquisition_text{
            font-size: 26px;
            color: #ff416a;
            margin-top: 6%;
            margin-right: 36px;
            font-weight: bold
          }
        }
      }
    }
  }
  .vessel{
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, .7);
    z-index: 99;
  }
  .close {
    width: 60px;
    position: absolute;
    top: 15%;
    right: 12%;
  }
  .modal-vessel{
    position: relative;
    animation: myMove 300ms linear;
    animation-fill-mode: forwards;
    img {
      width: 80%;
      position: absolute;
      top: 300px;
      left: 12%;
      display: block;
    }
    .gain_money{
      position: absolute;
      top: 630px;
      left: 39%;
      font-size: 42px;
      font-weight: bold
    }
    .confirm{
      position: absolute;
      top: 740px;
      left: 42%;
      width: 140px;
      border-radius: 10px;
      border: none;
      color: #fff;
      letter-spacing: 5px;
      font-size: 28px;
      font-weight: bold;
      background-color: #fbda30;
      height: 60px;
      line-height: 60px;
      text-align: center;
    }
  }
</style>

