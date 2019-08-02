<template>
  <div>
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" class="scrollView">
      <div>
        <div class="text-center main-search" @click="showSearchType = true">
          <div class="font32 color6">
            {{searchText}}
            <img src="http://images.ufutx.com/201906/27/16c7dfb515bf50f00bc931d11d7f04a9.png" class="icon-down" alt="">
          </div>
          <img src="http://images.ufutx.com/201906/27/1380d8f68a7f81f3a08a92a84cab4c0e.png" class="flo_r friendEdit"
               alt="" @click.stop="$router.push({name: 'friendCircleEdit'})">
        </div>
        <div v-for="item,index in list" class="main-box">
          <div class="main-info colorff">
            <div class="info-user text-center">
              <div class="photo" @click.stop="routeToDetail(item.user.type, item.user_id)">
                <div class="img" v-bind:style="{backgroundImage:'url(' + item.photo + ')'}"></div>
              </div>
            </div>
            <div class="info-user info-text" @click="$router.push({path: `/friendCircleDetail/${item.id}`})">
              <div class="font28 title color6">
                {{item.user.name}}
                <img src="http://images.ufutx.com/201902/21/7b3892dcf60fabda05add35abfa9aec3.png" v-if="item.user.sex === 2" alt="" class="sex-icon">
                <img src="http://images.ufutx.com/201902/21/a309744e67082c4bd46db0df504c32c5.png" v-else alt="" class="sex-icon">
              </div>
              <div class="font22 intro colorb0">{{item.user.age}} · {{item.user.city}}
                <span  v-if="item.user.type === 'single'"> · 单身</span>
                <span  v-else> · 介绍人</span>
              </div>
            </div>
            <div class="clearfloat"></div>
            <div class="font28 content color6"  @click="$router.push({path: `/friendCircleDetail/${item.id}`})">{{item.content}}</div>
            <div class="photoList text-center">
              <div class="text-left inline-block" style="width: 92vw;">
                <span v-for="itemv2,indexv2 in item.photoList" v-if="item.photoList.length>0">
                  <span v-if="item.photoList.length == 1">
                    <div class="oneSheet inline-block" v-bind:style="{backgroundImage:'url(' + itemv2.pic + ')'}" @click="showImage(item.photoList, indexv2)"></div>
                  </span>
                  <span v-else-if="item.photoList.length == 2">
                    <div class="twoSheet inline-block" v-bind:style="{backgroundImage:'url(' + itemv2.pic + ')'}" @click="showImage(item.photoList, indexv2)"></div>
                  </span>
                  <span v-else>
                    <div class="moveSheet inline-block" v-bind:style="{backgroundImage:'url(' + itemv2.pic + ')'}" @click="showImage(item.photoList, indexv2)"></div>
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div class="main-tab font28 color6">
            <div class="main-num flo_l " @click="like(item.id,index)">
              <img src="http://images.ufutx.com/201906/27/bcb1164e097c61df1e991f7e783ebb13.png" v-if="item.isLkerMoment" alt="" />
              <img src="http://images.ufutx.com/201906/27/f0a175c90a1b14211980298c615a36bc.png" v-else alt="" />
              <span class="color6">{{item.momentLikerCount}}</span>
            </div>
            <div class="main-liveness flo_l">
              <img src="http://images.ufutx.com/201906/27/936c4a5f817035d69b1e2380894204cd.png" alt="">
              <span>{{item.momentCommentCount}}</span>
            </div>
            <div v-if="item.is_self" class="main-liveness flo_r"
                 @click="showSelfComplaint=true,delId=item.id,delIndex=index">
              <img src="https://images.ufutx.com/201907/20/1c4416925c394e67b2a81696d3b34af7.png" alt="">
            </div>
            <div v-else class="main-liveness flo_r" @click="showComplaint=true,complaintId=item.id">
              <img src="https://images.ufutx.com/201907/20/1c4416925c394e67b2a81696d3b34af7.png" alt="">
            </div>
            <div class="clearfloat"></div>
          </div>
          <div class="comment" v-if="item.momentComments.length > 0">
            <div class="" v-for="itemComments in item.momentComments">
              <span class="bold color6">{{itemComments.user? itemComments.user.name: '未获取到用户信息'}}：</span>
              <span class="color6">{{itemComments.comment}}</span>
            </div>
            <div class="allComment" @click="$router.push({path: `/friendCircleDetail/${item.id}`})">
              查看全部评论
            </div>
          </div>
        </div>
      </div>
    </mescroll-vue>
    <group>
      <popup-picker confirm-text="确定" :show.sync="showSelfComplaint" :show-cell="false" :data="SelfpickerList"
                    @on-change="onChangeSelf"></popup-picker>
      <popup-picker confirm-text="确定" :show.sync="showComplaint" :show-cell="false" :data="pickerList"
                    @on-change="onChange"></popup-picker>
      <popup-picker confirm-text="确定" :show.sync="showSearchType" :show-cell="false" :data="SearchType"
                    @on-change="onChangeSearch"></popup-picker>
    </group>
    <div v-transfer-dom>
      <previewer :list="Imagelist" ref="previewer"></previewer>
    </div>
  </div>
</template>

<script>
  import {TransferDom, Popup, XInput, Search, PopupPicker, Group, Previewer} from 'vux'
  import MescrollVue from 'mescroll.js/mescroll.vue'
  import {$loadingHide, $toastText, $loadingShow, $toastSuccess} from '../../config/util'

  export default {
    name: 'friendCircleList',
    directives: {
      TransferDom
    },
    components: {
      XInput,
      Search,
      Popup,
      PopupPicker,
      Previewer,
      Group,
      MescrollVue
    },
    data () {
      return {
        value: '',
        search: '',
        init: false,
        showComplaint: false,
        showSelfComplaint: false,
        showSearch: false,
        searchText: '全部',
        loadImage: 'http://images.ufutx.com/201902/25/542cc218e40cbc8a8e3a9ce23d7f4789.gif',
        SearchType: [['查看全部', '只看单身男', '只看单身女', '只看介绍人']],
        pickerList: [['举报', '取消']],
        SelfpickerList: [['删除', '取消']],
        delId: 0,
        delIndex: 0,
        searchType: '',
        recommend: [],
        noData: false,
        searchArray: {},
        page: 1,
        complaintId: '',
        showSearchType: false,
        announcements: [],
        Imagelist: [],
        mescroll: null, //  mescroll实例对象
        mescrollDown: {}, // 下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
        mescrollUp: { // 上拉加载的配置.
          callback: this.getOrderList, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
          // 以下是一些常用的配置,当然不写也可以的.
          page: {
            num: 0, // 当前页 默认0,回调之前会加1; 即callback(page)会从1开始
            size: 15 // 每页数据条数,默认10
          },
          lazyLoad: {
            use: true, // 是否开启懒加载,默认false
            attr: 'imgurl' // 标签中网络图的属性名 : <img imgurl='网络图  src='占位图''/>
          },
          // toTop: {
          //   // 回到顶部按钮
          //   src: "http://images.ufutx.com/201906/27/1380d8f68a7f81f3a08a92a84cab4c0e.png", // 图片路径,默认null,支持网络图
          //   offset: 1000 // 列表滚动1000px才显示回到顶部按钮
          // },
          htmlLoading: '<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip">加载中..</p>', // 上拉加载中的布局
          htmlNodata: '<p class="upwarp-nodata">-- 加载完毕 --</p>' // 无数据的布局
        },
        arr: [],
        list: []
      }
    },
    watch: {
    },
    methods: {
      routeToDetail (type, id) {
        if (type === 'single') {
          this.$router.push({name: 'information', params: {id: id}})
        } else {
          this.$router.push({name: 'introducer', params: {id: id}})
        }
      },
      showImage (list, index) {
        let Imagelist = []
        for (let item of list) {
          Imagelist.push({
            src: item.pic
          })
        }
        console.log(Imagelist)
        this.Imagelist = Imagelist
        setTimeout(() => {
          this.$refs.previewer.show(index)
        })
      },
      like (id, index) {
        this.$http.post(`/official/like/moments/${id}`).then(({data}) => {
          this.page = 1
          this.list[index].isLkerMoment = !this.list[index].isLkerMoment
          if (this.list[index].isLkerMoment) {
            this.list[index].momentLikerCount++
          } else {
            this.list[index].momentLikerCount--
          }
          this.$apply()
        }).catch((error) => {
          console.log(error)
        })
      },
      onChangeSearch (val) {
        switch (val[0]) {
          case '查看全部':
            this.searchType = ''
            this.searchText = '全部'
            break
          case '只看单身男':
            this.searchType = 'single_man'
            this.searchText = '单身男'
            break
          case '只看单身女':
            this.searchType = 'single_woman'
            this.searchText = '单身女'
            break
          case '只看介绍人':
            this.searchType = 'marriage'
            this.searchText = '介绍人'
            break
        }
        let page = {num: 1}
        this.getOrderList(page)
      },
      onChangeSelf (val) {
        console.log(val)
        if (val[0] === '删除') {
          this.$vux.confirm.show({
            title: '提示：',
            content: '你将删除这条动态？',
            confirmText: '确定',
            dialogTransition: 'vux-fade',
            onCancel: () => {
            },
            onConfirm: () => {
              this.$http.delete(`/moments/${this.delId}`).then(({data}) => {
                this.list.splice(this.delIndex, 1)
                $toastSuccess('已删除')
              })
            }
          })
        }
      },
      onChange (val) {
        console.log(val)
        if (val[0] === '举报') {
          this.$router.push({path: `/CircleComplaint/${this.complaintId}`})
        }
      },
      mescrollInit (mescroll) {
        this.mescroll = mescroll
      },
      getOrderList (page, mescroll) { // 获取数据
        $loadingShow('加载中...')
        let pageV = 1
        pageV = page.num
        if (!page.num) {
          pageV = 1
        }
        let vm = this
        vm.$http.get(`/official/moments?page=${pageV}&type=${vm.searchType}`).then(({data}) => {
          let dataV = pageV === 1 ? [] : vm.list
          dataV.push(...data.data)
          vm.list = dataV
          if (mescroll) {
            vm.$nextTick(() => {
              mescroll.endSuccess(data.data.length)
            })
          }
          if (vm.list.length > 0) {
            vm.list.forEach((item, index) => {
              let photoList = []
              for (let rect of item.photos) {
                if (index < 3) {
                  photoList.push({
                    pic: rect,
                    show: true
                  })
                } else {
                  photoList.push({
                    pic: rect,
                    show: false
                  })
                }
              }
              item.photoList = photoList
            })
          }
          console.log(vm.list)
          if (vm.list.length < 1) $toastText('很抱歉！暂时没有搜索到对象')
          $loadingHide()
        }).catch((error) => {
          console.log(error)
          $loadingHide()
        })
      }
    },
    mounted () {
    }
  }
</script>

<style lang="less" scoped>
  .main-search{
    padding: 32px 12px;
    border-bottom: 12px solid #F7F7F7;
    position: relative;
    .friendEdit{
      width: 52px;
      position: absolute;
      right: 30px;
      top: 30px;
    }
    .icon-down{
      width: 28px;
      vertical-align: middle;
      margin-bottom: 4px;
    }
  }
  .main-box{
    border-bottom: 12px solid #F7F7F7;
  }
  .comment{
    border-top: 4px solid #f8f8f8;
    margin: 26px;
    padding-top: 12px;
    font-size: 24px;
    .allComment{
      margin-top: 8px;
      color: orange;
    }
  }
  .main-info {
    padding-top: 26px;
    .content{
      margin: 0 20px 0 32px;
    }
    .photoList{
      padding-top: 12px;
      .oneSheet{
        width: 400px;
        height: 400px;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
      }
      .twoSheet{
        width: 200px;
        height: 200px;
        margin-right: 26px;
        margin-top: 6px;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
      }
      .moveSheet{
        width: 200px;
        height: 200px;
        margin-right: 26px;
        margin-top: 6px;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
      }
      .active{
        opacity: 1;
      }
    }
    .info-user {
      float: left;
      padding: 12px 12px 12px 20px;
      padding-top: 6px;
      .sex-icon{
        width: 32px;
        vertical-align: middle;
        margin-bottom: 8px;
      }
      .class{
        padding: 2px 14px;
        background: #FBE0E9;
        color: #D82653;
        font-size: 14px;
        border-radius: 14px;
        font-weight: 400;
        vertical-align: middle;
        margin-bottom: 6px;
        display: inline-block;
      }
      .photo {
        width: 90px;
        height: 90px;
        border-radius: 50%;
        overflow: hidden;
        border: 1px solid #f0f0f0;
        .img {
          width: 100%;
        }
      }
    }

    .info-text {
      width: 78%;
      margin-top: 4px;
      padding-left: 10px;
      .intro {
        margin-top: 6px;
      }
    }
  }

  .main-tab {
    padding: 22px 30px;
    width: 92%;
    img {
      width: 36px;
      vertical-align: middle;
      margin-top: -10px;
    }
    .main-num {
      margin-right: 28px;
    }

    .main-liveness {
    }
  }

</style>
