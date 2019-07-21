<template>
  <div>
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" class="scrollView">
      <div class="main-creation" >
        <img class="flo_l" :src="group.logo">
        <p class="flo_l font28 bold color6">{{group.title}}</p>
        <p class="flo_l font26 colorb0 infor">{{group.intro}}</p>
      </div>
      <div class="color6 font26 bc_num">{{list.length}}个群</div>
      <div class="groupicon">
        <div class="item-icon" v-for="item,index in list" @click="goToDetail(item)"  >
          <div class="logo" v-bind:style="{backgroundImage:'url(' + item.logo + ')'}" ></div>
          <div class="font22 color6 title">{{item.title}}</div>
        </div>
      </div>
      <div class="height160"></div>
    </mescroll-vue>
    <div class="box_bottom">
      <div class="home_and_share">
        <div class="home_" @click="goHome">
          <img class="icon_home" src="https://images.ufutx.com/201904/02/c2a2e6539c0aba992088b1b51a54a18b.png" alt="">
          <p class="home">首页</p>
        </div>
        <div class="share_" @click="goPlaza">
          <!--img class="icon_share" src="https://images.ufutx.com/201904/02/7b1981496eb2cd024c3830a018c4c89e.png" alt=""-->
          <img class="icon_share" src="https://images.ufutx.com/201907/20/8a9145f6d331cc5086a19c6dd2646f8e.png" alt="">
          <p class="share">动态</p>
        </div>
      </div>
    </div>
    <div class="vessel" v-if="showModal">
      <img src="http://images.ufutx.com/201907/09/cc558035065ad83a89bb7b5754d918c4.png" alt="" class="close" @click="hideModal">
      <div class="modal-vessel" @click="gotoShare"></div>
    </div>
  </div>
</template>

<script>
  import {Group, Cell, XHeader, Swiper, XInput, SwiperItem} from 'vux'
  import MescrollVue from 'mescroll.js/mescroll.vue'
  import swiperComponent from '../../components/swiper'
  import {$toastText} from '../../config/util'

  export default {
    components: {
      Group,
      Cell,
      XHeader,
      Swiper,
      SwiperItem,
      XInput,
      swiperComponent,
      MescrollVue
    },
    data () {
      return {
        value: '',
        current: 0,
        search: '',
        showModal: false,
        init: false,
        recommend: [],
        noData: false,
        id: 0,
        page: 1,
        groupList: [
          {
            icon: 'http://images.ufutx.com/201907/01/9e0ee9cfa69b46e37576ce393a874ec3.png',
            title: '单身群',
            id: 1
          },
          {
            icon: 'http://images.ufutx.com/201907/01/a3722ff97f8e49079c55c3ba1eb2e7a5.png',
            title: '红娘群',
            id: 2
          },
          {
            icon: 'http://images.ufutx.com/201907/01/064d6bd1672193af0d116f1b23164480.png',
            title: '介绍人群',
            id: 3
          },
          {
            icon: 'http://images.ufutx.com/201907/01/1a6e685971a396376488e9183dbb8899.png',
            title: '城市群',
            id: 4
          }
        ],
        group: {},
        mescroll: null, //  mescroll实例对象
        mescrollDown: {}, // 下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
        mescrollUp: { // 上拉加载的配置.
          callback: this.getOrderList, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
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
      searchUser () { // 输入框搜索
        this.getOrderList(1)
      },
      create () {
        $toastText('该功能正在开发中...')
      },
      hideModal () {
        this.showModal = false
      },
      gotoLink () {
        window.location.href = 'https://mp.weixin.qq.com/s/JOOAf693lS3cWpSngompLA'
      },
      gotoShare () {
        this.showModal = false
        window.location.href = `http://love.ufutx.com/wx/bind/v2`
        // this.$router.push({name: 'sharePage'})
      },
      goHome () {
        if (localStorage.getItem('paasName') !== 'FL' && localStorage.getItem('paasName') ) {
          this.$router.push({name: 'home'})
        } else {
          this.$router.push({name: 'communityHome'})
        }
      },
      goPlaza () {
        this.$router.push({name: 'plaza'})
      },
      goToDetail (item) {
        if (this.$isWeiXin() === true) {
          if (localStorage.getItem('official_openid') && localStorage.getItem('official_openid') !== null) {
            this.$router.push({
              name: `communityDetail`,
              params: {id: item.id},
              query: {title: item.title, logo: item.icon}
            })
          } else {
            if (localStorage.getItem('mobile') && localStorage.getItem('mobile') !== null) {
              window.location.href = 'https://love.ufutx.com/wx/bind?mobile=' + localStorage.getItem('mobile') + `&type=community&id=${item.id}&from_official_openid=` + localStorage.getItem('from_official_openid')
            } else {
              window.location.href = `https://love.ufutx.com/wx/bind?type=community&id=${item.id}`
            }
          }
        } else {
          this.$router.push({
            name: `communityDetail`,
            params: {id: item.id},
            query: {title: item.title, logo: item.icon}
          })
        }
      },
      swiperItem (currentIndex) {
        this.currentIndex = currentIndex
      },
      routeToDetail (type, id) {
        if (type === 'single') {
          this.$router.push({name: 'information', params: {id: id}})
        } else {
          this.$router.push({name: 'introducer', params: {id: id}})
        }
      },
      mescrollInit (mescroll) {
        this.mescroll = mescroll
      },
      getMessageNum () {
        this.$http.get(`/official/notice/num`).then(({data}) => {
          localStorage.setItem('chat_num', data.chat_message_num.toString())
          localStorage.setItem('notice_num', data.notice_num.toString())
        })
      },
      getOrderList (page, mescroll) {
        let vm = this
        vm.$http.get(`/official/community/groups/${vm.id}?page=${page.num}`).then(({data}) => {
          vm.group = data.group

          let group = data.group
          let userInfo = JSON.parse(localStorage.getItem('userInfo'))
          let title = userInfo ? `${userInfo.name}邀请你加入《${group.title}》` : `邀请你加入《${group.title}》`
          let intro = group.intro
          let pic = group.logo
          let paas = localStorage.getItem('paasName')
          let officialOpenid = localStorage.getItem('official_openid')
          let url = `https://love.ufutx.com/mobile/#/communityClass/${group.id}?paas=${paas}&id=&community_share=1&from_user_id=${userInfo ? userInfo.id : ''}&from_official_openid=${officialOpenid}`
          console.log(pic, url, intro, title)
          this.$shareList(pic, url, intro, title)

          vm.init = true
          let dataV = page.num === 1 ? [] : vm.list
          dataV.push(...data.communities.data)
          vm.list = dataV
          vm.$nextTick(() => {
            mescroll.endSuccess(data.communities.data.length)
          })
          console.log(vm.list)
          console.log(vm.group)
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    mounted () {
      this.id = this.$route.params.id
      // console.log(this.$store.state.intercept)
      // if (this.$store.state.intercept === 'true') {
      //   return false
      // }
    }
  }
</script>

<style lang="less" scoped>
  .scrollView{
    background: white;
  }
  .main-input{
    width: 86vw;
    background: #EBEAEA;
    margin: 28px auto;
    padding: 0 12px;
    border-radius: 12px;
    padding-left: 43px;
    position: relative;
    &:after{
      content: '';
      width: 42px;
      height: 42px;
      position: absolute;
      left: 6px;
      top: 10px;
      background-image: url("https://images.ufutx.com/201907/20/f8b7d5da439d74b54f56121eabf93246.png");
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
  .main-creation{
    overflow: hidden;
    padding: 36px  28px;
    img{
      width: 90px;
      height: 90px;
      margin-right: 22px;
      border-radius: 50%;
    }
    p{
      margin-top: 8px;
    }
    .infor{
      width: 82%;
    }
  }
  .bc_num{
    background: #f6f6f6;
    padding: 4px 28px;
  }
  .animationData {
    animation: myMove2 800ms linear;
    animation-fill-mode: forwards;
  }

  @keyframes myMove2 {
    from {
      height: 302px;
    }
    to {
      height: 347px;
    }
  }

  .animationData2 {
    animation: myMove1 800ms linear;
    animation-fill-mode: forwards;

  }

  @keyframes myMove1 {
    from {
      height: 347px;
    }
    to {
      height: 302px;

    }
  }

  .groupicon {
    padding: 26px;
    overflow: hidden;
    .item-icon {
      width: 25%;
      float: left;
      text-align: center;
      .logo{
        width: 90px;
        height: 90px;
        border-radius: 50%;
        margin: auto;
        margin-top: 12px;
        background-size: cover;
        background-repeat: no-repeat;
      }
      img {
        width: 88px;
        margin-top: 12px;
      }
      .title {
        margin-top: 4px;
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
  .vessel {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, .7);
    .close{
      width: 60px;
      position: absolute;
      top: 20%;
      right: 12%;
    }
    .modal-vessel {
      background-image: url("http://images.ufutx.com/201907/09/7f45e1fa8d1774f7f1e9f30b7516221d.png");
      background-size: contain;
      background-repeat: no-repeat;
      animation: myMove 300ms linear;
      animation-fill-mode: forwards;
      @keyframes myMove {
        from {
          width: 0;
          height: 0;
          margin: 27% auto;
        }
        to {
          width: 86%;
          height: 72%;
          margin: 30% auto;
        }
      }
    }
  }
</style>
