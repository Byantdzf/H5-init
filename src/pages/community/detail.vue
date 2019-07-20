<template>
  <div class="main-box">
    <div class="main-info colorff">
      <div class="info-user text-center">
        <div class="photo">
          <img :src="information.owner_photo">
        </div>
        <!--<div class="font26">{{information.owner_name}}</div>-->
      </div>
      <div class="info-user info-text">
        <div class="font28 title bold color6">
          {{information.title}}
          <!--<span class="class">交友</span>-->
        </div>
        <div class="font22 intro colorb0">{{information.intro}}
          <!--<span @click="gotoDetail(information.intro_path)" v-if="information.intro_path" style="color: orange">更多详情</span>-->
        </div>
      </div>
    </div>
    <div class="main-tab font28 color6 flo_r">
      <div class="main-num flo_l ">
        <img src="https://images.ufutx.com/201907/20/f8b7d5da439d74b54f56121eabf93246.png" alt="">
        <span class="color6">{{information.member_num}}</span>
      </div>
      <div class="main-liveness flo_l">
        <img src="https://images.ufutx.com/201907/20/47650b3808dbb44ea8cb77ac976b4ac2.png" alt="">
        <span>{{information.click_num}}</span>
      </div>
      <div class="main-liveness flo_r" @click="showComplaint = true">
        <img src="https://images.ufutx.com/201907/20/1c4416925c394e67b2a81696d3b34af7.png" alt="">
      </div>
    </div>
    <div class="main-share" @click="showShare = true">
      <img src="https://images.ufutx.com/201907/20/8e47e7087d1ecd592028786df6dbc60f.png" alt="">
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
      <div v-if="showUpload">
        <div class="applyNow theme_bc" @click="showUploadPhoto = true" v-if="information.is_applied == '0'">免费入群</div>
        <div class="applyNow theme_bc" @click="showQr = true" v-else>查看群码</div>
      </div>
      <div v-else>
        <div class="applyNow theme_bc" @click="apply" v-if="information.is_applied == '0'">免费入群</div>
        <div class="applyNow theme_bc" @click="showQr = true" v-else>查看群码</div>
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
    <moadlDown :show.sync="editComplaint" @hideModal="hideComplaint">
      <div class="main-upload color6">
        <div class="complaintText">
          <textarea v-model="complaintText" placeholder="请输入举报内容"></textarea>
        </div>
        <div class="ComplaintBtn theme_bc" @click="submitComplaint">提交</div>
        <!--<div class="getOpenid Complaint text-center" @click="getOpenid">投诉</div>-->
      </div>
    </moadlDown>
    <div v-transfer-dom>
      <group>
        <popup-picker :show.sync="showComplaint" :data="pickerList"  @on-change="onChange" ></popup-picker>
      </group>
      <previewer :list="list" ref="previewer" @on-index-change="logIndexChange"></previewer>
    </div>
  </div>
</template>
<script>
  import {$toastSuccess, $toastWarn, $loadingShow, $loadingHide} from '../../config/util'
  import {LoadMore, Previewer, TransferDom, PopupPicker, Group} from 'vux'
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
      PopupPicker,
      Group,
      LoadMore,
      moadlUp,
      Previewer,
      uploadOss,
      moadlDown
    },
    data () {
      return {
        name: '',
        complaintText: '',
        editComplaint: false,
        showUpload: false,
        copyBtn: null, // 存储初始化复制按钮事件
        card_num: '',
        information: {},
        pickerList: [['举报', '取消']],
        showShare: false,
        showQr: false,
        show: false,
        showUploadPhoto: false,
        showOpenId: false,
        showComplaint: false,
        userInfo: {},
        photo: 'http://images.ufutx.com/201907/03/0c90095f21650cacf992e1a9d4b4e982.png',
        token: localStorage.getItem('ACCESS_TOKEN'),
        official_openid: localStorage.getItem('official_openid'),
        list: []
      }
    },
    methods: {
      onChange (val) {
        console.log(val)
        if (val[0] === '举报') {
          this.editComplaint = true
        }
      },
      submitComplaint () {
        let data = {
          content: this.complaintText
        }
        this.$http.post(`/official/complaint/communities/${this.id}`, data).then(({data}) => {
          $toastSuccess('举报成功')
          this.editComplaint = false
        }).catch((error) => {
          console.log(error)
          this.editComplaint = false
        })
      },
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
      hideComplaint (value) {
        this.editComplaint = value
      },
      routeTo (name) {
        this.$router.push({name: name})
      },
      goHome () {
        this.$router.push(
          {name: 'home'})
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
          this.$router.push({name: 'register'})
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
      this.id = this.$route.params.id
      this.copyBtn = new this.$clipboard(this.$refs.copy) // 复制文本
      this.getUser()
      let openidBind = this.$route.query.openid_bind
      this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
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
  .scrollView{
    background: white !important;
  }

  .main-box {
    min-height: 100vh;
    background: white !important;
    .main-info {
      padding-top: 26px;
      overflow: hidden;
      .info-user {
        float: left;
        padding: 20px;
        padding-top: 6px;
        .class{
          padding: 2px 14px;
          background: #FBE0E9;
          color: #D82653;
          font-size: 14px;
          border-radius: 14px;
          font-weight: 400;
        }
        .photo {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          overflow: hidden;
          margin-bottom: 12px;
          img {
            width: 100%;
          }
        }
      }

      .info-text {
        width: 78%;
        margin-top: 4px;
        padding-left: 10px;
        .intro {
          margin-top: 6px;
        }
      }
    }

    .main-tab {
      overflow: hidden;
      padding: 22px 30px;
      width: 78%;
      img {
        width: 42px;
        vertical-align: middle;
        margin-top: -10px;
      }
      .main-num {
        margin-right: 28px;
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
    border-top: 1px solid #b6b6b6;

    .home_and_share {
      width: 54%;
      border: none;
      overflow: hidden;
      float: left;
    }

    .home_, .share_ {
      margin-top: 12px;
      float: left;
    }

    .home_ {
      margin-left: 88px;
    }

    .share_ {
      margin-left: 110px;
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
      width: 42%;
      float: right;
      height: 68px;
      font-size: 32px;
      line-height: 68px;
      text-align: center;
      letter-spacing: 3px;
      color: #ffffff;
      margin: 2%;
      border-radius: 12px;
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
    .complaintText{
      width: 100%;
      height: 300px;
      margin-bottom: 22px;
      textarea{
        width: 96% !important;
        height: 88% !important;
        resize:none;
        border: 1px solid #b0b0b0;
        padding: 2%;
        border-radius: 4px;
        color: #666666;
      }
    }
    .ComplaintBtn {
      width: 42%;
      height: 68px;
      font-size: 32px;
      line-height: 68px;
      text-align: center;
      letter-spacing: 3px;
      color: #ffffff;
      margin: auto;
      border-radius: 12px;
    }
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
    .Complaint{
      width: 80%;
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
