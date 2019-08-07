<template>
  <div class="main-menu">
    <div class="main-banna">
      <img v-if="type === 'manpower'" src="http://images.ufutx.com/201905/31/6dbf441f112370befd2abb373edb0486.png" alt="" style="width: 100%">
      <img v-else src="http://images.ufutx.com/201905/31/f36d431299cd56651ba8ab432727c14c.png" alt="" style="width: 100%">
    </div>
    <tab style="background-color: #56a0ce;font-size: 14px" bar-active-color="#D92553" active-color="#D92553" custom-bar-width='100px'>
      <tab-item :selected="type === 'manpower'" @on-item-click="tabClick('manpower')">人工牵线</tab-item>
      <tab-item :selected="type === 'matchmakier'" @on-item-click="tabClick('matchmakier')">红娘托管</tab-item>
    </tab>
    <div class="page__bd ff">
      <div v-for="item,index in type === 'manpower'?list:Hosting">
        <div class="bc_box">
          <div class="flo_l text_title">专属</div>
          <div class="flo_l main-text">
            <span class="text_price bold">￥{{item.price}}</span>
            <span class="font26 colorb0 text-info">（{{item.name}})</span>
          </div>
          <div class="flo_r text_foot bold" @click="dealItem=item,showDeal=true">购买</div>
        </div>
      </div>
    </div>
    <div class="bc_call flo_r">
      <img class="image" src="http://images.ufutx.com/201905/31/c41774b536f913f927eb54592ba71905.png"/>
      <div class="call_iphone font26">热线：4000401707</div>
    </div>
    <div class="clearfloat"></div>
    <div>
      <div class="font28 state info">
        <div class="title bold text-left font28">{{type === 'manpower'?messages[0].title:messages[1].title}}</div>
        <div style="margin: 2px 12px;" v-for="item,index in type === 'manpower'?messages[0].texts:messages[1].texts" wx:key="index">
          <div class="font26">{{item}}</div>
        </div>
      </div>
    </div>
    <moadlDown :show.sync="showDeal" @hideModal="hideDeal">
      <div class="main-deal">
        <div class="deal-text color6 font28">{{dealItem.deal}}</div>
        <div class="deal-checkbox">
          <label>
            <input type="checkbox" style="margin-bottom: -12px;" v-model="checkbox"/>
            <p class="font26 inline-block" >同意遵守协议各项内容</p>
          </label>
          <!--<div style="height: 1px; width: 100%;border-top: 1px solid #d0d0d0;margin-top: 12px;"></div>-->
          <div class="Deal-box text-center">
            <div class="deal-btn deal-btn-no font28" v-if="!checkbox">确定购买</div>
            <div class="deal-btn font28" @click="buy" v-else>确定购买</div>
          </div>
        </div>

      </div>
    </moadlDown>
  </div>
</template>

<script>
  import {$toastSuccess, $toastWarn} from '../../config/util'
  import {Tab, TabItem} from 'vux'
  import moadlDown from '../../components/moadlDown'

  export default {
    name: 'loveMate',
    components: {
      Tab,
      TabItem,
      moadlDown
    },
    data () {
      return {
        desc: '',
        remnant: 0,
        list: [],
        meet: [],
        Hosting: [],
        type: 'manpower',
        showDeal: false,
        dealItem: {},
        checkbox: false,
        messages: [
          {
            title: '什么情况需要破冰牵线',
            texts: [
              '1、发现心仪对象需要牵线时', '2、双方在平台有好感，需要安排见面时', '3、心在动，口难开'
            ]
          },
          {
            title: '什么情况需要红娘托管',
            texts: [
              '1、身边缺乏单身', '2、事务繁忙，没精力顾及', '3、对恋爱少根筋'
            ]
          }
        ]
      }
    },
    methods: { // 方法
      descInput () {
        this.remnant = this.desc.length
      },
      buy (item) {
        this.showDeal = false
        console.log(this.dealItem)
        // let data = {
        //   appoint_id: this.dealItem.id
        // }
        this.$http.post(`/official/appointments/${this.dealItem.id}`).then(({data}) => {
          let wxconfig = data.wx_pay.config
          if (data.wx_pay.mweb_url) {
            window.location.href = data.wx_pay.mweb_url
          } else {
            console.log(wxconfig.appId)
            WeixinJSBridge.invoke(
              'getBrandWCPayRequest', {
                'appId': wxconfig.appId,
                'timeStamp': wxconfig.timestamp,
                'nonceStr': wxconfig.nonceStr,
                'package': wxconfig.package,
                'signType': wxconfig.signType,
                'paySign': wxconfig.paySign
              },
              function (res) {
                if (res.err_msg === 'get_brand_wcpay_request:ok') {
                  $toastSuccess('微信支付成功')
                  that.$router.replace({name: 'fullOrder', query: {id: '2'}})
                } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
                  $toastWarn('取消支付')
                  that.$router.replace({name: 'fullOrder', query: {id: '1'}})
                } else if (res.err_msg === 'get_brand_wcpay_request:fail') {
                  $toastWarn('网络异常，请重试')
                }
              }
            )
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      hideDeal (val) {
        this.showDeal = val
      },
      getData () {
        let vm = this
        this.$http.get(`/appointments`).then(({data}) => {
          vm.meet = data.active_appointments
          vm.Hosting = data.passive_appointments
          vm.list = vm.meet
        }).catch((error) => {
          console.log(error)
        })
      },
      tabClick (type) {
        this.type = type
        // let page = {num: 1}
        // this.getList(page)
      },
      save () {
        if (!this.desc) {
          return $toastWarn('请输入反馈内容')
        }
        let data = {
          content: this.desc
        }
        this.$http.post(`/official/feedback`, data).then(({data}) => {
          $toastSuccess('感谢你的反馈！')
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    mounted () { // 拉取数据
      this.getData()
    }
  }
</script>

<style scoped lang="less">
  .box_background{
    width: 100vw;
    height: 100vh;
    background-color: #f0f3f5;
  }
  .box_camera_backgruond{
    background-color: #ffffff;
  }
  .box{
    /*position: relative;*/
  }
  .main-deal{
    width: 94%;
    min-height: 70vh;
    background: white;
    border-radius: 12px;
    position: relative;
    padding: 3%;
    .deal-checkbox{
      margin: 12px;
      input{
        width: 38px;
        height: 38px;
        background: white;
        float: left;
        margin-top: 10px;
        margin-right: 12px;
      }
    }
    .deal-text{
      width: 100%;
      height: 60vh;
      white-space: pre-line;
      text-align: left;
      overflow: auto;
      z-index: -1;
    }
    .Deal-box{
      width: 92%;
      padding-top: 22px;
      .deal-btn{
        margin-top: 22px;
        background: #D92553;
        padding: 16px 32px;
        color: white;
        display: inline-block;
        border-radius: 8px;
        z-index: 99;
      }
      .deal-btn-no{
        background: #d3d3d3;
      }
    }
  }
  .bc_box{
    width: 100%;
    height: 152px;
    background-image: url("http://images.ufutx.com/201905/31/b6d697e0db3a6a1fe1afe76db815ce36.png");
    background-size: contain;
    background-repeat: no-repeat;
    position: relative;
    line-height: 140px;
    .text_title{
      margin-left: 42px;
      margin-right: 64px;
    }
    .main-text{
      width: 50%;
      line-height: 116px;
      position: relative;
    }
    .text_price{
      color: orange;
      width: 100%;
    }
    .text-info{
      position: absolute;
      left: 0;
      top: 32px;
      color: #666666;
    }
    .text_foot{
      margin-right: 50px;
      color: orange;
    }
  }
  .state{
    background: #f7f7f7;
    padding: 12px 16px 8px 16px;
    border: 1px solid #d3d3d3;
    border-radius: 10px;
    color: #b0b0b0;
    .title{
      color: #666666;
    }
  }
  .page__bd{
    margin-top: 32px;
    padding: 32px;
  }
  .bc_call{
    position: relative;
    margin-top: 62px;
    display: inline-block;
    margin-right: 32px;
    .image{
      width: 100px;
      height: auto;
      z-index: 1;
      position: absolute;
      bottom: 0;
      right: 0;
    }
    .call_iphone{
      width: 240px;
      background: #FBCDB9;
      font-weight: 600;
      color: #F96262;
      padding: 12px 28px;
      padding-right: 110px;
      border-radius: 26px;
      z-index: -1;
    }
  }
  .info{
    margin: 22px;
    margin-top: 46px;
    padding: 22px 0;
    margin-bottom: 32px;
    color: #b0b0b0;
    .title{
      border-bottom: 1px solid #d3d3d3;
      margin: 0 0 0 22px;
      padding-bottom: 12px;
    }
  }
  .circle{
    text-align: right;
    padding: 30px 35px;
  }
  .input_text{
    font-size: 30px;
    padding: 20px 36px;
    width: 678px;
    height: 300px;
    border: none;
    outline: none;
  }
  .icon_camera{
    padding: 0 35px 0 35px;
  }
  .box_camera{
    float: left;
    text-align: center;
    width: 33.3%;
  }
  .camera_s{
    width: 218px;
    height: 218px;
    display: inline-block;
    margin-top: 4px;
    background-size: cover;
    background-repeat: no-repeat;
    /*background: black !important;*/
  }
  .camera_bottom{
    padding-bottom: 22px;
    padding-right: 26px;
    margin-top: 12px;
  }
  .save{
    padding: 12px 22px;
    border-radius: 6px;
    background-color: #00a400;
    float: right;
    color: white;
  }
</style>
