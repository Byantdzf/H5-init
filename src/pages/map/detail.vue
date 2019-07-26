<template>
  <div class="main-box">
    <div class="main-bc"></div>
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
        userInfo: {},
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
            window.location.href = 'https://love.ufutx.com/wx/bind?mobile=' + localStorage.getItem('mobile') + `&type=community&id=${this.id}&from_user_id=${this.userInfo ? this.userInfo.id : ''}`
          } else {
            window.location.href = `https://love.ufutx.com/wx/bind?type=community&id=${this.id}&from_user_id=${this.userInfo ? this.userInfo.id : ''}`
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
        if (localStorage.getItem('paasName')) {
          this.$router.push({name: 'home'})
        } else {
          this.$router.push({name: 'communityHome'})
        }
      },
      getUser () {
        this.$http.get(`/official/communities/${this.id}`).then(({data}) => {
          this.information = data
          let officialOpenid = localStorage.getItem('official_openid')
          let url = `https://love.ufutx.com/wx/bind?type=community&id=${this.id}&community_share=1&from_user_id=${this.userInfo ? this.userInfo.id : ''}&from_official_openid=${officialOpenid}`
          let pic = this.userInfo ? this.userInfo.photo : data.logo
          let title = this.userInfo ? `${this.userInfo.name}邀请你加入《${data.title}》` : `邀请你加入《${data.title}》`
          let intro = data.intro
          console.log(pic, url, intro, title)
          this.$shareList(pic, url, intro, title)
          this.list.push({src: data.qrcode})
          if (this.$isWeiXin()) {
            if (!data.user.official_openid || data.user.official_openid === null) {
              this.$router.push({name: 'user'})
            }
          }
          localStorage.setItem('official_openid', data.official_openid)
          if (data.is_photo === 0) {
            this.showUpload = true
          } else {
            this.showUpload = false
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      apply () {
        if (!this.token) {
          localStorage.setItem('jump', window.location.href)
          this.$router.push({name: 'login'})
          return
        }
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
      // this.id = this.$route.params.id
      // this.copyBtn = new this.$clipboard(this.$refs.copy) // 复制文本
      // this.getUser()
      // let openidBind = this.$route.query.openid_bind
      // this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
      // if (this.$isWeiXin() === true) {
      //   if (!this.official_openid || this.official_openid === 'undefined' || this.official_openid === 'null') {
      //     if (openidBind) {
      //       this.showOpenId = false
      //     } else {
      //       this.showOpenId = true
      //     }
      //   }
      // }
    }
  }
</script>
<style scoped lang="less">
  body {
    background: white
  }
  .main-bc{
    width: 100vw;
    height: 100vh;
    background-image: url("https://images.ufutx.com/201907/20/272332f5d3cfb945f38b9d35bd0f43af.jpeg");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
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
      /*background-color: #344a5d;*/
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
