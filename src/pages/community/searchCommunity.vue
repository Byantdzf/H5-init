<template>
  <div>
    <!--<mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" class="scrollView">-->
    <div class="main-input">
      <input type="text" placeholder="搜索感兴趣的群" v-model="search" @change="searchUser"/>
      <div class="cancel" @click="search=''" v-if="search!==''"></div>
    </div>
    <div v-if="search === ''">
      <div class="main-search-box">
        <div class="main-title">
          <span class="font28">历史搜索</span>
          <img src="https://images.ufutx.com/201908/07/f77b4940675db9f9fde7fc40d058eb16.png" alt="" class="flo_r"
               @click="removeLS">
        </div>
        <div class="main-list">
          <div class="item font26" v-if="serachList<1">暂无搜索记录</div>
          <div class="item font26 color6" v-else v-for="item,index in serachList" @click="searchCommunity(item)">
            {{item}}
          </div>
        </div>
      </div>
      <div class="main-dost"></div>
      <div class="main-search-box">
        <div class="main-title">
          <span class="font28">热门搜索</span>
          <!--<img src="https://images.ufutx.com/201908/07/483bee04f97267558aae08b0b9cb08f7.png" class="flo_r image">-->
        </div>
        <div class="main-list">
          <div class="item font26" v-if="hotKeywords<1">暂无热搜记录</div>
          <div class="item font26 color6" v-else v-for="item,index in hotKeywords" @click="searchCommunity(item.name)">
            {{item.name}}
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div v-if="groups.length > 0">
        <div class="color6 font26 bc_num">{{groups.length}}个群分类</div>
        <div class="groupicon">
          <div class="item-icon" v-for="item,index in groups" @click="goToDetailClass(item)">
            <div class="logo" v-bind:style="{backgroundImage:'url(' + item.logo + ')'}"></div>
            <div class="font22 color6 title">{{item.title}}</div>
          </div>
        </div>
      </div>
        <div v-if="list.length > 0">
          <div class="color6 font26 bc_num">{{list.length}}个群</div>
          <div class="groupicon" v-if="list.length > 0">
            <div class="item-icon" v-for="item,index in list" @click="goToDetail(item)">
              <div class="logo" v-bind:style="{backgroundImage:'url(' + item.logo + ')'}"></div>
              <div class="font22 color6 title">{{item.title}}</div>
            </div>
          </div>
        </div>
        <div class="main-listV" v-if="init">
          <div class="item font26 colorb0">--- 暂无记录 ---</div>
        </div>
    </div>
    <div class="height160"></div>
    <!--</mescroll-vue>-->
    <div class="main-float">
      <div class="home_ text-center ff" @click="goHome">
        <img class="icon_home" src="https://images.ufutx.com/201907/22/31d8e0c40d69b277a83add3ecefe55f3.png" alt="">
        <span class="home color6">首页</span>
      </div>
    </div>
    <div class="vessel" v-if="showModal">
      <img src="http://images.ufutx.com/201907/09/cc558035065ad83a89bb7b5754d918c4.png" alt="" class="close"
           @click="hideModal">
      <div class="modal-vessel" @click="gotoShare"></div>
    </div>
  </div>
</template>

<script>
  import {Group, Cell, XHeader, Swiper, XInput, SwiperItem} from 'vux'
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
        list: [],
        hotKeywords: [],
        serachList: [],
        groups: []
      }
    },
    methods: {
      removeLS () {
        localStorage.removeItem('serachList')
      },
      searchUser () { // 输入框搜索
        console.log(this.search)
        if (!this.search) {
          return
        }
        for (let item of this.serachList) {
          if (item !== this.search) {
            this.serachList.unshift(this.search)
          }
        }
        if (this.serachList.length > 10) {
          this.serachList.length = 10
        }
        let serachList = {
          list: this.serachList
        }
        localStorage.setItem('serachList', JSON.stringify(serachList))
        this.getOrderList(1)
      },
      searchCommunity (val) {
        console.log(val)
        this.search = val
        this.getOrderList()
      },
      create () {
        $toastText('该功能正在开发中...')
      },
      hideModal () {
        this.showModal = false
      },
      goCreate () {
        this.$router.push({
          name: 'createCommunity',
          params: {id: 0}
        })
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
        if (localStorage.getItem('paasName') !== 'FL' && localStorage.getItem('paasName')) {
          this.$router.push({name: 'home'})
        } else {
          this.$router.push({name: 'communityHome'})
        }
      },
      goPlaza () {
        this.$router.push({name: 'plaza'})
      },
      goToDetailClass (item) {
        this.$router.push({
          path: `communityClass/${item.id}`
        })
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
      getKeywords () {
        let vm = this
        vm.$http.get(`/official/keywords`).then(({data}) => {
          this.hotKeywords = data.hot_keywords
          console.log(this.hotKeywords)
        }).catch((error) => {
          console.log(error)
        })
      },
      getOrderList (page, mescroll) {
        $loadingShow('搜索中...')
        let vm = this
        vm.$http.get(`/official/search/community/and/group?keyword=${vm.search}`).then(({data}) => {
          vm.list = data.communities
          vm.groups = data.groups
          if (vm.list.length === 0 && vm.groups.length === 0) {
            vm.init = true
          }
          $loadingHide()
        }).catch((error) => {
          console.log(error)
          $loadingHide()
        })
      }
    },
    mounted () {
      this.getKeywords()
      if (localStorage.getItem('serachList')) {
        this.serachList = JSON.parse(localStorage.getItem('serachList')).list
      }
    }
  }
</script>

<style lang="less" scoped>
  .scrollView {
    background: white;
  }

  .main-dost {
    margin: 22px 32px;
    height: 1px;
    background: #f7f7f7;
  }

  .main-search-box {
    .main-title {
      padding: 22px 32px;

      img {
        width: 42px;
      }

      .image {
        width: 32px;
      }
    }

    .main-list {
      margin: 0 32px;

      .item {
        padding: 10px 18px;
        background: #f1f1f1;
        display: inline-block;
        margin-right: 16px;
        margin-top: 12px;
        border-radius: 6px;
      }
    }
  }
  .main-listV {
    text-align: center;
    .item {
      padding: 10px 18px;
      background: #f1f1f1;
      display: inline-block;
      margin-right: 16px;
      margin-top: 12px;
      border-radius: 6px;
    }
  }

  .main-input {
    width: 78vw;
    background: #f1f1f1;
    margin: 28px auto;
    padding: 0 52px;
    border-radius: 12px;
    position: relative;

    &:after {
      content: '';
      width: 42px;
      height: 42px;
      position: absolute;
      left: 6px;
      top: 12px;
      background-image: url("https://images.ufutx.com/201907/20/de514ca726d16a399ab2a10f426929b2.png");
      background-size: contain;
      background-repeat: no-repeat;
    }

    .cancel {
      content: '';
      width: 42px;
      height: 42px;
      position: absolute;
      right: 10px;
      top: 14px;
      background-image: url("https://images.ufutx.com/201908/07/c0283afbab7d3078c3393c3a69916d70.png");
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

    input {
      background: none;
      border: none;
      width: 100%;
      height: 62px;
      padding-top: 2px;
    }
  }

  .main-creation {
    overflow: hidden;
    padding: 36px 28px;

    img {
      width: 90px;
      height: 90px;
      margin-right: 22px;
      border-radius: 50%;
    }

    p {
      margin-top: 8px;
    }

    .infor {
      width: 82%;
    }
  }

  .bc_num {
    background: #f6f6f6;
    padding: 4px 28px;
    margin-top: 22px;
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

      .logo {
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

  .main-float {
    background: #ffffff;

    .home_, .share_ {
      border: 1px solid #f0f0f0;
      width: 150px;
      padding: 8px 12px;
      position: fixed;
      padding-bottom: 0;
      bottom: 20%;
      right: 0;
      border-bottom-left-radius: 6px;
      border-top-left-radius: 6px;

      img {
        width: 48px;
        vertical-align: middle;
        margin-bottom: 10px;
      }
    }

    .share_ {
      width: 26vw;
      animation: shareMove 800ms linear;
      animation-fill-mode: forwards;
      @keyframes shareMove {
        from {
          right: -26vw;
        }
        to {
          right: 0;
        }
      }
    }

    .home_ {
      width: 22vw;
      bottom: 14%;
      overflow: hidden;
      animation: homeMove 900ms linear;
      animation-fill-mode: forwards;
      @keyframes homeMove {
        from {
          right: -22vw;
        }
        to {
          right: 0;
        }
      }
    }
  }

  .vessel {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, .7);

    .close {
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
