<template>
  <div class="homepage">
    <div class="caution">
      <img class="icon_caution" src="https://images.ufutx.com/201907/10/3db15ebf30d80ba8a9b9e1728ae72370.png" alt="">
      <span class="font30 bold theme_clo">为什么要身份认证</span>
      <p class="caution_particulars font28">福恋作为一个真实、严肃的婚恋平台，我们要求用户必须完成身份认证，对于以结婚为目的的用户。</p>
    </div>
    <div class="caution">
      <img class="icon_caution" style="transform: rotate(180deg);" src="https://images.ufutx.com/201907/10/e149bcc2756b6b0c12a4e9cc54e453bd.png" alt="">
      <span class="font30 bold theme_clo">关于隐私安全</span>
      <p class="caution_particulars font28">您上传的任何身份证照片等资料，仅供审核使用且TA人无法看到，此外，我们会对照片进行安全处理，敬请放心。</p>
    </div>
    <p class=" certificate">
      <span class="certificate_id theme_clo">身份认证</span>
      <span class="font22 theme_clo">(请务必按示例上传身份证照片)</span>
    </p>
    <div>
      <p class="text_name" >姓名：</p>
      <input class="input_name" type="text" v-model="name" placeholder="请输入">
    </div>
    <div>
      <p class="text_IdNumber">身份证号:</p>
      <input class="input_IdNumber"  type="number" v-model="card_num" placeholder="请输入">
    </div>
    <div class=" font26 state info ff">
      <p class="font28 title bold theme_clo">注意事项</p>
      <p class="color6">
        <p>1、购买成功后，你将有三次提交机会，每次提交会消耗一次机会，若三次均未能通过,请<span class="orange" >上传身份证</span>人工认证；
        </p>
        <p>2、请输入用您自己的身份证登记的手机号；</p>
        <p>3、如没有自己身份登记的手机号，请按点击红色字体，按要求上传个人证件；</p>
        <p>4、实名认证是平台的基本要求，只有认证的用户才能互看信息和交流互动；</p>
        <p>5、认证成功后将不能更改，请务必确认信息准确无误；</p>
        <p>6、由阿里去提供实名认证服务，安全可靠！</p>
      </p>
    </div>
    <div class="dist"></div>
    <div class="submit ok theme_bc" v-if="user.is_approved == 1">已成功认证!<img src="https://images.ufutx.com/201904/10/872192ded66adf0c822215e1544f01ee.png" alt=""></div>
    <div v-else>
      <div class="submit theme_bc" @click="save" v-if="user.approve_time > 0">提交 <span class="font26">（剩余{{user.approve_time}}次）</span></div>
      <div class="submit theme_bc" @click="buyAuthentication" v-if="user.approve_time == 0 && user.approve_time == 0">购买认证</div>
      <div class="submit theme_bc" @click="routeTo('uploadIdCard')" v-if="user.approve_time == 0 && user.approve_order == 1">人工认证</div>
    </div>
    <div v-transfer-dom>
      <popup v-model="show">
        <div class="popup_center">
          <div class="center">
            <p class="bold">福恋平台提示</p>
            <p>您还剩{{user.approve_time}}次认证</p>
          </div>
          <div class="height160"></div>
          <div class="submit" @click="save">提交</div>
        </div>
      </popup>
    </div>
  </div>
</template>
<script>
  import {$toastSuccess, $toastWarn} from '../../config/util'
  import {TransferDom, Popup} from 'vux'
  export default {
    name: 'authentication',
    directives: {
      TransferDom
    },
    components: {
      Popup
    },
    data () {
      return {
        name: '',
        card_num: '',
        user: {},
        show: false
      }
    },
    methods: {
      routeTo (name) {
        this.$router.push({name: name})
      },
      getUser () {
        this.$http.get(`/official/mine`).then(({data}) => {
          this.user = data
          if (this.$isWeiXin()) {
            if (!data.user.official_openid || data.user.official_openid === null) {
              this.$router.push({name: 'user'})
            }
          }
          localStorage.setItem('official_openid', data.official_openid)
        }).catch((error) => {
          console.log(error)
        })
      },
      buyAuthentication () {
        this.$http.post(`/official/user/buy/approve`).then(({data}) => {
          let wxconfig = data.wx_pay.config
          if (data.wx_pay.mweb_url) {
            window.location.href = data.wx_pay.mweb_url
          } else {
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
                  $toastWarn('用户取消支付')
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
      save () {
        let data = {
          name: this.name,
          card_num: this.card_num
        }
        if (!this.name) {
          $toastWarn('请输入名字')
        }
        if (!this.card_num) {
          $toastWarn('请输入身份证')
        }
        console.log(data)
        this.$http.post(`/official/user/approve`, data).then(({data}) => {
          $toastSuccess('认证成功')
          this.getUser()
        }).catch((error) => {
          console.log(error)
          this.getUser()
        })
      }
    },
    mounted () {
      this.getUser()
    }
  }
</script>
<style scoped lang="less">
  body{background: white}
  .homepage{
    width: 750px;
    /*height: 100vh;*/
    background: white;
    position: relative;
  }
  .info{
    width: 86%;
    margin: 62px auto;
    box-shadow: 1px 1px 12px #dedede;
    padding: 22px;
    line-height: 1.8em;
  }
  .caution{
    color: #2c2c2c;
    margin-bottom: 20px;
    padding: 20px 30px 0px 30px;
    p{
      margin-top: 12px;
    }
    .icon_caution{
      width: 46px;
      vertical-align: middle;
    }
  }
  .caution_particulars{
    text-indent: 26px;
    color: #646464;
    padding: 0px 30px 0px 30px;
  }
  .issue{
    color: #2c2c2c;
    margin: 108px 0px 0px 0px;
    padding: 0px 30px 0px 30px;
  }
  .icon_issue{
    width: 45px;
    height: 46px;
    vertical-align: middle;
  }
  .issue_particulars{
    font-size: 30px;
    text-indent: 2em;
    padding: 40px 30px 75px 30px;
    color: #646464;
  }
  .certificate{
    font-weight: bold;
    padding: 20px 30px 0px 30px;
  }
  .certificate_id{
    font-size: 30px;
  }
  .input_name{
    width: 670px;
    height: 75px;
    font-size: 30px;
    text-align: right;
    margin-top: 24px;
    margin-left: 30px;
    border: none;
    border-bottom: 1px solid #dcdcdc;
    padding-right: 20px;
  }
  .input_IdNumber{
    width: 670px;
    height: 75px;
    font-size: 30px;
    text-align: right;
    margin-top: 24px;
    margin-left: 30px;
    border: none;
    border-bottom: 1px solid #dcdcdc;
    padding-right: 20px;
  }
  .bc_box{
    width: 49%;
    margin-top: 32px;
    img{
      width: 138px;
      height: 220px;
      margin-bottom: 12px;
    }
    .identiyCard{
      width: 257px;
      height: 158px;
    }
    .photo_pictures{
      width: 238px;
      height: 238px;
    }
  }
  .text_name{
    display: inline-block;
    font-size: 30px;
    color: #6d6d6d;
    margin-top: 24px;
    position: absolute;
    padding: 0px 30px 0px 30px;
  }
  .text_IdNumber{
    display: inline-block;
    font-size: 30px;
    color: #6d6d6d;
    margin-top: 24px;
    position: absolute;
    padding: 0px 30px 0px 30px;
  }
  .handld_box{
    width: 690px;
    position: relative;
  }
  .handld{
    width: 138px;
    height: 220px;
    position: absolute;
    top: 52px;
    left: 80px;
    padding: 0px 30px 0px 30px;
  }
  .text_annotation{
    font-weight: bold;
    font-size: 24px;
    position: relative;
  }
  .text_identiyCard{
    position: absolute;
    top: 304px;
    left: 462px;
    padding: 0px 30px 0px 30px;
  }
  .text_handld{
    position: absolute;
    top: 304px;
    left: 58px;
    padding: 0px 30px 0px 30px;
  }
  .dist{
    height: 105px;
  }
  .submit{
    height: 105px;
    line-height: 105px;
    text-align: center;
    font-size: 34px;
    color: #fffffd;
    /*background-color: #344a5d;*/
    position: fixed;
    bottom: 0;
    width: 100vw;
    letter-spacing: 3px;
  }
  .ok{
    background: linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.15) 100%), radial-gradient(at top center, rgba(255,255,255,0.40) 0%, rgba(0,0,0,0.40) 120%) #989898; background-blend-mode: multiply,multiply;
    img{
      width: 46px;
      vertical-align: middle;
      margin-bottom: 8px;
    }
  }
  .popup_center{
    position: relative;
    .center{
      padding: 22px;
    }
  }
</style>
