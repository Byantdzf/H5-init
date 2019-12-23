<template>
  <div>
    <Search placeholder="请搜索Ta的名字" v-model="search" @on-change="searchUser" @auto-scroll-to-top="true"
            position="absolute">
      <img slot="right" class="bc_search" src="https://images.ufutx.com/201904/10/da5d9f0ce577935d39864a7a348d3c0d.png"
           @click="showSearch = !showSearch" alt="">
    </Search>

    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" class="scrollView">
      <!--<div id="box"></div>-->
      <!--<div class="text-center search-box">-->
      <!--<input type="text" class="homeSearch text-center" v-model="search" placeholder="请搜索Ta的名字">-->
      <!--</div>-->
      <div class="search-center ff" style="padding: 58px 16px 12px 16px;">
        <p class="search-item font26" v-if="searchCity !== '不限' && searchCity">
          区域：{{searchCity}}
          <img src="https://images.ufutx.com/201904/10/d8cecc5068634f6e89316c57b93b5ce3.png" alt=""
               @click="del('searchCity')">
        </p>
        <p class="search-item font26" v-if="searchType !== '不限' && searchType">
          人群：{{searchType}}
          <!--<img src="https://images.ufutx.com/201904/10/d8cecc5068634f6e89316c57b93b5ce3.png" alt="" @click="del('searchType')">-->
        </p>
        <p class="search-item font26" v-if="searchAge !== '不限' && searchAge">
          年龄：{{searchAge}}
          <!--<img src="https://images.ufutx.com/201904/10/d8cecc5068634f6e89316c57b93b5ce3.png" alt="" @click="del('searchAge')">-->
        </p>
      </div>
      <div class="height160"></div>
      <div class="list-item" v-for="item in list" @click="routeToDetail(item.type, item.id)">
        <div class="image" v-bind:style="{backgroundImage:'url(' + item.photo + ')'}"></div>
        <p style="margin-top: 8px;">
          <span class="font32">{{item.name}}</span>
          <span class="font20 colorb">{{item.age? '· ' +item.age : ''}} {{item.stature? '· ' +item.stature +'cm': ''}} {{item.city? '· '+item.city: ''}}</span>
        </p>
        <p class="font26 color6 ellipsis_1" style="margin-top: 4px">{{item.introduction}}</p>
      </div>
      <!--<div style="background: #f9f9f9;width: 80%;padding: 6px;margin: 40px auto;" class="text-center color6">没有搜索结果...</div>-->
    </mescroll-vue>
    <div v-transfer-dom>
      <popup v-model="showSearch" position="right" width="70%">
        <div class="position-horizontal-demo">
          <div class="SearchCenter">
            <!--<div class="SearchCenter-item">-->
            <!--<p class="font28 bold">区域筛选</p>-->
            <!--<p class="SearchCenter-item-text font26 inline-block searchActive">不限</p>-->
            <!--<p class="SearchCenter-item-text font26 inline-block">选择...</p>-->
            <!--</div>-->
            <div class="SearchCenter-item">
              <p class="font28 bold">人群筛选</p>
              <p class="SearchCenter-item-text font26 inline-block" :class="{'searchActive':item.active}"
                 v-for="(item,index) in typeArray" @click="selectText('typeArray','searchType', index)">
                {{item.title}}</p>
            </div>
            <div class="SearchCenter-item">
              <p class="font28 bold">年龄筛选</p>
              <p class="SearchCenter-item-text font26 inline-block" :class="{'searchActive':item.active}"
                 v-for="(item,index) in ageArray" @click="selectText('ageArray','searchAge', index)">{{item.title}}</p>
            </div>
          </div>
          <div class="submit">
            <p style="width: 49%" class="inline-block reset" @click="reset">取消</p>
            <p style="width: 49%" class="flo_r" @click="searchSave">确定</p>
          </div>
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
  import {TransferDom, Popup, XInput, Search} from 'vux'
  import MescrollVue from 'mescroll.js/mescroll.vue'
  import {$loadingShow, $loadingHide, $toastText} from '../../config/util'

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
        init: false,
        showSearch: false,
        recommend: [],
        noData: false,
        searchArray: {},
        searchCity: '不限',
        searchAge: '不限',
        ageArray: [
          {title: '不限', type: '不限', active: true},
          {title: '00后', type: '00后', active: false},
          {title: '90后', type: '90后', active: false},
          {title: '80后', type: '80后', active: false},
          {title: '70后', type: '70后', active: false},
          {title: '60后', type: '60后', active: false},
          {title: '50后', type: '50后', active: false}
        ],
        searchType: '不限',
        searchTypeV2: '不限',
        typeArray: [
          {title: '不限', type: '不限', active: true},
          {title: '良人', type: 'single_man', active: false},
          {title: '佳偶', type: 'single_woman', active: false},
          {title: '红娘', type: 'maker', active: false},
          {title: '介绍人', type: 'marriage', active: false}
        ],
        page: 1,
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
      del (name) {
        this[name] = '不限'
        this.searchTypeV2 = '不限'
        this.getOrderList(1)
      },
      reset () {
        this.showSearch = !this.showSearch
      },
      searchSave () { // 确定search
        $loadingShow('配对中...')
        for (let item in this.searchArray) {
          this[item] = this.searchArray[item]
        }
        this.getOrderList(1)
        this.showSearch = !this.showSearch
      },
      selectText (type, name, index) { // 选择筛选内容
        for (let item of this[type]) {
          item.active = false
        }
        if (name === 'searchAge') {
          this.arr[name] = this[type][index].title
        } else {
          this.arr[name] = this[type][index].title
        }
        this[type][index].active = true
        this.searchArray = this.arr
        if (this.searchArray.searchType) {
          for (let item of this.typeArray) {
            if (item.title === this.searchArray.searchType) {
              this.searchTypeV2 = item.type
            }
          }
        }
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
        vm.$http.get(`/official/users?keyword=${this.search}&page=${pageV}&city=${vm.searchCity}&age=${vm.searchAge}&type=${vm.searchTypeV2}`).then(({data}) => {
          let dataV = pageV === 1 ? [] : vm.list
          dataV.push(...data.data)
          vm.list = dataV
          if (mescroll) {
            vm.$nextTick(() => {
              mescroll.endSuccess(data.data.length)
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
    }
  }
</script>

<style lang="less" scoped>
  body {
    background: #f7f7f7 !important;
  }

  .vux-demo {
    text-align: center;
  }

  .logo {
    width: 100px;
    height: 100px
  }

  .search-box {
    margin: 22px 0;

    .homeSearch {
      width: 690px;
      height: 88px;
      border-radius: 6px;
      border: none;
      box-shadow: 1px 1px 12px #e9e9e9;
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
      color: white;
    }
  }

  .list-item {
    width: 646px;
    padding: 22px;
    margin: auto;
    border-radius: 10px;
    background: white;
    margin-top: 32px;
    box-shadow: -1px 8px 18px #dadada;
    margin-bottom: 26px;

    .image {
      width: 100%;
      height: 646px;
      background-repeat: no-repeat;
      background-size: cover;
    }
  }

  .image {
    width: 100%;
    height: 646px;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .bc_search {
    width: 48px;
    height: 48px;
    margin-left: 12px;
    margin-top: 6px;
  }

  .weui-search-bar, .vux-search-box {
    position: fixed !important;
    z-index: 9999;
  }

  .search-center {
    padding: 100px 32px 22px 32px;
    border-bottom: 4px solid #f9f9f9;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    box-shadow: 0 0 18px #dedede;

    .search-item {
      background: #EFEFF4;
      float: left;
      padding: 6px 10px 6px 12px;
      border-radius: 4px;
      margin-right: 10px;

      img {
        width: 26px;
        margin-bottom: -2px;
      }
    }
  }

  .SearchCenter {
    padding: 42px 12px 0 22px;

    .SearchCenter-item {
      margin-top: 42px;

      .SearchCenter-item-text {
        margin: 22px 8px 0 8px;
        padding: 6px 22px;
        border-radius: 6px;
        border: 1px solid #bbbbbb;
      }
    }
  }

  .submit {
    height: 105px;
    line-height: 105px;
    text-align: center;
    font-size: 34px;
    color: #fffffd;
    background-color: #344a5d;
    position: fixed;
    bottom: 0;
    width: 70%;
    letter-spacing: 3px;

    .reset {
      position: relative;

      &:before {
        content: '';
        width: 1px;
        height: 62px;
        position: absolute;
        top: 22px;
        right: 0;
        background: #f6f6f6;
      }
    }
  }

  .searchActive {
    border-color: #35495e;
    color: #35495e;
    position: relative;
    box-shadow: 1px 1px 12px #d2d2d2;

    &:after {
      content: '';
      background-image: url("https://images.ufutx.com/201904/10/648e9cb095bb9b34c0035226b0f7aa71.png");
      background-repeat: no-repeat;
      background-size: cover;
      width: 30px;
      height: 30px;
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }

</style>
