<template>
  <div>
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" class="scrollView">
      <div class="main-bc"></div>
    </mescroll-vue>
    <!--<div class="vessel" v-if="showModal">-->
      <!--<img src="http://images.ufutx.com/201907/09/cc558035065ad83a89bb7b5754d918c4.png" alt="" class="close" @click="hideModal">-->
      <!--<div class="modal-vessel" @click="gotoShare"></div>-->
    <!--</div>-->
  </div>
</template>

<script>
  import {Group, Cell, XHeader, Swiper, XInput, SwiperItem} from 'vux'
  import MescrollVue from 'mescroll.js/mescroll.vue'
  import swiperComponent from '../components/swiper'
  import {$toastText} from '../config/util'

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
      //   vm.$http.get(`/official/community/groups?page=${page.num}`).then(({data}) => {
      //     vm.init = true
      //     let dataV = page.num === 1 ? [] : this.list
      //     dataV.push(...data.data)
      //     vm.list = dataV
      //     vm.$nextTick(() => {
      //       mescroll.endSuccess(data.data.length)
      //     })
      //     console.log(vm.list)
      //   }).catch((error) => {
      //     console.log(error)
      //   })
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
  .main-bc{
    width: 100vw;
    height: 100vh;
    background-image: url("https://images.ufutx.com/201907/20/5ca6bdbf42e7eaec7537ac657f10c4ef.jpeg");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
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
    padding: 10px  28px 36px 28px;
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
</style>
