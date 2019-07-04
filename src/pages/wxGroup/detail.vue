<template>
  <div class="main-box">
    <div class="main-info colorff">
      <div class="info-user text-center">
        <div class="photo">
          <img :src="information.owner_photo">
        </div>
        <div class="font26">{{information.owner_name}}</div>
      </div>
      <div class="info-user info-text">
        <div class="font28 title bold" style="color: red">{{information.title}}</div>
        <div class="font22 intro">{{information.intro}} <span @click="gotoDetail(information.intro_path)" v-if="information.intro_path" style="color: orange">更多详情</span></div>
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
      <img src="http://images.ufutx.com/201907/01/f81de887ad948f0769e1175c9bcd5716.png" alt="">
    </div>
    <shareModal :show.sync="showShare" @hideModal="hideShare"></shareModal>
    <LoadMore tip="群成员" :show-loading="false"></LoadMore>
    <div class="main-otherUser">
      <div class="item-photo" v-for="item,index in information.members" v-if="item.photo">
        <div class="img" v-bind:style="{backgroundImage:'url(' + item.photo + ')'}"></div>
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
      <div v-if="showUpload && token">
        <div class="applyNow" @click="showUploadPhoto = true" v-if="information.is_applied == '0'">免费入群</div>
        <div class="applyNow" @click="showQr = true" v-else>查看群码</div>
      </div>
      <div v-else>
        <div class="applyNow" @click="apply" v-if="information.is_applied == '0'">免费入群</div>
        <div class="applyNow" @click="showQr = true" v-else>查看群码</div>
      </div>
    </div>
    <moadlUp :show.sync="showQr" @hideModal="hideQr">
      <div class="main-qr">
        <img :src="information.qrcode" alt="" @click="showImage">
        <div class="text text-left">群主微信：
          <input type="text" id="success_form_input" readonly="readonly" v-model="information.owner_wechat"/>
          <button  id="copy" ref="copy" @click="copyLink" data-clipboard-action="copy" data-clipboard-target="#success_form_input">
            <img src="http://images.ufutx.com/201907/03/b1f746f48da868f953fba244df8ff9be.png" alt="">
          </button>
        </div>
        <div class="text-center font22 color6">
          <img src="http://images.ufutx.com/201907/04/0eaf2cfa1d2dcb3ac25f20ad1117d52d.png" alt="" class="qrImage">
          长按识别二维码
        </div>
      </div>
    </moadlUp>
    <moadlDown :show.sync="showUploadPhoto" @hideModal="hideUploadPhoto">
      <div class="main-upload color6">
        <div class="bold">温馨提示：</div>
        <div class="text">系统检测到你尚未上传头像,请先上传头像！</div>
        <div class="text-center upload">
          <uploadOss @onSuccess="onSuccess"></uploadOss>
          <img :src="photo" alt="" @click="showImage">
        </div>
        <div class="save text-center" @click="save">确定</div>
      </div>
    </moadlDown>
    <moadlDown :show.sync="showOpenId" @hideModal="hideOppenId">
      <div class="main-upload color6">
        <div class="bold font30">温馨提示：</div>
        <div class="text font28">系统未获取到您的信息,将无法给你红包！</div>
        <div class="getOpenid text-center" @click="getOpenid">获取红包资格</div>
      </div>
    </moadlDown>
    <div v-transfer-dom>
      <previewer :list="list" ref="previewer" @on-index-change="logIndexChange"></previewer>
    </div>
  </div>
</template>
<script>
  import {$toastSuccess, $toastWarn, $loadingShow, $loadingHide} from '../../config/util'
  import {LoadMore, Previewer, TransferDom} from 'vux'
  import shareModal from '../../components/shareMoadl'
  import moadlUp from '../../components/moadlUp'
  import moadlDown from '../../components/moadlDown'
  import uploadOss from '../../components/upload_oss'

  export default {
    name: 'authentication',
    directives: {
      TransferDom
    },
    components: {
      shareModal,
      LoadMore,
      moadlUp,
      Previewer,
      uploadOss,
      moadlDown
    },
    data () {
      return {
        name: '',
        showUpload: false,
        copyBtn: null, // 存储初始化复制按钮事件
        card_num: '',
        information: {},
        showShare: false,
        showQr: false,
        show: false,
        showUploadPhoto: false,
        showOpenId: false,
        photo: 'http://images.ufutx.com/201907/03/0c90095f21650cacf992e1a9d4b4e982.png',
        token: localStorage.getItem('ACCESS_TOKEN'),
        official_openid: localStorage.getItem('official_openid'),
        list: []
      }
    },
    methods: {
      copyLink () {  // 复制
        let _this = this
        let clipboard = _this.copyBtn
        clipboard.on('success', function () {
          _this.showQr = false
          setTimeout(() => {
            $toastSuccess('复制成功')
          }, 500)
        })
        clipboard.on('error', function () {
          _this.showQr = false
          setTimeout(() => {
            $toastWarn('复制失败，请手动选择复制！')
          }, 500)
        })
      },
      onSuccess (val) {
        this.photo = val
      },
      gotoDetail (url) {
        window.location.href = url
      },
      getOpenid () {
        if (this.$isWeiXin() === true) {
          this.showOpenid = false
          if (localStorage.getItem('mobile') && localStorage.getItem('mobile') !== null) {
            window.location.href = 'https://love.ufutx.com/wx/bind?mobile=' + localStorage.getItem('mobile') + `&type=community&id=${this.id}`
          } else {
            window.location.href = `https://love.ufutx.com/wx/bind?type=community&id=${this.id}`
          }
        }
      },
      save () {
        this.showUploadPhoto = false
        let data = {
          photo: this.photo
        }
        this.$http.put('/official/users/photo', data).then(({data}) => {
          let userInfo = JSON.parse(localStorage.getItem('userInfo'))
          userInfo.photo = this.photo
          localStorage.setItem('userInfo', JSON.stringify(userInfo))
          this.apply()
        }).catch((error) => {
          console.log(error)
        })
      },
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
      hideUploadPhoto (value) {
        this.showUploadPhoto = value
      },
      hideOppenId (value) {
        this.showOpenId = value
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
      this.copyBtn = new this.$clipboard(this.$refs.copy) // 复制文本
      this.getUser()
      let url = ''
      let titleV = this.$route.query.title ? this.$route.query.title : '福恋群'
      let icon = this.$route.query.icon ? this.$route.query.title : 'https://images.ufutx.com/201904/19/80a9db83c65a7c81d95e940ef8a2fd0e.png'
      let openidBind = this.$route.query.openid_bind
      let userInfo = JSON.parse(localStorage.getItem('userInfo'))
      if (!localStorage.getItem('userInfo') || localStorage.getItem('userInfo') === null) {
        url = location.href.split('?')[0]
      } else {
        url = location.href.split('?')[0] + '?from_user_id=' + userInfo.id + `&community_share=1`
      }
      console.log(titleV)
      url = `https://love.ufutx.com/wx/bind?type=community&id=${this.id}&community_share=1`
      let pic = userInfo.photo ? userInfo.photo : icon
      let title = userInfo.name ? userInfo.name : `福恋交友平台`
      let intro = userInfo.name ? `${userInfo.name}邀请你加入《${titleV}》` : `邀请你加入《${titleV}》`
      this.$shareList(pic, url, intro, title)
      if (userInfo) {
        let {photo} = userInfo
        if (!photo) {
          this.showUpload = true
        }
      }
      if (this.$isWeiXin() === true) {
        if (!this.official_openid || this.official_openid === 'undefined' || this.official_openid === 'null') {
          if (openidBind) {
            this.showOpenId = false
          } else {
            this.showOpenId = true
          }
        }
      }
    }
  }
</script>
<style scoped lang="less">
  body {
    background: white
  }

  .main-box {
    .main-info {
      background: black;
      padding-top: 22px;
      overflow: hidden;

      .info-user {
        float: left;
        padding: 20px;
        padding-top: 6px;
        .photo {
          width: 150px;
          height: 150px;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 12px;

          img {
            width: 100%;
          }
        }
      }

      .info-text {
        width: 58%;
        margin-top: 4px;
        padding-left: 10px;
        .intro {
          margin-top: 6px;
        }
      }
    }

    .main-tab {
      overflow: hidden;
      padding: 26px 40px;
      border-bottom: 10px solid #f6f6f6;

      img {
        width: 26px;
        vertical-align: middle;
        margin-top: -10px;
      }

      .main-num {
      }

      .main-liveness {
      }
    }

    .main-share {
      img {
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

  .main-otherUser {
    margin-top: -32px;
    overflow: hidden;
    padding-left: 30px;

    .item-photo {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: inline-flex;
      overflow: hidden;
      margin-right: 20px;
      margin-bottom: 20px;
      .img {
        width: 100%;
        background-repeat: no-repeat;
        background-size: cover;
      }
    }
  }

  .main-qr {
    width: 86%;
    margin: auto;
    background: white;
    margin-top: 32px;
    border-radius: 12px;
    padding: 22px;

    img {
      width: 100%;
      border-radius: 6px;
    }

    .text {
      padding: 22px;
    }
  }

  .main-upload {
    width: 86%;
    margin: auto;
    background: white;
    margin-bottom: 10%;
    border-radius: 12px;
    padding: 32px 26px 26px 22px;

    .text {
      padding: 22px 0;
    }

    .upload {
      margin: 32px 0;
      position: relative;

      img {
        width: 200px;
      }
    }

    .save,.getOpenid {
      width: 120px;
      margin: 32px auto;
      padding: 12px;
      border-bottom: 2px solid red;
    }
    .getOpenid{
      width: 220px;
    }
  }
  #success_form_input{
    border: none;
    max-width: 120px;
    background: #ffffff;
  }
  #copy{
    background: none;
    border: none;
    img{
      width: 46px;
      vertical-align: middle;
      margin-bottom: 6px;
    }
  }
  .qrImage{
    width: 26px !important;
    vertical-align: middle;
    margin-bottom: 4px;
  }
</style>
