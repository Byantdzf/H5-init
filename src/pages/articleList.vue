<template>
  <div class="main">
    <div class="mainSearch">
      <div class="search">
        <img src="https://images.ufutx.com/202002/29/72c633341b03a93a2461d365f6e498c8.png" class="icon" alt="">
        <input type="text" placeholder="搜索文章" class="font28">
      </div>
    </div>

    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" class="scrollView">
      <div class="newMsg" v-for="item,index in list" :key="index">
        <div class="title flo_l">
          <p class="bold font28 color3 ellipsis_2">{{item.title}}</p>
          <span class="color6 font26 time">{{item.updateTime}}</span>
        </div>
        <div class="image flo_r" v-bind:style="{backgroundImage:'url(' + item.pic + ')'}"></div>
      </div>
      <!--<div id="box"></div>-->
      <!--<div class="text-center search-box">-->
      <!--<input type="text" class="homeSearch text-center" v-model="search" placeholder="请搜索Ta的名字">-->
      <!--</div>-->
<!--      <div class="search-center ff" style="padding: 58px 16px 12px 16px;">-->
<!--        <p class="search-item font26" v-if="searchCity !== '不限' && searchCity">-->
<!--          区域：{{searchCity}}-->
<!--          <img src="https://images.ufutx.com/201904/10/d8cecc5068634f6e89316c57b93b5ce3.png" alt=""-->
<!--               @click="del('searchCity')">-->
<!--        </p>-->
<!--        <p class="search-item font26" v-if="searchType !== '不限' && searchType">-->
<!--          人群：{{searchType}}-->
<!--          &lt;!&ndash;<img src="https://images.ufutx.com/201904/10/d8cecc5068634f6e89316c57b93b5ce3.png" alt="" @click="del('searchType')">&ndash;&gt;-->
<!--        </p>-->
<!--        <p class="search-item font26" v-if="searchAge !== '不限' && searchAge">-->
<!--          年龄：{{searchAge}}-->
<!--          &lt;!&ndash;<img src="https://images.ufutx.com/201904/10/d8cecc5068634f6e89316c57b93b5ce3.png" alt="" @click="del('searchAge')">&ndash;&gt;-->
<!--        </p>-->
<!--      </div>-->
<!--      <div class="height160"></div>-->
<!--      <div class="list-item" v-for="item in list" @click="routeToDetail(item.type, item.id)">-->
<!--        <div class="image" v-bind:style="{backgroundImage:'url(' + item.photo + ')'}"></div>-->
<!--        <p style="margin-top: 8px;">-->
<!--          <span class="font32">{{item.name}}</span>-->
<!--          <span class="font20 colorb">{{item.age? '· ' +item.age : ''}} {{item.stature? '· ' +item.stature +'cm': ''}} {{item.city? '· '+item.city: ''}}</span>-->
<!--        </p>-->
<!--        <p class="font26 color6 ellipsis_1" style="margin-top: 4px">{{item.introduction}}</p>-->
<!--      </div>-->
      <!--<div style="background: #f9f9f9;width: 80%;padding: 6px;margin: 40px auto;" class="text-center color6">没有搜索结果...</div>-->
    </mescroll-vue>
  </div>
</template>

<script>
  import {TransferDom, Popup, XInput, Search} from 'vux'
  import MescrollVue from 'mescroll.js/mescroll.vue'
  import {$loadingShow, $loadingHide, $toastText} from '../config/util'

  export default {
    directives: {
      TransferDom
    },
    components: {
      XInput,
      Search,
      Popup,
      MescrollVue
    },
    data () {
      return {
        value: '',
        search: '',
        announcements: [],
        type: '',
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
        arr: [],
        list: []
      }
    },
    watch: {
      searchArray () {
        console.log(this.searchArray.searchType)
      }
    },
    methods: {
      searchSave () { // 确定search
        $loadingShow('配对中...')
        for (let item in this.searchArray) {
          this[item] = this.searchArray[item]
        }
        this.getOrderList(1)
        this.showSearch = !this.showSearch
      },
      searchUser () { // 输入框搜索
        this.getOrderList(1)
      },
      routeToDetail (type, id) { // 跳转
        if (type === 'single') {
          this.$router.push({name: 'information', params: {id: id}})
        } else {
          this.$router.push({name: 'introducer', params: {id: id}})
        }
      },
      mescrollInit (mescroll) {
        this.mescroll = mescroll
      },
      getOrderList (page, mescroll) { // 获取数据
        let pageV = 1
        pageV = page.num
        if (!page.num) {
          pageV = 1
        }
        let vm = this
        // /pc/user/article/list?_=0.034559870112123026&type=3&terminal=2&pageSize=10&pageNo=1
        vm.$http.get(`/pc/user/article/list?_=0.034559870112123026&type=${this.type}&terminal=2&pageSize=10&pageNo=${pageV}`).then(({data}) => {
          let dataV = pageV === 1 ? [] : vm.list
          console.log(data)
          dataV.push(...data.list)
          vm.list = dataV
          if (mescroll) {
            vm.$nextTick(() => {
              mescroll.endSuccess(data.list.length)
            })
          }
          if (vm.list.length < 1) $toastText('很抱歉！暂时没有搜索到对象')
          $loadingHide()
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    mounted () {
      if (this.$store.state.intercept === 'true') {
        return false
      }
      console.log(this.$route.query.type)
      this.type = this.$route.query.type
    }
  }
</script>

<style lang="less" scoped>
  body {
    background: #f7f7f7 !important;
  }
  .main{
    min-height: 100vh;
    background: white !important;
    position: relative;
  }
  .mainSearch{
    border-bottom: 4px solid #f7f8fa;
    padding: 22px 32px;
    .search{
      background: #f7f8fa;
      margin: auto;
      padding: 8px 16px;
      border-radius: 32px;
      input{
        background: #f7f8fa;
        border: none;
        width: 86%;
        height: 100%;
      }
      .icon{
        width: 32px;
        height: 32px;
        margin-bottom: -5px;
      }
    }
    position: relative;
  }
  .scrollView{
    margin-top: 120px;
    height: inherit;
  }
  .newMsg{
    padding: 14px 32px;
    overflow: hidden;
    border-bottom: 1px solid #eaebee;
    .image{
      width: 38%;
      height: 140px;
      background-size: cover;
    }
    .title{
      width: 62%;
      height: 140px;
      position: relative;
      p{padding-right: 12px;}
      .time {
        position: absolute;
        left: 0;
        bottom: 8px;
      }
    }
  }
</style>
