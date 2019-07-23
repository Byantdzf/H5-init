<template>
  <div class="homepage">
    <!--介绍人-->
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" class="scrollView">
      <div class="introducer" v-for="item of list">
        <div class="data"  @click="routeToDetail(item.type, item.id)">
          <div class="picture" v-bind:style="{backgroundImage:'url(' + item.photo + ')'}" ></div>
          <span class="time">{{item.created_at}}</span>
          <div class="particulars_and_parameter">
            <div class="data_particulars">
              <span class="data_name">{{item.name}}</span>
              <!--<span class="data_title">介绍人</span>-->
              <!--<img class="icon_crown" src="https://images.ufutx.com/201904/02/6e9d7b41f9ff9ec9588d0a7f910deb02.png" alt="">-->
              <!--<span class="crown_region">市级VIP</span>-->
            </div>
            <!--<div class="data_parameter">31岁 · 175cm · 深圳</div>-->
          </div>
        </div>
      </div>
    </mescroll-vue>
  </div>
</template>

<script>
  import MescrollVue from 'mescroll.js/mescroll.vue'
  export default {
    name: 'myFriend',
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
        if (type === 'single') {
          this.$router.push({name: 'information', params: {id: id}})
        } else {
          this.$router.push({name: 'introducer', params: {id: id}})
        }
      },
      mescrollInit (mescroll) {
        this.mescroll = mescroll
      },
      getList (page, mescroll) {
        let url = ''
        if (this.type === 'fans') {
          url = `/official/followers?page=${page.num}`
        } else if (this.type === 'friend') {
          url = `/official/friends?page=${page.num}`
        } else {
          url = `/official/followings?page=${page.num}`
        }
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
      console.log(this.type)
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
  .icon_crown{
    width: 28px;
    margin-left: 2px;
    vertical-align: middle;
  }
  .crown_region{
    font-size: 20px;
    margin-left: -4px;
  }
  .data_parameter{
    font-size: 26px;
    color: #c0c0c0;
    margin-top: 12px;
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
</style>
