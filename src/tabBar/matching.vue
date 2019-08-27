<template>
  <div>
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" class="scrollView">
      <div v-if="list.length !== 0">
        <p class="bc_title font34 bold">推荐</p>
        <div class="list-item" v-for="item in list" @click="routeToDetail(item.type, item.id)">
          <div class="image" v-bind:style="{backgroundImage:'url(' + item.photo + ')'}"></div>
          <p style="margin-top: 8px;">
            <span class="font32">{{item.name}}</span>
            <span class="font20 colorb">{{item.age? item.age+ '岁 ': ''}} {{item.city? '· '+item.city: ''}}</span>
          </p>
          <p class="font26 color6 ellipsis_1" style="margin-top: 4px">{{item.introduction}}</p>
        </div>
      </div>
      <div v-else class="pic">
        <img src="https://images.ufutx.com/201908/27/1566890406qrcode.png" class="two_dimension_code" alt="">
        <p class="content">请长按识别二维码注册后查看</p>
      </div>
      <div class="height160"></div>
    </mescroll-vue>
  </div>
</template>

<script>
  import {Group, Cell, XHeader, Swiper, XInput, Search, SwiperItem} from 'vux'
  import MescrollVue from 'mescroll.js/mescroll.vue'
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
        window.location.href = `http://love.ufutx.com/wx/bind/v2`
        // this.$router.push({name: 'sharePage'})
      },
      goToDetail (item) {
        if (item.id === 1) {
          window.location.href = item.link
          return
        }
        this.$router.push({
          path: `${item.link}`
        })
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
      matchingRates (page) {
        let vm = this
        this.$http.get(`/official/mobiles/15346981130/matching/rates?page=${page}`).then(({data}) => {
          vm.init = true
          let result = data.data
          vm.list = result.map((item) => {
            return {
              photo: item.rate_user.photo,
              age: item.rate_user.age,
              id: item.rate_user.id,
              type: item.rate_user.type,
              city: item.rate_user.city,
              introduction: item.rate_user.introduction
            }
          })
        })
      }
      // getOrderList (page, mescroll) {
      //   let vm = this
      //   vm.$http.get(`/official/home?page=${page.num}`).then(({data}) => {
      //     vm.announcements = data.announcements
      //     vm.recommend = data.recommend
      //     vm.$http.get(`/official/home/likers?page=${page.num}`).then(({data}) => {
      //       vm.init = true
      //       let dataV = page.num === 1 ? [] : this.list
      //       dataV.push(...data.data)
      //       vm.list = dataV
      //       vm.$nextTick(() => {
      //         mescroll.endSuccess(data.data.length)
      //       })
      //       vm.getMessageNum()
      //     }).catch((error) => {
      //       console.log(error)
      //     })
      //   }).catch((error) => {
      //     console.log(error)
      //   })
      // }
    },
    mounted () {
      this.paas = localStorage.getItem('paasName')
      this.matchingRates()
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
  .pic{
    width: 100%;
    text-align: center;
    .two_dimension_code {
      margin: auto;
      width: 500px;
      margin-top: 40%;
      border: 1px solid rgba(169, 169, 169, 0.45);
      -webkit-box-shadow: #666 0px 0px 10px;
      -moz-box-shadow: #666 0px 0px 10px;
      box-shadow: #666 0px 0px 10px;
    }
    .content{
      margin-top: 45px;
      font-size: 36px;
      font-family: '楷体';
      text-align: center;
    }
  }
</style>
