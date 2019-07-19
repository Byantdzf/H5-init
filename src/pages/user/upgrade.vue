<template>
  <div class="upgrade">
    <div>
      <img class="diamondPicture"  src="https://images.ufutx.com/201907/10/6492f939896e5c4a9d5faaae3fd3d9b4.png" alt="">
      <div class="head_card">
        <div class="box_card">
          <img class="card" src="https://images.ufutx.com/201907/10/4f985f47bc52f9fdc8e7ae28319c0a8e.png" alt="">
        </div>
        <div class="head_portrait">
          <div class="portrait_name_diamond">
            <div class="portrait backCover " :class="user.rank_id > 0?'icon_diamond':'icon_noOpen'" :style="{backgroundImage:'url(' + user.avatar + ')'}"></div>
            <p class="ic_name font34 ellipsis_1 inline-block">{{user.name}}</p>
            <span class="ic_diamond">{{user.rank_name}}VIP</span>
          </div>
          <p class="ic_text">成为VIP，拥有尊享特权</p>
        </div>
      </div>
    </div>
    <div>
      <tab style="margin-top: 30px" class="text-center"  custom-bar-width="60px" >
        <tab-item :selected="tabIndex == item.id" style="background: none;" @on-item-click="tabItem(item.type, item.id)" v-for="(item,index) in tabs" :key="index">{{item.name}}</tab-item>
      </tab>
      <!--<hr class="hr"/>-->
      <div class="ic_privilege">
        <p class="privilege font26"><span class="theme_clo">会员特权</span></p>
      </div>
      <div class="box_privilege">
        <div class="privilege_introduce">
          <div class="membership" v-for="item,index in official_feature" :key="index">
            <img class="icon_membership" :src="item.icon" alt="">
            <p class="font26">{{item.text}}</p>
            <p class="font22 colorbe">{{item.desc}}</p>
          </div>
        </div>
      </div>
      <div class="explain">
        <p class="ic_explain font26">
          说明：<br>
          <span v-for="item in rank.explain">
          · {{item}}<br>
          </span>
        </p>
      </div>
      <div class="dist"></div>
      <div class="box_bottom theme_bc" v-if="sub_ranks.length > 1">
        <p class="month" @click="conversion(sub_ranks[0].id)">
          <span class="ic_month">￥{{sub_ranks[0].discount_price}}/年</span>
          <span class="original">原价￥{{sub_ranks[0].price}}</span>
        </p>
        <p class="year" @click="conversion(sub_ranks[1].id)">
          <span class="ic_year">￥{{sub_ranks[1].discount_price}}/月</span>
          <span class="original">原价￥{{sub_ranks[1].price}}</span>
        </p>
      </div>
      <div class="box_bottom" v-if="sub_ranks.length == 1">
        <p class="year" style="width: 100%;" @click="conversion(sub_ranks[0].id)">
          <span class="ic_month">￥{{sub_ranks[0].discount_price}}/年</span>
          <span class="original">原价￥{{sub_ranks[0].price}}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import {Tab, TabItem} from 'vux'
  import {$toastWarn, $toastSuccess, $loadingShow, $loadingHide} from '../../config/util'

  export default {
    name: 'upgrade',
    components: {
      Tab,
      TabItem
    },
    data () {
      return {
        tabs: [
          {name: '市级VIP', id: 0, type: '市级'},
          {name: '黄金VIP', id: 1, type: '黄金'},
          {name: '钻石VIP', id: 2, type: '钻石'}
        ],
        tabIndex: 0,
        type: '市级',
        user: {
          avatar: 'https://images.ufutx.com/201904/15/6099fa31d31f5aa1f2c92986f45d3cfa.gif'
        },
        rank: {},
        sub_ranks: [],
        official_feature: [],
        score: {}
      }
    },
    methods: {
      tabItem (type, index) {
        this.type = type
        this.tabIndex = index
        this.getOrderList()
      },
      conversion (id) {
        let data = {
          sub_rank_id: id
        }
        this.$http.post(`/official/member/recharge`, data).then(({data}) => {
          let wxconfig = data.wx_pay.config
          if (data.wx_pay.mweb_url) {
            window.location.href = data.wx_pay.mweb_url
          } else {
            console.log(wxconfig.appId)
            // this.$wechat.chooseWXPay({
            //   appId: wxconfig.appId,
            //   timeStamp: wxconfig.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            //   nonceStr: wxconfig.nonceStr, // 支付签名随机串，不长于 32 位
            //   package: wxconfig.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
            //   signType: wxconfig.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            //   paySign: wxconfig.paySign, // 支付签名
            //   success: function (res) {
            //     $toastSuccess('支付成功')
            //     // that.$post({url: `${service.orderpay}/${that.trade_no}/v2`}, {
            //     //   success: ({code, data}) => {
            //     //     that.$Toast_success('支付成功')
            //     //     setTimeout(() => {
            //     //       that.$gotoTab('/pages/tabBar/user')
            //     //     }, 1200)
            //     //   },
            //     //   fail: ({code, data}) => {
            //     //   },
            //     //   complete: () => {
            //     //   }
            //     // })
            //   },
            //   fail: function (res) {
            //     $toastWarn('取消支付')
            //   }
            // })
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
      getOrderList () {
        $loadingShow('加载中...')
        this.$http.get(`/official/ranks?name=${this.type}`).then(({data}) => {
          console.log(data, '666')
          this.user = data.user
          this.rank = data.rank
          this.score = data.score
          this.sub_ranks = data.rank.sub_ranks
          this.official_feature = data.rank.official_feature
          if (this.$isWeiXin()) {
            if (!data.user.official_openid || data.user.official_openid === null) {
              this.$router.push({name: 'user'})
            }
          }
          localStorage.setItem('official_openid', data.user.official_openid)
          $loadingHide()
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    // created () {
    //   this.getOrderList()
    // },
    mounted () {
      this.getOrderList()
    }
  }
</script>

<style scoped lang="less">
  .upgrade{
    width: 100vw;
    /*height: 100vh;*/
    background-color: #ffffff;
    .diamondPicture{
      width: 100vw;
      height: 190px;
    }
    .box_card{
      width: 100vw;
      text-align: center;
    }
    .card{
      width: 328px;
      height: 178px;
      margin-top: -138px
    }
    .icon_diamond{
      &:before{
        content: '';
        position: absolute;
        right: 0;
        bottom: 0;
        width: 30px;
        height: 30px;
        background-image: url("https://images.ufutx.com/201904/08/766edb1da9aacbc963c9dde4d669e123.png");
        background-size: cover;
        background-position-x: center;
        background-repeat: no-repeat;
      }
    }
    .icon_noOpen{
      &:before{
        content: '';
        position: absolute;
        right: 0;
        bottom: 0;
        width: 30px;
        height: 30px;
        background-image: url("https://images.ufutx.com/201904/08/e4ff9dc96711210dcde89f13d63ccee8.png");
        background-size: cover;
        background-position-x: center;
        background-repeat: no-repeat;
      }
    }
    .head_portrait{
      width: 100vw;
      text-align: center;
      margin-top: -236px;
    }
    .portrait{
      width: 122px;
      height: 122px;
      border-radius: 50%;
      background-color: #e9e9e9;
      margin: auto;
      position: relative;
      background-repeat: no-repeat;
      background-size: cover;
      position: relative;
    }
    .ic_text,.ic_diamond{
      font-size: 18px;
    }
    .ic_name{
      max-width: 140px;
    }
    .portrait_name_diamond{
      margin-bottom: 12px;
      position: relative;
    }
    .ic_diamond{
      margin-left: 4px;
      color: #f56a22;
    }
    .ic_text{
      color: #024261;
    }
    .dist{
      height: 130px;
    }
    .icon_vip{
      /*position: absolute;*/
      /*left: 410px;*/
      /*top: 90px*/
    }
    .ic_vip{
      width: 100vw;
      padding-top: 44px;
      text-align: center;
    }
    .box_vip{
      width: 32%;
      display: inline-block;
      text-align: center;
    }
    .cityLevel{
      font-size: 26px;
      display: inline-block;
      font-weight: bold;
      text-align: center;
      padding-bottom: 20px;
    }
    .active{
      color: #f56b25;
      position: relative;
      &:before{
        content: '';
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 1px;
        border-bottom: 6px solid #f56b25;
        border-radius: 12px;
      }
    }
    .hr{
      margin-bottom: 30px;
    }
    .ic_privilege{
      margin-top: 30px;
      width: 100vw;
      text-align: center;
      position: relative;
    }
    .privilege{
      position: relative;
    }
    .privilege:after, .privilege:before{
      content: "";
      width: 50px;
      height: 2px;
      position: absolute;
      background-color: #cdcdcd;
      top: 14px;
      z-index: 1;
      vertical-align: middle;
    }
    .privilege:after{
      margin-left: 20px;
    }
    .privilege:before{
      margin-left: -70px;
    }
    .box_privilege{
      padding: 0 34px 30px 34px;
    }
    .privilege_introduce{
      margin-top: 20px;
      padding: 60px 0 60px 0;
      border-radius: 12px;
      box-shadow: 0 1px 32px #dedede;
      text-align: center;
    }
    .membership, .addFriends, .exchangePrivilege{
      display: inline-block;
      width: 32%;
      text-align: center;
      line-height: 1.5;
    }
    .icon_membership{
      width: 80px;
    }
    .icon_addFriends{
      width: 53px;
    }
    .icon_exchangePrivilege{
      width: 57px;
    }
    .explain{
      padding: 0px 34px 0px 34px;
    }
    .ic_explain{
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0px 1px 32px #dedede;
      color: #a9a9a9;
      line-height: 1.8;
    }
    .box_bottom{
      width: 100vw;
      height: 105px;
      background-color: #344a5d;
      position: fixed;
      bottom: 0px;
    }
    .month, .year{
      width: 49%;
      font-size: 34px;
      color: #ffffff;
      line-height: 105px;
      position: relative;
      text-align: center;
      display: inline-block;
    }
    .month:after{
      content: '';
      background-color: #ffffff;
      width: 1px;
      position: absolute;
      height: 60px;
      top: 26px;
      z-index: 2;
      right: 0;
    }
    .original{
      font-size: 18px;
      color: #ffffff;
      text-decoration: line-through;
    }
    .vux-tab{
      background-color: none;
    }
  }
</style>
