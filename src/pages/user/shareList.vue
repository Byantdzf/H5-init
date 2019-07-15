<template>
  <div class="homepage">
    <!--介绍人-->
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" class="scrollView">
      <!--<div class="introducer" v-for="item of list">-->
        <!--<div class="data"  @click="routeToDetail(item.type, item.other_user_id)">-->
          <!--<div class="picture" v-bind:style="{backgroundImage:'url(' + item.user.avatar + ')'}" ></div>-->
          <!--<span class="time">{{item.created_at}}</span>-->
          <!--<div class="particulars_and_parameter">-->
            <!--<div class="data_particulars">-->
              <!--<span class="data_name">{{item.user.name}}</span>-->
              <!--&lt;!&ndash;<span class="data_title">介绍人</span>&ndash;&gt;-->
              <!--&lt;!&ndash;<img class="icon_crown" src="https://images.ufutx.com/201904/02/6e9d7b41f9ff9ec9588d0a7f910deb02.png" alt="">&ndash;&gt;-->
              <!--&lt;!&ndash;<span class="crown_region">市级VIP</span>&ndash;&gt;-->
            <!--</div>-->
            <!--<div class="data_parameter colorbe ellipsis_1">{{item.last_message.content}}</div>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
      <div v-for="item,index in list" :key="index">
        <div class="main-box">
          <!--<div class="main-photo flo_l"></div>-->
          <div class="main-user flo_l">
            <p class="user-name "><span class="font28">红包类型：</span>
              <span class="colorTheme bold font32" v-if="item.type == 'REGISTER'">注册</span>
              <span class="colorTheme bold font32" v-else>分享</span>
            </p>
            <p class="user-time font22 colorb0">{{item.created_at}}</p>
          </div>
          <div class="main-money flo_r">
            <span class="font36 bold">+{{item.amount}}</span>
            <span class="font26">元</span>
            <p class="main-pain weui-icon-safe-success" v-if="item.err_code == 'SUCCESS'">领取成功</p>
            <p class="main-pain weui-icon-back" v-else @click="lookPlan(item.return_msg)">查看进度</p>
          </div>
        </div>
      </div>
    </mescroll-vue>
  </div>
</template>

<script>
  import {$toastWarn} from '../../../src/config/util'
  import MescrollVue from 'mescroll.js/mescroll.vue'
  export default {
    name: 'shareList',
    components: {
      MescrollVue
    },
    data () {
      return {
        type: '',
        mescroll: null, //  mescroll实例对象
        mescrollDown: {}, // 下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
        mescrollUp: { // 上拉加载的配置.
          callback: this.getList, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
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
      routeToDetail (type, id) {
        // if (type === 'single') {
        //   this.$router.push({name: 'information', params: {id: id}})
        // } else {
        //   this.$router.push({name: 'introducer', params: {id: id}})
        // }
        this.$router.push({name: 'chitchatDetail', params: {id: id}})
      },
      mescrollInit (mescroll) {
        this.mescroll = mescroll
      },
      lookPlan (msg) {
        $toastWarn(msg)
      },
      getList (page, mescroll) {
        let url = `/official/users/red/packets?page=${page.num}`
        this.$http.get(url).then(({data}) => {
          let dataV = page.num === 1 ? [] : this.list
          dataV.push(...data.data)
          this.list = dataV
          this.$nextTick(() => {
            mescroll.endSuccess(data.data.length)
          })
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    mounted () {
      this.type = this.$route.params.type
    }
  }
</script>

<style scoped lang="less">
  .introducer{
    width: 690px;
    padding: 26px 30px 0px 30px;
  }
  .data{
    overflow: hidden;
    border-bottom: 4px solid #f0f0f0;
    padding-bottom: 22px;
  }
  .data_name{
    font-size: 30px;
  }
  .particulars_and_parameter{
    padding: 16px;
    float: left;
  }
  .time{
    font-size: 26px;
    color: #c0c0c0;
    float: right;
    margin-top: 6px;
  }
  .picture{
    width: 120px;
    height: 120px;
    border-radius: 50%;
    float: left;
    background-size: cover;
    background-repeat: no-repeat;
  }
  .main-box{
    padding: 12px 32px;
    overflow: hidden;
    border-bottom: 1px solid #b0b0b0;
    .main-photo{
      width: 100px;
      height: 100px;
      background-image: url("https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2884107401,3797902000&fm=27&gp=0.jpg");
      background-repeat: no-repeat;
      background-size: contain;
      border-radius: 50%;
      margin-right: 12px;
    }
    .main-user{
      width: 50%;
      .user-name{
        margin-top: 8px;
      }
      .user-time{
        margin-top: 12px;
      }
    }
    .main-money{
      color: #D82653;
      .main-pain{
        margin-top: 8px;
        padding: 2px 6px;
        /*border: 1px solid #D82653;*/
        border-radius: 8px;
        font-size: 18px;
      }
      p{
        display: block;
      }
    }
    [class*=" weui-icon-"]:before, [class^=weui-icon-]:before {
      vertical-align: middle;
      margin-bottom: 0.3em;
      font-size: 12px;
    }

  }
</style>
