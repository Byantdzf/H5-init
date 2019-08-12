<template>
  <div>
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" class="scrollView">

      <div class="main-creation">
        <div class="img flo_l" v-bind:style="{backgroundImage:'url(' + user.photo + ')'}" ></div>
        <p class="flo_l font28 bold color6">{{user.name}}</p>
        <div class="flo_l font26 colorb0 infor">
          <div class="text-center infor-item flo_l">
            <span class="theme_clo  font36">{{user.community_count}}</span>
            <p class="color6">总群数</p>
          </div>
          <div class="text-center infor-item flo_l" @click="gotoLink">
            <span class="theme_clo font36">{{user.community_member_num}}</span>
            <p class="color6">总成员</p>
          </div>
          <div class="text-center infor-item flo_l">
            <span class="theme_clo font36">{{user.community_click_num}}</span>
            <p class="color6">总热度</p>
          </div>
        </div>
      </div>
      <div class="color6 font26 bc_num"></div>
      <tab style="background-color: #D82653;font-size: 14px" bar-active-color="#D82653" active-color="#D82653" custom-bar-width='100px'>
        <tab-item :selected="type === 'create'" @on-item-click="tabClick('create')">我创建的群</tab-item>
        <tab-item :selected="type === 'join'" @on-item-click="tabClick('join')">我加入的群</tab-item>
      </tab>
      <div class="groupicon">
        <div class="item-icon" v-for="item,index in list" @click="goToDetail(item)"  >
          <div class="logo" v-bind:style="{backgroundImage:'url(' + item.logo + ')'}" ></div>
          <div class="font22 color6 title">{{item.title}}</div>
        </div>
        <div v-if="list.length < 1 && init" class="text-center">
          <span v-if="type === 'create'">
            <div class="main-listV">
            <div class="item font26 colorb0">暂无群信息...</div>
          </div>
          </span>
          <span v-else>
           <div class="main-listV">
            <div class="item font26 colorb0">暂无群信息...</div>
          </div>
          </span>
        </div>
      </div>
      <!--<div class="height160"></div>-->
      <div class="main-Circle" v-if="circleList.length > 0">
        <div class="main-title text-center font28">群动态</div>
        <communityCircle :list.sync="circleList"></communityCircle>
        <div class="height160"></div>
      </div>
    </mescroll-vue>
    <div class="vessel" v-if="showModal">
      <img src="http://images.ufutx.com/201907/09/cc558035065ad83a89bb7b5754d918c4.png" alt="" class="close" @click="hideModal">
      <div class="modal-vessel" @click="gotoShare"></div>
    </div>
  </div>
</template>

<script>
  import {Group, Cell, XHeader, Swiper, XInput, SwiperItem, Tab, TabItem} from 'vux'
  import MescrollVue from 'mescroll.js/mescroll.vue'
  import swiperComponent from '../../components/swiper'
  import {$toastText, $loadingHide, $loadingShow} from '../../config/util'
  import communityCircle from '../../components/communityCircle'

  export default {
    components: {
      Group,
      Cell,
      XHeader,
      Swiper,
      SwiperItem,
      XInput,
      Tab,
      TabItem,
      swiperComponent,
      MescrollVue,
      communityCircle
    },
    data () {
      return {
        value: '',
        current: 0,
        type: 'create',
        search: '',
        showModal: false,
        init: false,
        recommend: [],
        noData: false,
        page: 1,
        user: {},
        circleList: [],
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
      tabClick (type) {
        this.list = []
        this.type = type
        this.init = false
        this.circleList = []
        this.getOrderList({num: 1})
      },
      handler (val) {
        console.log(val)
      },
      searchUser () { // 输入框搜索
        this.getOrderList()
      },
      hideModal () {
        this.showModal = false
      },
      gotoLink () {
        if (this.type === 'create') {
          this.$router.push({
            name: `communityMember`
          })
        } else {
          $toastText('暂时不能查看我加入的社群 群成员！')
        }
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
      gotoShare () {
        this.showModal = false
        window.location.href = `http://love.ufutx.com/wx/bind/v2`
        // this.$router.push({name: 'sharePage'})
      },
      goToDetail (item) {
        this.$router.push({
          name: `communityDetail`,
          params: {id: item.id}
        })
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
        $loadingShow('加载中')
        let vm = this
        let url = `/official/users/${vm.id}/create/community/moments?page=${page.num}`
        if (vm.type === 'join') {
          url = `/official/users/${vm.id}/join/community/moments?page=${page.num}`
        }
        vm.$http.get(url).then(({data}) => {
          vm.user = data.user
          vm.user.community_click_num = data.community_click_num
          vm.user.community_count = data.community_count
          vm.user.community_member_num = data.community_member_num
          vm.init = true
          vm.list = data.communities
          let dataV = page.num === 1 ? [] : vm.circleList
          dataV.push(...data.community_moments.data)
          vm.circleList = dataV
          if (mescroll) {
            vm.$nextTick(() => {
              mescroll.endSuccess(dataV.length)
            })
          }
          if (vm.circleList.length > 0) {
            vm.circleList.forEach((item, index) => {
              let photoList = []
              if (item.photos.length > 0) {
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
              }
              item.photoList = photoList
            })
          }
          console.log(vm.list)
          console.log(vm.user)
          $loadingHide()
        }).catch((error) => {
          $loadingHide()
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

<style lang="less" scoped="scoped">
  .scrollView{
    background: white !important;
  }
  .main-creation{
    overflow: hidden;
    padding: 36px  28px 28px 28px;
    .img{
      width: 90px;
      height: 90px;
      margin-right: 22px;
      border-radius: 50%;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
    }
    p{
      margin-top: 8px;
    }
    .infor{
      width: 80%;
      margin-top: 28px;
      .infor-item{
        width: 33%;
        position: relative;
        &:nth-child(1),&:nth-child(2){
          &:before{
            content: ' ';
            width: 1px;
            height: 52px;
            background: #e2e2e2;
            position: absolute;
            right: 0;
            top: 12px;
          }
        }
      }
    }
  }
  .main-Circle{
    .main-title{
      border-top: 14px solid #f6f6f6;
      border-bottom: 14px solid #f6f6f6;
      padding: 22px;
    }
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
  .bc_num{
    background: #f6f6f6;
    height: 14px;
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
    .main-btn{
      width: 180px;
      height: 60px;
      background: #D92553;
      border-radius: 6px;
      line-height: 60px;
      color: white;
      margin: 32px auto;
    }
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
