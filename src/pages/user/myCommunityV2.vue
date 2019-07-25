<template>
  <div>
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" class="scrollView">
      <div class="main-creation">
        <img class="flo_l" :src="user.photo">
        <p class="flo_l font28 bold color6">{{user.name}}</p>
        <div class="flo_l font26 colorb0 infor">
          <div class="text-center infor-item flo_l">
            <span class="theme_clo  font36">{{user.community_count}}</span>
            <p class="color6">总群数</p>
          </div>
          <div class="text-center infor-item flo_l">
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
      <!--<tab style="background-color: #D82653;font-size: 14px" bar-active-color="#D82653" active-color="#D82653" custom-bar-width='100px'>-->
        <!--<tab-item :selected="type === 'create'" @on-item-click="tabClick('create')">我创建的群</tab-item>-->
        <!--<tab-item :selected="type === 'join'" @on-item-click="tabClick('join')">我加入的群</tab-item>-->
      <!--</tab>-->
      <div class="groupicon">
        <div class="item-icon" v-for="item,index in list" >
          <div class="logo flo_l" v-bind:style="{backgroundImage:'url(' + item.logo + ')'}"   @click="goToDetail(item)" ></div>
          <div class="font26 color6 title flo_l ellipsis_1">{{item.title}}</div>
          <div class="font26 colorb0 title flo_l">
            <img src="https://images.ufutx.com/201907/25/f8b7d5da439d74b54f56121eabf93246.png" alt="">
            {{item.member_num}}
          </div>
          <div class="main-btn">
            <div class="flo_l _put font26" @click="gotoLink(item.id)">修改</div>
            <div class="flo_r _del font26" @click="showDelete(item.title,item.id,index)">删除</div>
          </div>
        </div>
      </div>
      <div class="height160"></div>
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
  import {$toastText, $loadingShow, $loadingHide} from '../../config/util'

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
      MescrollVue
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
        this.getOrderList({num: 1})
      },
      handler (val) {
        console.log(val)
      },
      searchUser () { // 输入框搜索
        this.getOrderList()
      },
      create () {
        $toastText('该功能正在开发中...')
      },
      hideModal () {
        this.showModal = false
      },
      gotoLink (id) {
        this.$router.push({
          name: `createCommunity`,
          params: {id: id}
        })
      },
      showDelete (title, id, index) {
        this.$vux.confirm.show({
          title: '提示',
          content: `是否删除${title}这个社群？`,
          dialogTransition: 'vux-fade',
          onCancel: () => {
          },
          onConfirm: () => {
            $loadingShow('处理中...')
            this.$http.delete(`/official/user/communities/${id}`).then(({data}) => {
              setTimeout(() => {
                $loadingHide()
                this.list.splice(index, 1)
              }, 800)
            })
          }
        })
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
        let vm = this
        let url = `/official/users/communities?page=${page.num}`
        if (vm.type === 'join') {
          url = `/official/users/${vm.id}/joined/communities?page=${page.num}`
        }
        vm.$http.get(url).then(({data}) => {
          vm.user = data.user
          vm.user.community_click_num = data.community_click_num
          vm.user.community_count = data.community_count
          vm.user.community_member_num = data.community_member_num
          vm.init = true
          let dataV = page.num === 1 ? [] : vm.list
          dataV.push(...data.communities.data)
          vm.list = dataV
          if (mescroll) {
            vm.$nextTick(() => {
              mescroll.endSuccess(data.communities.data.length)
            })
          }
          console.log(vm.user)
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    mounted () {
      this.id = this.$route.query.id
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
    overflow: hidden;
    .item-icon {
      width: 100%;
      overflow: hidden;
      padding: 22px 0;
      border-bottom: 1px solid #b0b0b0;
      .logo{
        width: 90px;
        height: 90px;
        border-radius: 50%;
        background-size: cover;
        background-repeat: no-repeat;
        margin-left: 45px;
        margin-right: 20px;
      }
      .title {
        width: 46vw;
        margin-top: 6px;
        img{
          width: 36px;
          vertical-align: middle;
          margin-bottom: 12px;
          margin-right: -6px;
        }
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
  .main-btn{
    overflow: hidden;
    margin-top: 38px;
    margin-right: 22px;
    ._put,._del{
      width: 75px;
      height: 35px;
      line-height: 35px;
      border-radius: 8px;
      background: #D92553;
      text-align: center;
      color: white;
      padding: 4px;
    }
    ._del{
      background: white;
      color: #D92553;
      border: 1px solid #D92553;
    }
  }
</style>
