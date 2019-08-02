<template>
  <div class="main-box">
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" class="scrollView">
      <div class="text-center main-search" @click="showSearchType = true">
        <div class="font32 color6">
          全部
          <img src="http://images.ufutx.com/201906/27/16c7dfb515bf50f00bc931d11d7f04a9.png" class="icon-down" alt="">
        </div>
        <img src="http://images.ufutx.com/201906/27/1380d8f68a7f81f3a08a92a84cab4c0e.png" class="flo_r friendEdit" alt="">
      </div>
      <div v-for="item,index in list" :key="index">
        <div class="main-info colorff">
          <div class="info-user text-center">
            <div class="photo" @click="gotoDetail(information.user_id)">
              <img :src="information.logo">
            </div>
          </div>
          <div class="info-user info-text">
            <div class="font28 title bold color6">
              {{information.title}}
              <span class="class">交友</span>
            </div>
            <div class="font22 intro colorb0">{{information.intro}}</div>
          </div>
        </div>
        <div class="main-tab font28 color6 flo_r">
          <div class="main-num flo_l ">
            <img src="http://images.ufutx.com/201906/27/f0a175c90a1b14211980298c615a36bc.png" alt="">
            <span class="color6">{{information.member_num}}21</span>
          </div>
          <div class="main-liveness flo_l">
            <img src="http://images.ufutx.com/201906/27/936c4a5f817035d69b1e2380894204cd.png" alt="">
            <span>{{information.click_num}}12</span>
          </div>
          <div class="main-liveness flo_r" @click="showComplaint = true">
            <img src="https://images.ufutx.com/201907/20/1c4416925c394e67b2a81696d3b34af7.png" alt="">
          </div>
        </div>
      </div>
    </mescroll-vue>
    <!--<shareModal :show.sync="showShare" @hideModal="hideShare"></shareModal>-->
    <!--<LoadMore tip="群成员" :show-loading="false"></LoadMore>-->
    <group>
      <popup-picker :show.sync="showComplaint" :show-cell="false" :data="pickerList" @on-change="onChange" ></popup-picker>
      <popup-picker :show.sync="showSearchType" :show-cell="false" :data="SearchType" @on-change="onChange" ></popup-picker>
    </group>
    <div v-transfer-dom>
      <previewer :list="list" ref="previewer" @on-index-change="logIndexChange"></previewer>
    </div>
  </div>
</template>
<script>
  import {$toastSuccess, $toastWarn, $loadingShow} from '../../config/util'
  import {LoadMore, Previewer, TransferDom, PopupPicker, Group} from 'vux'
  import shareModal from '../../components/shareMoadl'
  import moadlUp from '../../components/moadlUp'
  import moadlDown from '../../components/moadlDown'
  import uploadOss from '../../components/upload_oss'
  import MescrollVue from 'mescroll.js/mescroll.vue'

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
      moadlDown,
      MescrollVue
    },
    data () {
      return {
        name: '',
        complaintText: '',
        editComplaint: false,
        qrType: 'community',
        showUpload: false,
        copyBtn: null, // 存储初始化复制按钮事件
        card_num: '',
        information: {},
        pickerList: [['举报', '取消']],
        showComplaint: false,
        showSearchType: false,
        SearchType: [['查看全部', '只看单身男', '只看单身女', '只看介绍人']],
        userInfo: {},
        photoList: [
          'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2865672302,4153895132&fm=200&gp=0.jpg',
          'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2712105594,1652249053&fm=200&gp=0.jpg',
          'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1511461500,2536850263&fm=200&gp=0.jpg',
          'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=697729144,1502048920&fm=200&gp=0.jpg',
          'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2112797303,2959648216&fm=26&gp=0.jpg'
        ],
        mescroll: null, //  mescroll实例对象
        mescrollDown: {}, // 下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
        mescrollUp: { // 上拉加载的配置.
          callback: this.initPageData, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
          // 以下是一些常用的配置,当然不写也可以的.
          page: {
            num: 0, // 当前页 默认0,回调之前会加1; 即callback(page)会从1开始
            size: 15 // 每页数据条数,默认10
          },
          htmlLoading: '<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip">加载中..</p>', // 上拉加载中的布局
          htmlNodata: '<p class="upwarp-nodata">-- 加载完毕 --</p>' // 无数据的布局
        },
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
      mescrollInit (mescroll) {
        this.mescroll = mescroll
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
      initPageData (page, mescroll) {
        let pageV = 1
        pageV = page.num
        if (!page.num) {
          pageV = 1
        }
        let vm = this
        vm.$http.get(`/moments?page=${pageV}`).then(({data}) => {
          let dataV = page.num === 1 ? [] : vm.list
          dataV.push(...data.data)
          vm.list = dataV
          if (mescroll) {
            vm.$nextTick(() => {
              mescroll.endSuccess(data.data.length)
            })
          }
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    mounted () {
      this.id = this.$route.params.id
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
    position: relative;
    .main-search{
      padding: 32px 12px;
      border-bottom: 12px solid #F7F7F7;
      .friendEdit{
        width: 52px;
        position: absolute;
        right: 30px;
        top: 30px;
      }
      .icon-down{
        width: 28px;
        vertical-align: middle;
        margin-bottom: 4px;
      }
    }
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
      width: 92%;
      border-bottom: 12px solid #F7F7F7;
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
