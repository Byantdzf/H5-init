<template>
  <div>
    <div v-for="item,index in list" class="main-box">
      <div class="main-info colorff">
        <div class="info-user text-center">
          <div class="photo" @click.stop="routeToDetail(item.user.type, item.user_id)">
            <div class="img" v-bind:style="{backgroundImage:'url(' + item.user.photo + ')'}"></div>
          </div>
        </div>
        <div class="info-user info-text" @click="$router.push({path: `/communityCircleDetail/${item.id}`})">
          <div class="font28 title color6">
            {{item.user.name}}
            <!--<img src="http://images.ufutx.com/201902/21/7b3892dcf60fabda05add35abfa9aec3.png" v-if="item.user.sex === 2" alt="" class="sex-icon">-->
            <!--<img src="http://images.ufutx.com/201902/21/a309744e67082c4bd46db0df504c32c5.png" v-else alt="" class="sex-icon">-->
          </div>
          <div class="font22 intro colorb0">
            <!--<router-link :to="{name: 'communityDetail', params: {id: item.id}}">-->
              <p  v-for="item,index in item.communities" class="communities"  @click.stop="$router.push({path: `/communityDetail/${item.id}`})">{{item.title}}</p>
            <!--</router-link>-->
          </div>
        </div>
        <div class="clearfloat"></div>
        <div class="font28 content color6"  @click="$router.push({path: `/communityCircleDetail/${item.id}`})">{{item.content}}</div>
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
        <div class="main-livenessV flo_r" @click="collect(item.id,index)">
          <img src="https://images.ufutx.com/201908/09/d97b2c98a661de5d6d7730953e36c33d.png" v-if="item.favoriteCount" alt="" />
          <img src="https://images.ufutx.com/201908/09/a5a9d6eeb378cf96214207e33738570b.png" v-else alt="" />
        </div>
        <div class="clearfloat"></div>
      </div>
      <!--<div class="comment" v-if="item.momentComments.length > 0">-->
        <!--<div class="" v-for="itemComments in item.momentComments">-->
          <!--<span class="bold color6">{{itemComments.user? itemComments.user.name: '未获取到用户信息'}}：</span>-->
          <!--<span class="color6">{{itemComments.comment}}</span>-->
        <!--</div>-->
        <!--<div class="allComment" @click="$router.push({path: `/friendCircleDetail/${item.id}`})">-->
          <!--查看全部评论-->
        <!--</div>-->
      <!--</div>-->
    </div>
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
  import {$toastSuccess} from '../config/util'
  export default {
    directives: {
      TransferDom
    },
    props: ['list'],
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
        Imagelist: []
      }
    },
    watch: {
      list (val) {
        console.log(val)
      }
    },
    methods: {
      routeToDetail (type, id) {
        this.$router.push({name: 'userCommunityClass', params: {id: id}})
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
        this.$http.post(`/official/like/community/moments/${id}`).then(({data}) => {
          this.page = 1
          this.list[index].isLkerMoment = !this.list[index].isLkerMoment
          if (this.list[index].isLkerMoment) {
            this.list[index].momentLikerCount++
          } else {
            this.list[index].momentLikerCount--
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      collect (id, index) {
        this.$http.post(`/official/favorite/community/moments/${id}`).then(({data}) => {
          this.page = 1
          this.list[index].favoriteCount = !this.list[index].favoriteCount
          if (this.list[index].favoriteCount) {
            $toastSuccess('收藏成功')
          }
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
          this.$router.push({path: `/CommunityCircleComplaint/${this.complaintId}`})
        }
      },
      mescrollInit (mescroll) {
        this.mescroll = mescroll
      }
    },
    mounted () {
    }
  }
</script>

<style  lang="less" scoped>
  .communities{
    color: #D92553;
    border: 1px solid #D92553;
    display: inline-block;
    padding: 0 8px;
    border-radius: 4px;
    margin-right: 4px;
  }
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
          height: 100%;
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center;
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
    .main-livenessV {
      margin-right: 32px;
      img {
        width: 42px;
        vertical-align: middle;
        margin-top: -10px;
      }
    }
  }
</style>
