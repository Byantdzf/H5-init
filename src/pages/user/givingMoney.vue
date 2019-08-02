<template>
  <div class="page__bd">
    <div class="weui-grids">
      <span v-for="item,index in table">
        <div class="weui-grid text-center" @click="selectMoney(index)">
          <div class="weui-grid__label bold font_28">{{item.title}}</div>
          <img src="http://images.ufutx.com/201905/29/ba3c6991eaf0892feedd836e55ee7249.png" v-if="item.active" class="active_icon" />
        </div>
      </span>
      <div class="clearfloat"></div>
      <div class="text-center font26 bc_else" @click="showInput">
        选择其他金额
        <!--<img src="http://images.ufutx.com/201905/29/c63136413a826ec628d86732ce3a638e.png" class="active_icon main-r" :class="[activeInput?'iconActive': 'icon']"/>-->
      </div>
      <div class="box_input" v-if="activeInput">
        <input type="number" placeholder="输入金额" class="font_32 bold" v-model="price" :focus="activeInput" maxlength="8" />
      </div>
      <div style="height: 10vw" v-else></div>
      <div class="bc_box">
        <div class="font32">打赏金额：
          <span class="bold main-price">{{price}}元</span>
        </div>
        <div class="bc_btn text-center font_32 white" @click="confirm">立即打赏</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {Group, Cell, XHeader, Swiper, XInput, Search, SwiperItem} from 'vux'
  import MescrollVue from 'mescroll.js/mescroll.vue'
  import swiperComponent from '../../components/swiper'
  import {$toastSuccess} from '../../config/util'

  export default {
    components: {
      Group,
      Cell,
      XHeader,
      Swiper,
      SwiperItem,
      XInput,
      Search,
      swiperComponent,
      MescrollVue
    },
    data () {
      return {
        init: false,
        activeInput: false,
        loading: false,
        noMore: false,
        table: [
          {title: '10元', value: '10', active: false},
          {title: '20元', value: '20', active: false},
          {title: '50元', value: '50', active: true},
          {title: '100元', value: '100', active: false},
          {title: '200元', value: '200', active: false},
          {title: '500元', value: '500', active: false}
        ],
        trade_no: '',
        price: 50 // 奉献金
      }
    },
    methods: {
      selectMoney (index) {
        for (let item of this.table) {
          item.active = false
        }
        this.table[index].active = true
        this.price = this.table[index].value
      },
      getMoney (e) {
        this.price = e.detail.value
      },
      showInput () {
        this.activeInput = !this.activeInput
      },
      // 确认
      confirm () {
        console.log(this.price)
        if (!this.price) {
          return this.$showToast('请输入金额')
        }
        let that = this
        let data = {
          price: that.price
        }
        console.log(data)
        this.$http.post(`/official/donation?type=price`, data).then(({data}) => {
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
      }
    },
    mounted () {
    }
  }
</script>

<style lang="less" scoped>
  .page__bd{
    margin-top: 8%;
  }
  ._active{
    background: #1195DD;
    color: white;
    border-bottom-right-radius: 12px;
    border-top-right-radius: 12px;
  }
  .weui-grid {
    position: relative;
    float: left;
    padding: 28px 10px;
    width: 33.33333333%;
    box-sizing: border-box;
  }
  .weui-grid__label {
    display: block;
    text-align: center;
    color: #000000;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .weui-grids {
    position: relative;
    overflow: hidden;
  }
  .weui-grids:before {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 4px solid #eeeeee;
    color: #D9D9D9;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .weui-grid:before {
    content: " ";
    position: absolute;
    right: 0;
    top: 0;
    width: 1px;
    bottom: 0;
    border-right: 4px solid #eeeeee;
    color: #D9D9D9;
    -webkit-transform-origin: 100% 0;
    transform-origin: 100% 0;
    -webkit-transform: scaleX(0.5);
    transform: scaleX(0.5);
  }
  .weui-grid:after {
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom: 4px solid #eeeeee;
    color: #D9D9D9;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .bc_else{
    margin: auto;
    margin-top: 26px;
    position: relative;
    .icon,.iconActive{
      transform: rotateZ(-90deg);
      vertical-align: middle;
      margin-bottom: 4px;
      animation: move 300ms;
      animation-fill-mode: forwards;
    }
    .main-r{
      position: absolute;
      right: 35%;
      top: 8px;
      width: 22px;
      height: 22px;
    }
    .iconActive{
      transform: rotateZ(0deg);
      animation: moveActive 300ms;
      animation-fill-mode: forwards;
    }
    @keyframes moveActive {
      0%{
        transform:rotate(-90deg);
      }
      100%{
        transform:rotate(0deg);
      }
    }
    @keyframes move {
      0%{
        transform:rotate(0deg);
      }
      100%{
        transform:rotate(-90deg);
      }
    }
  }
  .bc_box {
    padding: 0 80px;
    .bc_btn {
      background: #D92553;
      padding: 22px;
      border-radius: 8px;
      margin-top: 12px;
      color: white;
      margin-top: 42px;
    }
  }
  .box_input{
    width: 60%;
    margin: 18px auto;
    padding: 8px 12px;
    border-radius: 6px;
    border: 3px solid #D92553;
    input{
      width: 100%;
      height: 100%;
      color: #D92553;
      border: none;
    }
  }
  .active_icon{
    width: 32px;
    height: 32px;
    position: absolute;
    top: 30px;
    right: 34px;
  }
  .main-price{
    font-size: 52px;color: #e97a40;
  }
</style>
