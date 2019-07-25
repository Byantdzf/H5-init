<template>
  <div>
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" class="scrollView">
      <div class="main-creation" @click="create">
        <img class="flo_l" :src="user.photo">
        <p class="flo_l font28 bold color6">{{user.name}}</p>
        <div class="flo_l font26 colorb0 infor">
          <div class="text-center infor-item flo_l">
            <span class="theme_clo  font36">{{user.community_count}}</span>
            <p class="color6">总群数</p>
          </div>
          <div class="text-center infor-item flo_l" >
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
      <div class="main-member" v-for="item,index in list" @click="routeToDetail(item.user.type, item.user.id)">
        <div class="img flo_l" v-bind:style="{backgroundImage:'url(' + item.user.photo + ')'}" ></div>
        <p class="flo_l font26 bold color6">{{item.user.name}}</p>
        <p class="flo_r font26 colorb0">{{item.created_at}}</p><br/>
        <p class="flo_l font26 colorb0">{{item.user.mobile}}</p>
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
  // import {$toastText} from '../../config/util'

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
        type: '我创建的群',
        search: '',
        showModal: false,
        user: {},
        init: false,
        recommend: [],
        noData: false,
        page: 1,
        groupList: [
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
      handler (val) {
        console.log(val)
      },
      searchUser () { // 输入框搜索
        this.getOrderList(1)
      },
      create () {
        // $toastText('该功能正在开发中...')
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
      goToDetail (item) {
        this.$router.push({
          name: `communityDetail`,
          params: {id: 1}
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
        let url = `/official/user/community/members?page=${page.num}`
        vm.$http.get(url).then(({data}) => {
          vm.user = data.user
          vm.user.community_click_num = data.community_click_num
          vm.user.community_count = data.community_count
          vm.user.community_member_num = data.community_member_num
          vm.init = true
          let dataV = page.num === 1 ? [] : vm.list
          dataV.push(...data.members.data)
          vm.list = dataV
          if (mescroll) {
            vm.$nextTick(() => {
              mescroll.endSuccess(data.members.data.length)
            })
          }
          vm.list.map((item, index) => {
            if (!item.user) {
              vm.list.splice(index, 1)
            }
          })
          console.log(vm.user)
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
  body {
    background: #f7f7f7 !important;

    .announcementIcon {
      margin-bottom: 8px;
      vertical-align: middle;
    }
  }
  .main-member{
    padding: 28px 22px 28px 44px ;
    border-bottom: 1px solid #b0b0b0;
    overflow: hidden;
    .img{
      width: 90px;
      height: 90px;
      border-radius: 50%;
      margin-right: 12px;
      background-size: cover;
      background-repeat: no-repeat;
    }
    p{
      margin-top: 8px;
    }
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
