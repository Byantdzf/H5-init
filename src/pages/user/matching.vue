<template>
  <div>
    <div class="tab" v-cloak>
      <div>
        <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" class="scrollView" >
          <div class="z_box">
            <div class="list-item" v-for="item in list" @click="$router.push({path: `/information/${item.user_id}`})">
              <div class="image" v-bind:style="{backgroundImage:'url(' + item.photo + '?x-oss-process=style/scale1' + ')'}"></div>
              <p style="margin-top: 8px;overflow: hidden">
                <span class="font32 text_name flo_l">{{item.name}}</span>
                <span class="font20 colorb flo_l text_data">{{item.sex ? item.sex : ''}} {{item.age? item.age + '岁': ''}} {{item.belief ? item.belief : ''}} {{item.stature ? item.stature + 'cm' : ''}} {{item.degree ? item.degree: ''}} {{item.province ? item.province : ''}} {{item.city ? item.city : ''}}</span>
              </p>
              <p class="font26 color6 ellipsis_1" style="margin-top: 4px">{{item.introduction}}</p>
            </div>
          </div>
        </mescroll-vue>
      </div>
    </div>
  </div>
</template>

<script>
  import {Group, Cell, XHeader, Swiper, XInput, Search, SwiperItem} from 'vux'
  import MescrollVue from 'mescroll.js/mescroll.vue'
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
        option: 'auto',
        skyblue: 'skyblue',
        pink: 'pink',
        mobile: 0,
        number: 0,
        init: false,
        id: '',
        noData: false,
        showList: 'false',
        listNum: 1,
        page: 1,
        paas: '',
        mescroll: null, //  mescroll实例对象
        mescrollDown: {}, // 下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
        mescrollUp: { // 上拉加载的配置.
          callback: this.matchingRates, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
          // 以下是一些常用的配置,当然不写也可以的.
          page: {
            num: 0, // 当前页 默认0,回调之前会加1; 即callback(page)会从1开始
            size: 15 // 每页数据条数,默认10
          },
          // htmlLoading: '<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip">加载中..</p>' // 上拉加载中的布局
          htmlNodata: '<p class="upwarp-nodata" v-if="list.length > 0">-- 暂无更多 --</p>' // 无数据的布局
        },
        list: [],
        type: '',
        showmobile: false,
        showScan: false
      }
    },
    watch: {
    },
    methods: {
      swiperItem (currentIndex) {
        this.currentIndex = currentIndex
      },
      // routeToDetail (type, id) {
      //   if (type === 'single') {
      //     this.$router.push({name: 'information', params: {id: id}})
      //   } else {
      //     this.$router.push({name: 'introducer', params: {id: id}})
      //   }
      // },
      mescrollInit (mescroll) {
        this.mescroll = mescroll
      },
      getMessageNum () {
        this.$http.get(`/official/notice/num`).then(({data}) => {
          localStorage.setItem('chat_num', data.chat_message_num.toString())
          localStorage.setItem('notice_num', data.notice_num.toString())
        })
      },
      matchingRates (page, mescroll) {
        let vm = this
        this.$http.get(`/official/users/` + vm.id + `/recommend/linkings?page=${page.num}&type=${this.option}`).then(({data}) => {
          console.log(data, '456')
          vm.init = true
          this.list = page.num === 1 ? [] : this.list
          if (data.data) {
            let result = data.data
            let list = result.map((item) => {
              return {
                name: item.other_user.name,
                photo: item.other_user.photo,
                age: item.other_user.profile_courtship.age,
                degree: item.other_user.profile_courtship.degree,
                user_id: item.other_user.profile_courtship.user_id,
                province: item.other_user.profile_courtship.province,
                city: item.other_user.profile_courtship.city,
                belief: item.other_user.profile_courtship.belief,
                stature: item.other_user.profile_courtship.stature,
                sex: item.other_user.profile_courtship.sex === '1' ? '男' : '女',
                introduction: item.other_user.profile_courtship.introduction
              }
            })
            console.log(list, '123')
            this.list.push(...list)
          }
          if (this.list.length === 0) {
            this.listNum = 0
          }
          // $loadingHide(false)
          vm.$nextTick(() => {
            mescroll.endSuccess(data.data ? data.data : 1)
          })
        })
      }
    },
    mounted () {
      this.id = this.$route.params.id
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
  .scrollView{
    height: 95%;
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
    margin-top: 30px;
    margin-left: 22px;
    margin-bottom: 30px;
    font-family: '楷体';
    text-align: center
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
  .text_name{
    max-width: 100px;
    margin-right: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .text_data{
    margin-top: 6px;
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
      padding: 22px;
      border-radius: 10px;
      box-shadow: 1px 1px 12px #e4e4e4;
    }
    .z_not{
      margin: auto;
      width: 500px;
      margin-top: 60%;
      padding: 22px;
      border-radius: 10px;
    }
    .content{
      margin-top: 45px;
      font-size: 36px;
      font-family: '楷体';
      text-align: center;
    }
  }
  .z_height{
    .z_img{
      width: 100vw;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
    }
  }
  .matching{
    width: 100%;
    text-align: center;
    font-weight: bold;
    font-size: 60px;
    color: #666666;
    position: absolute;
    top: 5%;
  }
  .z_text{
    width: 100%;
    position: absolute;
    top: 22%;
    text-align: center;
    input {
      width: 500px;
      height: 54px;
      outline: none ;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
    .btn_matching{
      width: 130px;
      height: 54px;
      display: block;
      margin: auto;
      color: #ffffff;
      margin-top: 20px;
      border: none;
      border-radius: 6px;
      background-color: #4CAF50;
    }
  }

  .tab{
    /*border-bottom: 1px solid #D92553;*/
  }
  .btn{
    display: inline-block;
    text-align: center;
    border-bottom: 1px solid #D92553;
    line-height: 80px;
    font-weight: bold;
    width: 50%;
    height: 80px;
  }
  .tab button:nth-of-type(3)::after{
    content: "";
    clear: both;
  }
  .z_content{
  }
  [v-cloak]{
    display: none;
  }
  .active{
    color:#fff;
    background: #D92553;
  }
</style>
