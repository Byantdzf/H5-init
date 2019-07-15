<template>
  <div id="activity">
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" class="scrollView">
      <div class="list-item" v-for="item in list" @click="gotoDetail(item.id)">
        <!--<router-link :to="{name:'activityDetail',params:{id:1}}">-->
          <div class="bc_date font26 theme_clo">
            {{item.created_at}}
            <img src="../assets/icon/go.png" alt="icon" class="icon flo_r">
          </div>
           <!--<x-img class="image" :src="item.poster" default-src=""></x-img>-->
          <div class="image backCover" v-bind:style="{backgroundImage:'url(' + item.poster + ')'}" ></div>
          <p class="font30 color6 name">{{item.theme}}</p>
        <!--</router-link>-->
      </div>
      <div class="height160"></div>
    </mescroll-vue>
  </div>
</template>

<script>
  import { Group, Cell, XHeader, XInput } from 'vux'
  import MescrollVue from 'mescroll.js/mescroll.vue'

  export default {
    name: 'activity',
    components: {
      Group,
      Cell,
      XHeader,
      XInput,
      MescrollVue
    },
    data () {
      return {
        value: '',
        search: '',
        mescroll: null, //  mescroll实例对象
        mescrollDown: {}, // 下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
        mescrollUp: { // 上拉加载的配置.
          callback: this.getOrderList, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
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
        this.$http.get(`/official/activities?page=${page.num}`).then(({data}) => {
          let dataV = page.num === 1 ? [] : this.list
          dataV.push(...data.data)
          this.list = dataV
          this.$nextTick(() => {
            mescroll.endSuccess(data.data.length)
          })
          this.getMessageNum()
          console.log(data)
        }).catch((error) => {
          console.log(error)
        })
      },
      gotoDetail (id) {
        if (localStorage.getItem('official_openid') || this.$isWeiXin() === false) {
          this.$router.push({name: 'activityDetail', params: {id: id}})
        } else {
          window.location.href = 'https://love.ufutx.com/wx/bind?mobile=' + localStorage.getItem('mobile') + `&type=activity&activity_id=${id}`
        }
      }
    },
    mounted () {
      console.log(this.$store.state.route)
      console.log(this.$store.state.data)
    }
  }
</script>

<style  lang="less" scoped>
  body{
    background: #f7f7f7 !important;
  }
  .search-box{
    margin:22px 0;
    .homeSearch{
      width: 690px;
      height: 88px;
      border-radius: 6px;
      border: none;
      box-shadow: 1px 1px 12px #e9e9e9;
    }
  }
  .list-item{
    width: 646px;
    padding: 30px;
    margin: auto;
    border-radius: 10px;
    background: white;
    margin-top: 22px;
    box-shadow: -1px 8px 18px #dadada;
    margin-bottom: 30px;
    .bc_date{
      border-bottom: 4px solid #ececec;
      padding-bottom: 30px;
      margin-bottom: 30px;
      /*color: #6f6f6f;*/
    }
    .image{
      width: 646px;
      height: 328px;
      background-size: cover;
      background-repeat: no-repeat;
    }
    .name{
      margin-top: 30px;
    }
    .icon{
      width: 26px;
      margin-top: 8px;
    }
  }
</style>
