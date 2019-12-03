<template>
  <div>
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" class="scrollView">
      <!--<div id="box"></div>-->
      <div class="bc_top">
        <div style="background: #EDEDED;">
          <router-link to="userList">
            <img src="https://images.ufutx.com/201904/27/49397b67f29633a4d200ed2b86ce3dbc.png" alt="" width="100%">
          </router-link>
        </div>
        <!--<div class="font30 announcements" v-if="announcements.length > 0">-->
          <!--<swiper auto height="30px" direction="vertical" :interval=2000 class="text-scroll" :show-dots="false">-->
            <!--<swiper-item v-for="item in announcements" :key="item.id">-->
              <!--<p class="ellipsis_1 color6" @click="$h ref(item.type == 'OF'?item.path:'#')">-->
                <!--<img src="https://images.ufutx.com/201904/27/3a6720333a2434da29453d42ede484cf.png" alt="" width="22px"-->
                     <!--class="announcementIcon">-->
                <!--{{item.title}}-->
              <!--</p>-->
            <!--</swiper-item>-->
          <!--</swiper>-->
        <!--</div>-->
        <div v-if="announcements.length>0">
          <swiper auto height="120px" :interval=2000 class="text-scroll" :show-dots="false">
            <swiper-item v-for="item in announcements" :key="item.id">
              <div class="main-pic"  v-bind:style="{backgroundImage:'url(' + item.pic + ')'}" @click="$href(item.type == 'OF'?item.path:'#')"></div>
            </swiper-item>
          </swiper>
        </div>
      </div>
      <div class="groupicon">
        <span v-if="paas == 'SZDSQY'">
          <div class="item-icon" v-for="item,index in groupList" @click="goToDetail(item)">
          <img :src="item.icon" alt="">
          <div class="font22 color6 title">{{item.title}}</div>
        </div>
        </span>
        <span v-else>
          <div class="item-icon" v-for="item,index in groupListV2" @click="goToDetailV2(item)">
          <img :src="item.icon" alt="">
          <div class="font22 color6 title">{{item.title}}</div>
        </div>
        </span>
      </div>
      <span v-if="paas == 'SZDSQY'">
        <p class="bc_title font34 bold">导师推荐</p>
        <div class="main-box"  v-for="item in list"  @click="goTo(item)" >
          <div class="main-photo" v-bind:style="{backgroundImage:'url(' + item.logo + ')'}"></div>
          <div class="main-name color6 bold font30" >{{item.title}}</div>
          <div class="main-intro ellipsis_1 font26" >{{item.intro}}</div>
        </div>
      </span>
      <span v-else>
        <p class="bc_title font34 bold">推荐</p>
        <swiperComponent :list.sync="recommend"></swiperComponent>
      </span>
      <!--<swiper  :min-moving-distance="120" :show-desc-mask="true"  :auto="true" :interval="2000" @on-index-change="swiperItem">-->
      <!--<swiper-item v-for="item,index in recommend" :key="item.id" >-->
      <!--<div :class="[index == current?'animationData': 'animationData2']">-->
      <!--<div class="recommend-image backCover"  v-bind:style="{backgroundImage:'url(' + item.photo + ')'}" @click="routeToDetail(item.user.type, item.user.id)"></div>-->
      <!--</div>-->
      <!--</swiper-item>-->
      <!--</swiper>-->
      <div class="list-item" v-for="item in list" @click="routeToDetail(item.type, item.id)">
        <div class="image" v-bind:style="{backgroundImage:'url(' + item.other_user.photo + ')'}"></div>
        <p style="margin-top: 8px;">
          <span class="font32">{{item.other_user.name}}</span>
          <span class="font20 colorb">{{item.other_user.age? item.other_user.age+ '岁 ': ''}} {{item.other_user.profile_courtship.stature? '· ' +item.other_user.profile_courtship.stature +'cm': ''}} {{item.other_user.profile_courtship.city? '· '+item.other_user.profile_courtship.city: ''}}</span>
        </p>
        <p class="font26 color6 ellipsis_1" style="margin-top: 4px">{{item.other_user.profile_courtship.introduction}}</p>
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
  import {Group, Cell, XHeader, Swiper, XInput, Search, SwiperItem} from 'vux'
  import MescrollVue from 'mescroll.js/mescroll.vue'
  import swiperComponent from '../components/swiper'
  import {$toastSuccess} from '../config/util'

  export default {
    components: {
      Group,
      Cell,
      XHeader,
      Swiper,
      SwiperItem,
      XInput,
      Search,
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
        id: localStorage.getItem('id'),
        recommend: [],
        noData: false,
        page: 1,
        paas: '',
        groupListV2: [
          {
            icon: 'http://images.ufutx.com/201905/29/fd66e63bb476a29958044c1dfc46c506.png',
            title: '动态',
            link: '/friendCircleList/0',
            id: 1
          },
          {
            icon: 'http://images.ufutx.com/201905/29/9e74b6471f13b711a8a7cdeea2b7ae50.png',
            title: '申请推荐',
            id: 2
          },
          {
            icon: 'http://images.ufutx.com/201905/29/8886eb950aaf96c43455deced5b531f1.png',
            title: '红娘',
            link: '/loveMate',
            id: 3
          },
          {
            icon: 'http://images.ufutx.com/201905/29/ad82d47bcae7a1b615a5f62a99faf482.png',
            title: '打赏支持',
            link: '/givingMoney',
            id: 4
          }
        ],
        groupList: [
          {
            icon: 'https://images.ufutx.com/201908/23/28984415aa18de5b4d6d81652baa8160.png',
            title: '都市情缘',
            link: 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzI4MDMzMzgzNg==&scene=124#wechat_redirect',
            id: 1
          },
          {
            icon: 'http://images.ufutx.com/201905/29/9e74b6471f13b711a8a7cdeea2b7ae50.png',
            title: '公司介绍',
            link: 'http://shop.ufutx.com/showme/dsqy',
            id: 2
          },
          {
            icon: 'http://images.ufutx.com/201905/29/8886eb950aaf96c43455deced5b531f1.png',
            title: '单身',
            link: '/userList',
            id: 3
          },
          {
            icon: 'http://images.ufutx.com/201905/29/fd66e63bb476a29958044c1dfc46c506.png',
            title: '动态',
            link: '/friendCircleList/0',
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
      hideModal () {
        this.showModal = false
      },
      gotoLink () {
        window.location.href = 'https://mp.weixin.qq.com/s/Ukz4VwbvFbdL0Wr57iCKSg'
      },
      gotoShare () {
        this.showModal = false
        window.location.href = `http://love.hankin.ufutx.cn/wx/bind/v2`
        // this.$router.push({name: 'sharePage'})
      },
      goTo (item) {
        this.$router.push({
          name: `communityDetail`,
          params: {id: item.id},
          query: {title: item.title, logo: item.icon}
        })
      },
      goToDetail (item) {
        if (item.id > 2) {
          this.$router.push({
            path: `${item.link}`
          })
          return
        }
        window.location.href = item.link
      },
      goToDetailV2 (item) {
        if (item.id === 2) {
          this.$vux.confirm.show({
            title: '提示：',
            content: '你将申请成为首页推荐？',
            dialogTransition: 'vux-fade',
            onCancel: () => {
            },
            onConfirm: () => {
              this.$http.post(`/apply/home/recommends`).then(({data}) => {
                $toastSuccess('申请成功，等待管理员审核')
              })
            }
          })
        } else {
          if (item.id === 3 || item.id === 4) {
            if (localStorage.getItem('official_openid') && localStorage.getItem('official_openid') !== null) {
              this.$router.push({
                path: `${item.link}`
              })
            } else if (this.$isWeiXin() === false) {
              this.$router.push({
                path: `${item.link}`
              })
            } else {
              if (item.id === 3) {
                window.location.href = 'https://love.ufutx.com/wx/bind?mobile=' + localStorage.getItem('mobile') + '&type=appointments'
              } else {
                window.location.href = 'https://love.ufutx.com/wx/bind?mobile=' + localStorage.getItem('mobile') + '&type=donation'
              }
            }
          } else {
            this.$router.push({
              path: `${item.link}`
            })
          }
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
        let url = '/official/home/likers'
        if (vm.paas === 'SZDSQY') {
          url = '/official/community/groups/68'
        }
        vm.$http.get(`/official/home?page=${page.num}`).then(({data}) => {
          vm.announcements = data.announcements
          vm.recommend = data.recommend
          vm.$http.get(`${url}?page=${page.num}`).then(({data}) => {
            vm.init = true
            let dataV = page.num === 1 ? [] : this.list
            if (vm.paas === 'SZDSQY') {
              dataV.push(...data.communities.data)
              vm.list = dataV
              vm.$nextTick(() => {
                mescroll.endSuccess(data.communities.data.length)
              })
            } else {
              dataV.push(...data.data)
              vm.list = dataV
              vm.$nextTick(() => {
                mescroll.endSuccess(data.data.length)
              })
            }
            console.log(vm.list, '123')
            vm.getMessageNum()
          }).catch((error) => {
            console.log(error)
          })
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    mounted () {
      this.paas = localStorage.getItem('paasName')
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
  .main-box{
    padding: 22px;
    border-bottom: 10px solid #f4f4f4;
    margin-bottom: 12px;
    .main-photo{
      width: 100%;
      height: 84vw;
      background-repeat: no-repeat;
      /*background-position: center;*/
      background-size: cover;
      margin-bottom: 6px;
    }
    .main-intro{
      color: #707070;
      margin: 0 12px;
    }
    .main-name{
      margin: 10px 12px;
    }

  }

  .vux-demo {
    text-align: center;
  }

  .logo {
    width: 100px;
    height: 100px
  }

  .search-box {
    width: 690px;
    height: 88px;
    margin: 22px auto;
    background: white;
    border-radius: 6px;
    border: 2px solid #f0f0f3;

    .homeSearch {
      width: 100%;
      height: 100%;
      border: none;
      background: none;
      /*box-shadow: 1px 1px 12px #e9e9e9;*/
    }
  }

  .bc_title {
    margin-top: 22px;
    margin-left: 22px;
    margin-bottom: 6px;
  }

  .vux-img {
    width: 90% !important;
    margin: auto;
    border-radius: 6px;
    box-shadow: 1px 1px 12px #d3d3d3;
  }

  .vux-swiper {
    text-align: center;

    p {
      color: #666666;
    }
  }

  .list-item {
    width: 646px;
    height: 736px;
    padding: 22px;
    padding-bottom: 32px;
    margin: auto;
    border-radius: 10px;
    background: white;
    margin-top: 22px;
    box-shadow: -1px 8px 18px #dadada;
    margin-bottom: 26px;

    .image {
      width: 100%;
      height: 646px;
      background-repeat: no-repeat;
      background-size: cover;
    }
  }

  .recommend-image {
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .vux-swiper {
    height: 400px;
  }

  .announcements {
    background: #EDEDED;
    padding: 12px 22px;
    padding-bottom: 0px;
    margin-top: -12px;
    margin-bottom: 18px;
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
  .main-pic{
    width: 100%;
    height: 240px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  .groupicon {
    padding: 32px 0;
    overflow: hidden;
    border-bottom: 8px solid #ECECEC;

    .item-icon {
      width: 25%;
      float: left;
      text-align: center;

      img {
        width: 88px;
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
