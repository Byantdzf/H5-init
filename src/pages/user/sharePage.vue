<template>
  <div class="main-box">
    <!--@click="hideModal"-->
    <div class="vessel" v-if="showModal" >
      <img src="http://images.ufutx.com/201907/09/cc558035065ad83a89bb7b5754d918c4.png" alt="" class="close" @click="hideModal">
      <div class="modal-vessel" >
        <div v-if="!showPic">
          <img src="http://images.ufutx.com/201907/09/cc698e63f0f09d189d34dc4857d50270.png"   alt="" @click.stop="showPic = true">
        </div>
        <div v-else>
          <div class="change" v-if="showPic">
            <p class="text-center colorff"><span class="bc_p">{{red_amount}}</span>  <span class="colorff">元</span></p>
            <p class="font22 colorff text-center">邀请好友，更大的红包等你抢！</p>
            <div class="text-center bc_input"><input type="number" placeholder="请输入微信绑定手机号" class="font28" v-model="mobile"/></div>
            <div class="linkbtn" @click="pullDown"></div>
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
      <img src="http://images.ufutx.com/201907/09/01648586fc59ddfd281362ac0928f68e.png" class="bc-icon flo_l">
      <img src="http://images.ufutx.com/201907/09/1c67e0b7a74a69b1e36fb1726613b543.png" class="bc-icon">
      <img src="http://images.ufutx.com/201907/09/33485eec0860efe7e14f6ea11e517f95.png" class="bc-icon flo_r">
    </div>
    <div class="main-btn text-center colorff" @click="robFn" v-if="information.is_register != 1">立 即 抢 红 包</div>
    <div class="main-btn text-center colorff" @click="showShare = true" v-else>分 享 赢 大 红 包</div>
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
  import {$loadingShow, $loadingHide, $toastWarn, $toastSuccess} from '../../../src/config/util'
  import shareModal from '../../components/shareMoadl'

  export default {
    name: 'sharePage',
    components: {shareModal},
    data () {
      return {
        groupData: [],
        information: {},
        red_amount: 0,
        showModal: false,
        mobile: '',
        showShare: false,
        showPic: false
      }
    },
    methods: {
      hideShare (value) {
        this.showShare = value
      },
      pullDown () {
        let vm = this
        if (!this.mobile) {
          this.showModal = false
          this.showPic = false
          return $toastWarn('请输入手机号')
        }
        let data = {
          from_official_openid: localStorage.getItem('from_official_openid'),
          official_openid: localStorage.getItem('official_openid'),
          red_amount: this.red_amount,
          mobile: this.mobile
        }
        vm.$http.post(`/official/wx/bind/mobile`, data).then(({data}) => {
          vm.hideModal()
          $loadingShow('疯抢中...')
          setTimeout(() => {
            $loadingHide()
            setTimeout(() => {
              $toastSuccess('领取成功')
            }, 500)
          }, 500)
        }).catch((error) => {
          vm.hideModal()
          vm.information.is_register = 1
          console.log(error)
        })
      },
      robFn () {
        let vm = this
        vm.showModal = true
        console.log('qian')
      },
      hideModal () {
        this.showModal = false
        this.showPic = false
        // this.$router.push({name: 'sharePage'})
      },
      getData () {
        let vm = this
        vm.$http.get(`/official/community/share`).then(({data}) => {
          this.groupData = data.communities
          this.red_amount = data.red_amount.toFixed(2)
          // localStorage.setItem('red_amount', this.red_amount)
          console.log(data)
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    mounted () {
      this.information.is_register = this.$route.query.is_register
      this.information.official_openid = this.$route.query.official_openid
      console.log(this.information)
      this.getData()
      let officialOpenid = localStorage.getItem('official_openid')
      let url = `http://love.ufutx.cn/wx/bind/v2?from_official_openid=${officialOpenid}`
      let pic = 'http://images.ufutx.com/201907/09/29eeb6bfe457e92d0c3624abd86d47e7.png'
      let title = `福恋红包大派送，领红包还帮身边的单身脱单！`
      let intro = `很多单身群，和热心的介绍人群，总有适合的等你进！`
      console.log(pic, url, intro, title)
      this.$shareList(pic, url, intro, title)
    }
  }
</script>

<style scoped lang="less">
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
        width: 110px;
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
    .close{
      width: 60px;
      position: absolute;
      top: 20%;
      right: 12%;
    }
    .modal-vessel {
      /*background-image: url("");*/
      /*background-size: contain;*/
      /*background-repeat: no-repeat;*/
      animation: myMove 300ms linear;
      animation-fill-mode: forwards;
      img{
        width: 100%;
      }

      .change {
        width: 136%;
        height: 60vh;
        margin-left: -16%;
        background-image: url("http://images.ufutx.com/201907/09/ee0836dd5ef5b2c7f31a103760c6c180.png");
        background-repeat: no-repeat;
        background-size: contain;
        position: relative;
        padding-top: 50%;
        .bc_p {
          font-size: 72px;
        }
        .bc_input{
          input{
            padding: 0px 6px;
            height: 60px;
            border: none;
            margin-top: 20px;
            border-radius: 8px;
          }
        }
        .linkbtn{
          width: 100%;
          height: 60px;
          /*background: red;*/
          margin-top: 40px;
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
          margin: 69% auto;
        }
      }
    }
  }
</style>
