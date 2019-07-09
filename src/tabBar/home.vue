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
        <div class="font30 announcements" v-if="announcements.length > 0">
          <swiper auto height="30px" direction="vertical" :interval=2000 class="text-scroll" :show-dots="false">
            <swiper-item v-for="item in announcements" :key="item.id">
              <p class="ellipsis_1 color6" @click="$href(item.type == 'OF'?item.path:'#')">
                <img src="https://images.ufutx.com/201904/27/3a6720333a2434da29453d42ede484cf.png" alt="" width="22px"
                     class="announcementIcon">
                {{item.title}}
              </p>
            </swiper-item>
          </swiper>
        </div>
      </div>
      <img src="http://images.ufutx.com/201907/01/419369bfc0834908da80d03d383c79dd.png" alt="" @click="gotoLink"
           style="width: 100%">
      <div class="groupicon">
        <div class="item-icon" v-for="item,index in groupList" @click="goToDetail(item)">
          <img :src="item.icon" alt="">
          <div class="font22 color6 title">{{item.title}}</div>
        </div>
      </div>
      <p class="bc_title font34 bold" @click="showModal = !showModal">推荐</p>
      <swiperComponent :list.sync="recommend"></swiperComponent>
      <!--<swiper  :min-moving-distance="120" :show-desc-mask="true"  :auto="true" :interval="2000" @on-index-change="swiperItem">-->
      <!--<swiper-item v-for="item,index in recommend" :key="item.id" >-->
      <!--<div :class="[index == current?'animationData': 'animationData2']">-->
      <!--<div class="recommend-image backCover"  v-bind:style="{backgroundImage:'url(' + item.photo + ')'}" @click="routeToDetail(item.user.type, item.user.id)"></div>-->
      <!--</div>-->
      <!--</swiper-item>-->
      <!--</swiper>-->
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
        showModal: true,
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
        if (this.$isWeiXin() === true) {
          if (localStorage.getItem('official_openid') && localStorage.getItem('official_openid') !== null) {
            this.$router.push({
              path: `wxGroup/${item.id}`,
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
            path: `wxGroup/${item.id}`,
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
        vm.$http.get(`/official/home?page=${page.num}`).then(({data}) => {
          vm.announcements = data.announcements
          vm.recommend = data.recommend
          vm.$http.get(`/official/home/likers?page=${page.num}`).then(({data}) => {
            vm.init = true
            let dataV = page.num === 1 ? [] : this.list
            dataV.push(...data.data)
            vm.list = dataV
            vm.$nextTick(() => {
              mescroll.endSuccess(data.data.length)
            })
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
    margin-top: 12px;
    margin-left: 22px;
    margin-bottom: 12px;
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
