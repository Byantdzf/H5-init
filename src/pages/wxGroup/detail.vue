<template>
  <div class="main-box">
    <div class="main-info colorff">
      <div class="info-user text-center">
        <div class="photo">
          <img :src="information.owner_photo" >
        </div>
        <div class="font26">群主：{{information.owner_name}}</div>
      </div>
      <div class="info-user info-text">
        <div class="font28 title">{{information.titile}}</div>
        <div class="font22 intro">{{information.intro}}</div>
      </div>
    </div>
    <div class="main-tab font28 color6">
      <div class="main-num flo_l ">
        <img src="http://images.ufutx.com/201907/01/120eda453c66a88dde9aa788728fe4fe.png" alt="">
        入群会员：<span class="colorb0">{{information.member_num}}</span>
      </div>
      <div class="main-liveness flo_r">
        <img src="http://images.ufutx.com/201907/01/b983c0cdce59780b8151685a7b718055.png" alt="">
        <span>{{information.click_num}}</span>
      </div>
    </div>
    <div class="main-share" @click="showShare = true">
      <img src="http://images.ufutx.com/201907/01/f81de887ad948f0769e1175c9bcd5716.png" alt="" >
    </div>
    <shareModal :show.sync="showShare" @hideModal="hideShare"></shareModal>
    <LoadMore tip="群成员" :show-loading="false"></LoadMore>
    <div class="main-otherUser">
      <div class="item-photo" v-for="item,index in information.members">
        <img :src="item.photo" >
      </div>
    </div>
    <div class="box_bottom">
      <div class="home_and_share">
        <div class="home_" @click="goHome">
          <img class="icon_home" src="https://images.ufutx.com/201904/02/c2a2e6539c0aba992088b1b51a54a18b.png" alt="">
          <p class="home">首页</p>
        </div>
        <div class="share_" @click="showShare = true">
          <img class="icon_share" src="https://images.ufutx.com/201904/02/7b1981496eb2cd024c3830a018c4c89e.png" alt="">
          <p class="share">分享</p>
        </div>
      </div>
      <div class="applyNow" @click="apply" v-if="information.is_applied == '0'">免费入群</div>
      <div class="applyNow" @click="showQr = true" v-else>查看群码</div>
    </div>
    <moadlUp :show.sync="showQr" @hideModal="hideQr">
      <div class="main-qr">
        <img :src="information.qrcode" alt="" @click="showImage">
        <div class="text text-center">群主微信：{{information.owner_wechat}}</div>
      </div>
    </moadlUp>
    <div v-transfer-dom>
      <previewer :list="list" ref="previewer"  @on-index-change="logIndexChange"></previewer>
    </div>
  </div>
</template>
<script>
  import {$loadingShow, $loadingHide} from '../../config/util'
  import {LoadMore, Previewer, TransferDom} from 'vux'
  import shareModal from '../../components/shareMoadl'
  import moadlUp from '../../components/moadlUp'

  export default {
    name: 'authentication',
    directives: {
      TransferDom
    },
    components: {
      shareModal,
      LoadMore,
      moadlUp,
      Previewer
    },
    data () {
      return {
        name: '',
        card_num: '',
        information: {},
        showShare: false,
        showQr: false,
        show: false,
        list: []
      }
    },
    methods: {
      showImage () {
        this.showQr = false
        this.$refs.previewer.show(0)
      },
      logIndexChange (arg) {
        console.log(arg)
      },
      hideShare (value) {
        this.showShare = value
      },
      hideQr (value) {
        this.showQr = value
      },
      routeTo (name) {
        this.$router.push({name: name})
      },
      goHome () {
        this.$router.push({name: 'home'})
      },
      getUser () {
        this.$http.get(`/official/communities/${this.id}`).then(({data}) => {
          this.information = data
          this.list.push(
            {
              src: data.qrcode
            }
          )
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
      apply () {
        $loadingShow('加载中...')
        // if (localStorage.getItem('official_openid') && localStorage.getItem('official_openid') !== null) {
        this.$http.post(`/official/apply/communities/${this.id}`).then(({data}) => {
          $loadingHide()
          this.getUser()
          this.showQr = true
        }).catch((error) => {
          console.log(error)
          this.getUser()
        })
        // } else {
        //   $loadingHide()
        //   window.location.href = 'https://love.ufutx.com/wx/bind?mobile=' + localStorage.getItem('mobile') + '&type=communities'
        // }
      }
    },
    mounted () {
      this.id = this.$route.params.id
      this.getUser()
      let url = ''
      if (!localStorage.getItem('userInfo') || localStorage.getItem('userInfo') === null) {
        url = location.href
      } else {
        let userInfo = JSON.parse(localStorage.getItem('userInfo'))
        if (location.href.includes('?')) {
          url = location.href + '&from_user_id=' + userInfo.id + `&community_share=1`
        } else {
          url = location.href + '?from_user_id=' + userInfo.id + `&community_share=1`
        }
      }
      if (localStorage.getItem('paasTitle')) {
        this.$shareList(localStorage.getItem('logo'), url, localStorage.getItem('paasTitle'), localStorage.getItem('paasIntro'))
        document.title = localStorage.getItem('paasTitle')
      } else {
        this.$shareList('https://images.ufutx.com/201904/19/80a9db83c65a7c81d95e940ef8a2fd0e.png', url, '智能共享平台', '福恋家庭幸福平台')
        document.title = '福恋家庭幸福平台'
      }
    }
  }
</script>
<style scoped lang="less">
  body{background: white}
  .main-box{
    .main-info{
      background: black;
      padding-top: 22px;
      overflow: hidden;
      .info-user{
        float: left;
        padding: 20px;
        .photo{
          width: 150px;
          height: 150px;
          border-radius: 50%;
          overflow: hidden;
          margin-bottom: 12px;
          img{
            width: 100%;
          }
        }
      }
      .info-text{
        width: 68%;
        margin-top: 12px;
        padding-left: 10px;
        .title{}
        .intro{
          margin-top: 16px;
        }
      }
    }
    .main-tab{
      overflow: hidden;
      padding: 26px 40px;
      border-bottom: 10px solid #f6f6f6;
      img{
        width: 26px;
        vertical-align: middle;
        margin-top: -10px;
      }
      .main-num{}
      .main-liveness{}
    }
    .main-share{
      img{
        width: 100%;
      }
    }
  }
  .box_bottom {
    overflow: hidden;
    position: fixed;
    bottom: 0;
    background: #ffffff;
    width: 100%;

    .home_and_share {
      width: 36%;
      border: none;
      border-top: 1px solid #b6b6b6;
      overflow: hidden;
      float: left;
    }

    .home_, .share_ {
      margin-top: 12px;
      float: left;
    }

    .home_ {
      margin-left: 50px;
    }

    .share_ {
      margin-left: 64px;
    }

    /*首页图片*/
    .icon_home {
      width: 42px;
      height: 42px;
      vertical-align: middle;
    }

    /*分享图片*/
    .icon_share {
      width: 42px;
      height: 42px;
      vertical-align: middle;
    }

    /*分享text*/
    .home, .share {
      font-size: 20px;
      color: #8e8e8e;
      letter-spacing: 2px;
      margin-left: -2px;
      margin-top: 6px;
    }

    /*立即报名*/
    .applyNow {
      width: 100-36%;
      height: 105px;
      font-size: 32px;
      background-color: #344a5d;
      line-height: 105px;
      text-align: center;
      letter-spacing: 3px;
      color: #ffffff;
      float: right;
    }

    .height105 {
      height: 105px;
    }
  }
  .main-otherUser{
    margin-top: -32px;
    overflow: hidden;
    padding-left: 30px;
    .item-photo{
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: inline-flex;
      overflow: hidden;
      margin-right: 20px;
      margin-bottom: 20px;
      img{
        width: 100%;
      }
    }
  }
  .main-qr{
    width: 86%;
    margin: auto;
    background: white;
    margin-top: 32px;
    border-radius: 12px;
    padding: 22px;
    img{
      width: 100%;
      border-radius: 6px;
    }
    .text{
      padding: 22px;
    }
  }
</style>
