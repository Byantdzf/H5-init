<template>
  <div class="main-box">
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" class="scrollView">
      <div class="main-input">
        <input type="text" placeholder="搜索感兴趣的话题" v-model="search" @change="searchUser" @keyup.enter="searchUser"/>
      </div>
      <div class="main-info colorff">
        <div class="info-user text-center">
          <div class="photo" @click="gotoDetail(information.user_id)">
            <img :src="information.logo">
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
      <div class="main-share" @click="gotoLink(information.poster_path)">
        <img :src="information.poster" alt="">
      </div>
      <shareModal :show.sync="showShare" @hideModal="hideShare"></shareModal>
      <!--<div v-if="information.members.length > 0">-->
        <LoadMore tip="群成员" :show-loading="false"></LoadMore>
        <div class="main-otherUser">
          <div class="item-photo" v-for="item,index in information.members" v-if="item.photo" @click="gotoDetail(item.user_id)">
            <div class="img" v-bind:style="{backgroundImage:'url(' + item.photo + ')'}"></div>
          </div>
          <div class="main-listV" v-if="information.members&& information.members.length < 1">
            <div class="item font26 colorb0">暂无成员加入</div>
          </div>
        <!--</div>-->
        </div>
      <div class="communityTitle text-center color6" v-if="list.length > 0">群动态</div>
      <communityCircle :list.sync="list"></communityCircle>
      <div class="height160"></div>
      <div class="box_bottom ff">
        <div class="home_and_share ff">
          <div class="home_ text-center" @click="goHome">
            <img class="icon_home" src="https://images.ufutx.com/201907/23/89fdc039b0f305190a806b0da4323919.png" alt="">
            <p class="home">首页</p>
          </div>
          <div class="share_ text-center" @click="goCreate">
            <img class="icon_share" src="https://images.ufutx.com/201907/25/a18656b27b60619b9bc5d3cb67824806.png" alt="">
            <p class="share">新建社群</p>
          </div>
        </div>
        <div v-if="token">
          <div v-if="showUpload">
            <div class="applyNow theme_bc" @click="showUploadPhoto = true" v-if="information.is_applied == '0'">免费入群</div>
            <div class="applyNow theme_bc" @click="showQr = true" v-else>查看群码</div>
          </div>
          <div v-else>
            <div class="applyNow theme_bc" @click="apply" v-if="information.is_applied == '0'">免费入群</div>
            <div class="applyNow theme_bc" @click="showQr = true" v-else>查看群码</div>
          </div>
        </div>
        <div v-else>
          <!--<div class="applyNow theme_bc" @click="apply" v-if="information.is_applied == '0'">免费入群</div>-->
          <div class="applyNow theme_bc" @click="showQr = true" >查看群码</div>
        </div>
      </div>
      <moadlUp :show.sync="showQr" @hideModal="hideQr">
        <div class="main-qr">
          <!--@click="showImage" //预览-->
          <div class="main-tabQr font28">
            <span class="community flo_r" :class="qrType === 'community'?'active':''" @click="qrType = 'community'">群二维码</span>
            <span class="userQr flo_l" :class="qrType === 'userQr'?'active':''" @click="qrType = 'userQr'">群主二维码</span>
          </div>
          <div v-if="qrType === 'community'">
            <img :src="information.qrcode" alt="" />
            <div class="text-center font22 color6" style="margin-top: 12px;">
              <img src="http://images.ufutx.com/201907/04/0eaf2cfa1d2dcb3ac25f20ad1117d52d.png" alt="" class="qrImage">
              长按识别二维码
            </div>
          </div>
          <div v-else>
            <img :src="information.wechat_qrcode" alt="" v-if="information.wechat_qrcode"/>
            <div class="text text-center font28" v-else>群主微信：
              <input type="text" id="success_form_input" readonly="readonly" v-model="information.owner_wechat"/>
              <button  id="copy" ref="copy" @click="copyLink" data-clipboard-action="copy" data-clipboard-target="#success_form_input">
                <img src="http://images.ufutx.com/201907/03/b1f746f48da868f953fba244df8ff9be.png" alt="">
              </button>
            </div>
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
      <group>
        <popup-picker :show.sync="showComplaint" :show-cell="false" :data="pickerList" @on-change="onChange" ></popup-picker>
      </group>
      <div v-transfer-dom>
        <previewer :list="imagelist" ref="previewer" @on-index-change="logIndexChange"></previewer>
      </div>
      <div class="addition" @click="$router.push({name: 'communityCircleEdit',params: {id: id}})" v-if="information.is_applied != 0">
        <img src="https://images.ufutx.com/201907/20/6e0bb82048c9ab0b1833d28aa83c6d7f.png" alt="">
      </div>
    </mescroll-vue>
  </div>
</template>
<script>
  import {$toastSuccess, $toastWarn, $loadingShow, $loadingHide} from '../../config/util'
  import {LoadMore, Previewer, TransferDom, PopupPicker, Group} from 'vux'
  import shareModal from '../../components/shareMoadl'
  import moadlUp from '../../components/moadlUp'
  import moadlDown from '../../components/moadlDown'
  import uploadOss from '../../components/upload_oss'
  import MescrollVue from 'mescroll.js/mescroll.vue'
  import communityCircle from '../../components/communityCircle'

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
      MescrollVue,
      uploadOss,
      moadlDown,
      communityCircle
    },
    data () {
      return {
        name: '',
        search: '',
        complaintText: '',
        editComplaint: false,
        qrType: 'userQr',
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
        list: [],
        imagelist: [],
        mescroll: null, //  mescroll实例对象
        mescrollDown: {}, // 下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
        mescrollUp: { // 上拉加载的配置.
          callback: this.getOrderList, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
          // 以下是一些常用的配置,当然不写也可以的.
          page: {
            num: 0, // 当前页 默认0,回调之前会加1; 即callback(page)会从1开始
            size: 15 // 每页数据条数,默认10
          },
          // toTop: {
          //   // 回到顶部按钮
          //   src: "http://images.ufutx.com/201906/27/1380d8f68a7f81f3a08a92a84cab4c0e.png", // 图片路径,默认null,支持网络图
          //   offset: 1000 // 列表滚动1000px才显示回到顶部按钮
          // },
          htmlLoading: '<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip">加载中..</p>', // 上拉加载中的布局
          htmlNodata: '<p class="upwarp-nodata" style="margin-bottom: 16vw;">-- 加载完毕 --</p>' // 无数据的布局
        }
      }
    },
    methods: {
      searchUser () { // 输入框搜索
        this.list = []
        console.log(this.search)
        this.getOrderList({num: 1})
      },
      mescrollInit (mescroll) {
        this.mescroll = mescroll
      },
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
      gotoDetail (id) {
        if (!id) return
        this.$router.push({
          name: 'userCommunityClass',
          params: {id: id}
        })
      },
      gotoLink (link) {
        window.location.href = link
      },
      getOpenid () {
        if (this.$isWeiXin() === true) {
          this.showOpenid = false
          let paas = localStorage.getItem('paasName')
          if (localStorage.getItem('mobile') && localStorage.getItem('mobile') !== null) {
            window.location.href = 'https://love.ufutx.com/wx/bind?mobile=' + localStorage.getItem('mobile') + `&paas=${paas}&type=community&id=${this.id}&from_user_id=${this.userInfo ? this.userInfo.id : ''}`
          } else {
            window.location.href = `https://love.ufutx.com/wx/bind?type=community&paas=${paas}&id=${this.id}&from_user_id=${this.userInfo ? this.userInfo.id : ''}`
          }
        }
      },
      save () {
        $loadingShow('识别中...')
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
      routeToDetail (type, id) { // 跳转
        if (this.information.is_applied === 1) {
          if (type === 'marriage') {
            this.$router.push({name: 'introducer', params: {id: id}})
          } else {
            this.$router.push({name: 'information', params: {id: id}})
          }
        } else {
          $toastWarn('请先加入群！')
        }
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
        if (localStorage.getItem('paasName') !== 'FL' && localStorage.getItem('paasName')) {
          this.$router.push({name: 'home'})
        } else {
          this.$router.push({name: 'communityHome'})
        }
      },
      goCreate () {
        this.$router.push({
          name: 'createCommunity',
          params: {id: 0}
        })
      },
      getOrderList (page, mescroll) { // 获取数据
        $loadingShow('加载中...')
        let pageV = 1
        pageV = page.num
        if (!page.num) {
          pageV = 1
        }
        let vm = this
        vm.$http.get(`/official/communities/${this.id}/moments?page=${pageV}&keyword=${vm.search}`).then(({data}) => {
          let dataV = pageV === 1 ? [] : vm.list
          dataV.push(...data.community_moments.data)
          vm.list = dataV
          if (mescroll) {
            vm.$nextTick(() => {
              mescroll.endSuccess(data.community_moments.data.length)
            })
          }
          if (vm.list.length > 0) {
            vm.list.forEach((item, index) => {
              let photoList = []
              for (let rect of item.photos) {
                if (index < 3) {
                  photoList.push({
                    pic: rect,
                    show: true
                  })
                } else {
                  photoList.push({
                    pic: rect,
                    show: false
                  })
                }
              }
              item.photoList = photoList
            })
          }
          console.log(vm.list)
          // if (vm.list.length < 1) $toastText('很抱歉！暂时没有搜索到对象')
          $loadingHide()
        }).catch((error) => {
          console.log(error)
          $loadingHide()
        })
      },
      getUser () {
        this.$http.get(`/official/communities/${this.id}`).then(({data}) => {
          localStorage.setItem('avatar', data.avatar)
          localStorage.setItem('nickname', data.nickname)
          this.information = data
          let officialOpenid = localStorage.getItem('official_openid')
          let paas = localStorage.getItem('paasName')
          let url = `https://love.ufutx.com/wx/bind?type=community&paas=${paas}&id=${this.id}&community_share=1&from_user_id=${this.userInfo ? this.userInfo.id : ''}&from_official_openid=${officialOpenid}`
          let pic = this.userInfo ? this.userInfo.photo : data.logo
          let title = this.userInfo ? `${this.userInfo.name}邀请你加入《${data.title}》` : `邀请你加入《${data.title}》`
          let intro = data.intro
          console.log(pic, url, intro, title)
          this.$shareList(pic, url, intro, title)
          this.imagelist.push({src: data.qrcode})
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
      this.id = this.$route.params.id
      // this.copyBtn = new this.$clipboard(this.$refs.copy) // 复制文本
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
  .main-listV {
    text-align: center;
    width: 96%;
    .item {
      padding: 10px 18px;
      background: #f1f1f1;
      display: inline-block;
      margin-right: 16px;
      margin-top: 12px;
      border-radius: 6px;
    }
  }
  .communityTitle{
    padding: 22px 0;
    border-bottom: 14px solid #f6f6f6;
    border-top: 14px solid #f6f6f6;
    margin-top: 22px;
  }
  .addition{
    position: fixed;
    right: 68px;
    bottom: 14%;
    width: 100px;
    height: 100px;
    img{
      width: 100%;
      height: 100%;
      box-shadow: 0 0 18px #D92553;
      border-radius: 50%;
    }
  }
  .main-input{
    width: 86vw;
    background: #EBEAEA;
    margin: 28px auto;
    padding: 0 12px;
    border-radius: 12px;
    padding-left: 48px;
    position: relative;
    &:after{
      content: '';
      width: 42px;
      height: 42px;
      position: absolute;
      left: 6px;
      top: 10px;
      background-image: url("https://images.ufutx.com/201907/20/de514ca726d16a399ab2a10f426929b2.png");
      background-size: contain;
      background-repeat: no-repeat;
    }
    ::-webkit-input-placeholder {
      color: #b0b0b0;
    }
    ::-moz-placeholder {
      color: #b0b0b0;
    }
    :-ms-input-placeholder {
      color: #b0b0b0;
    }
    input{
      background: none;
      border: none;
      width: 100%;
      height: 62px;
      padding-top: 2px;
    }
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
      margin-left: -4px;
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
    .main-tabQr{
      width: 390px;
      /*background: red;*/
      margin: auto;
      overflow: hidden;
      border-radius: 32px;
      border: 1px solid #d6d6d6;
      margin-bottom: 16px;
      .community,.userQr{
        width: 160px;
        padding: 10px 16px;
        text-align: center;
      }
      .userQr{}
      .active{
        background: #d6d6d6;
      }
    }

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
      width: 230px;
      margin: 32px auto;
      padding: 12px;
      /*border-bottom: 2px solid red;*/
      background: #D92553;
      color: white;
      border-radius: 12px;
    }
    .getOpenid{
      width: 260px;
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
