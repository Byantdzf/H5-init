<template>
  <div class="homepage">
    <!--介绍人-->
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" class="scrollView">
      <div class="introducer" v-for="item of listV2">
        <div class="data"  @click="routeToDetail(item.type, item.other_user_id)">
          <div class="picture" v-bind:style="{backgroundImage:'url(' + item.icon + ')'}" ></div>
          <div class="particulars_and_parameter">
            <div class="data_particulars">
              <p class="data_name bold color6 ellipsis_1 inline-block">{{item.name}}</p>
              <span class="time">{{item.created_at}}</span>
              <div class="data_parameter colorbe ellipsis_1 font26">{{item.content}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="introducer" v-for="item of list">
        <div class="data"  @click="routeToDetail(item.type, item.other_user_id)">
          <div class="picture" v-bind:style="{backgroundImage:'url(' + item.other_user.photo + ')'}" ></div>
          <div class="particulars_and_parameter">
            <div class="data_particulars">
              <p class="data_name bold color6 ellipsis_1 inline-block">{{item.other_user.name}}</p>
              <span class="time">{{item.created_at}}</span>
              <div class="data_parameter colorbe ellipsis_1 font26">{{item.last_message.content}}</div>
            </div>
          </div>
        </div>
      </div>
    </mescroll-vue>
  </div>
</template>

<script>
  import MescrollVue from 'mescroll.js/mescroll.vue'
  export default {
    name: 'chatList',
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
        list: [],
        listV2: []
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
      getList (page, mescroll) {
        let url = `/message/linkmen/v2?page=${page.num}`
        this.$http.get(url).then(({data}) => {
          let {chat, notice} = data
          let dataV = page.num === 1 ? [] : this.list
          dataV.push(...data.linkmen.data)
          this.list = dataV
          this.$nextTick(() => {
            mescroll.endSuccess(data.linkmen.data.length)
          })
          this.listV2.push({
            icon: 'http://images.ufutx.com/201905/24/2a8b1b56565df18e7ad8e3e4d7554629.png',
            content: chat.content,
            created_at: chat.created_at,
            name: '福恋小助手'
          },{
            icon: 'http://images.ufutx.com/201905/24/ee6e88b5d0ce3911300a04f028284bf1.png',
            content: notice.content,
            created_at: notice.created_at,
            name: '系统通知'
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
  .data_particulars{
  }
  .data_name{
    width: 40%;
    font-size: 28px;
  }
  .particulars_and_parameter{
    padding: 16px;
    float: left;
    width: 80%;
  }
  .time{
    font-size: 26px;
    color: #c0c0c0;
    float: right;
    margin-top: 6px;
  }
  .picture{
    width: 100px;
    height: 100px;
    border-radius: 50%;
    float: left;
    background-size: cover;
    background-repeat: no-repeat;
    margin-top: 12px;
  }
  .data_parameter{
    margin-top: 12px;
  }
</style>
