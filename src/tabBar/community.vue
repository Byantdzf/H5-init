<template>
  <div>
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" class="scrollView">
      <div class="main-input">
        <input type="text" placeholder="搜索感兴趣的群" v-model="search" @change="searchUser"/>
      </div>
      <div class="main-creation" @click="create">
        <img class="flo_l" src="https://images.ufutx.com/201907/20/6e0bb82048c9ab0b1833d28aa83c6d7f.png">
        <p class="flo_l font28 bold">新建社群</p>
        <p class="flo_l font26 colorb0">新建一个自己的社群，可以召集你的小伙伴</p>
      </div>
      <div class="main-share" @click="showSharefn">
        <img src="https://images.ufutx.com/201907/20/8e47e7087d1ecd592028786df6dbc60f.png" alt="">
      </div>
      <!--<div class="main-map" @click="gotoLink">-->
        <!--<img class="flo_l city" src="http://images.ufutx.com/201905/29/116e3887dd6dcbcaad6a464f96bdcdcb.png">-->
        <!--<span class="flo_l font28 address" >相遇地图</span>-->
        <!--<img class="flo_r next" src="http://images.ufutx.com/201905/29/2eeab012d13d91f16f5a21ad6c578678.png">-->
        <!--<img class="flo_r photo" src="http://images.ufutx.com/201907/01/1a6e685971a396376488e9183dbb8899.png">-->
        <!--<span class="flo_r color6 font26" >附近的群</span>-->
      <!--</div>-->
      <div class="groupicon" >
        <div class="item-icon" v-for="item,index in list" @click="goToDetail(item)"  >
          <div class="logo" v-bind:style="{backgroundImage:'url(' + item.logo + ')'}" ></div>
          <div class="font22 color6 title">{{item.title}}</div>
        </div>
      </div>
      <div class="list-item" v-for="item in list" @click="routeToDetail(item.type, item.id)">
        <div class="image" v-bind:style="{backgroundImage:'url(' + item.photo + ')'}"></div>
        <p style="margin-top: 8px;">
          <span class="font32">{{item.name}}</span>
          <span class="font20 colorb">{{item.age? item.age+ '岁 ': ''}} {{item.stature? '· ' +item.stature +'cm': ''}} {{item.city? '· '+item.city: ''}}</span>
        </p>
        <p class="font26 color6 ellipsis_1" style="margin-top: 4px">{{item.introduction}}</p>
      </div>
      <div class="height160"></div>
    </mescroll-vue>
    <shareModal :show.sync="showShare" @hideModal="hideShare"></shareModal>
    <div class="vessel" v-if="showModal">
      <img src="http://images.ufutx.com/201907/09/cc558035065ad83a89bb7b5754d918c4.png" alt="" class="close" @click="hideModal">
      <div class="modal-vessel" @click="gotoShare"></div>
    </div>
  </div>
</template>

<script>
  import {Group, Cell, XHeader, Swiper, XInput, SwiperItem} from 'vux'
  import MescrollVue from 'mescroll.js/mescroll.vue'
  import swiperComponent from '../components/swiper'
  import {$toastText} from '../config/util'
  import shareModal from '../components/shareMoadl'

  export default {
    components: {
      Group,
      Cell,
      XHeader,
      Swiper,
      SwiperItem,
      XInput,
      swiperComponent,
      MescrollVue,
      shareModal
    },
    data () {
      return {
        value: '',
        current: 0,
        search: '',
        showModal: false,
        init: false,
        showShare: false,
        recommend: [],
        noData: false,
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
        announcements: [],
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
      hideShare (value) {
        this.showShare = value
      },
      searchUser () { // 输入框搜索
        this.list = []
        console.log(this.search)
        this.getOrderList({num: 1})
      },
      create () {
        let ACCESS_TOKEN = localStorage.getItem('ACCESS_TOKEN')
        if (ACCESS_TOKEN) {
          this.$router.push({
            name: 'createCommunity',
            params: {id: 0}
          })
        } else {
          $toastText('请先登录！')
          setTimeout(() => {
            this.$router.push({name: 'login'})
          }, 800)
        }
      },
      showSharefn () {
        let ACCESS_TOKEN = localStorage.getItem('ACCESS_TOKEN')
        if (ACCESS_TOKEN) {
          this.showShare = true
        } else {
          $toastText('请先登录！')
          setTimeout(() => {
            this.$router.push({name: 'login'})
          }, 800)
        }
      },
      hideModal () {
        this.showModal = false
      },
      gotoLink () {
        this.$router.push({name: 'map'})
      },
      gotoShare () {
        this.showModal = false
        window.location.href = `http://love.ufutx.com/wx/bind/v2`
      },
      goToDetail (item) {
        this.$router.push({
          path: `communityClass/${item.id}`
        })
        // if (this.$isWeiXin() === true) {
        //   if (localStorage.getItem('official_openid') && localStorage.getItem('official_openid') !== null) {
        //     this.$router.push({
        //       path: `communityDetail/${item.id}`
        //     })
        //   } else {
        //     if (localStorage.getItem('mobile') && localStorage.getItem('mobile') !== null) {
        //       window.location.href = 'https://love.ufutx.com/wx/bind?mobile=' + localStorage.getItem('mobile') + `&type=community&id=${item.id}&from_official_openid=` + localStorage.getItem('from_official_openid')
        //     } else {
        //       window.location.href = `https://love.ufutx.com/wx/bind?type=community&id=${item.id}`
        //     }
        //   }
        // } else {
        //   this.$router.push({
        //     path: `wxGroup/${item.id}`,
        //     query: {title: item.title, logo: item.icon}
        //   })
        // }
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
      getOrderList (page, mescroll) {
        let vm = this
        vm.$http.get(`/official/community/groups?page=${page.num}&keyword=${vm.search}`).then(({data}) => {
          vm.init = true
          let dataV = page.num === 1 ? [] : this.list
          dataV.push(...data.data)
          vm.list = dataV
          if (mescroll) {
            vm.$nextTick(() => {
              mescroll.endSuccess(data.data.length)
            })
          }
          console.log(vm.list)
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    mounted () {
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
  .main-creation{
    overflow: hidden;
    padding: 8px  28px 36px 28px;
    border-bottom: 14px solid #F6F6F6;
    img{
      width: 90px;
      height: 90px;
      margin-right: 22px;
    }
    p{
      margin-top: 10px;
    }
  }
  .main-map{
    border-bottom: 14px solid #F6F6F6;
    overflow: hidden;
    height: 62px;
    padding: 22px 22px;
    line-height: 62px;
    .city{
      width: 28px;
      line-height: 62px;
      margin-right: 22px;
      vertical-align: middle;
      margin-top: 12px;
      margin-left: 46px;
    }
    .photo{
      width: 60px;
      height: 60px;
      margin-left: 12px;
    }
    .next{
      width: 22px;
      margin-left: 64px;
      margin-top: 12px;
    }
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
      .title {
        margin-top: 4px;
      }
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
  .main-share {
    img {
      width: 100%;
    }
  }
</style>
