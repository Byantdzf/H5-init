<template>
  <div>
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" class="scrollView">
      <div class="tab-list">
        <div class="tab-li"
             :class="item.isSelected !== false ? 'Active' : '' "
             v-for="(item,index) in labels" @click="cutTabClick(item, index)"
             :key="index">{{item.title}}
        </div>
      </div>
      <div class="wire" v-if="labels !== [] && groups !== []"></div>
      <div class="tab-listV2">
        <div class="tab-liV2"
             :class="actioveV2 == index ?'ActiveV2' : '' "
             v-for="(item,index) in groups" @click="cutTabV2Click(item, index)">{{item.title}}
        </div>
      </div>
      <div class="z_box">
        <div class="blind_date" v-if="orgTotal !== 0" @click="">
          <span class="z_blind_date">全部相亲</span>
          <img src="https://images.ufutx.com/201909/17/038e3c3012f246d562f2deb9c9672f1c.png" alt="icon"
               class="arrows_icon">
        </div>
        <div v-for="item in information">
          <div class="time">
            <span
              v-text="new Date(item.start_time).toLocaleString().split(' ')[0].replace('/', '年').replace('/', '月')+'日'">
            </span>
          </div>
          <div class="athletics">
            <div class="z_arena">
              <img src="https://images.ufutx.com/201909/17/012c27c91295fb26c225f2bd21b70d0b.png" alt="icon"
                   class="icon">
              <span class="z_title">{{item.title}}</span>
            </div>
            <div class="head_portrait">
              <div class="z_man_head" @click="$router.push({path: `/liveParticulars/${item.id}`})">
                <div class="z_man">
                  <span v-for="(items, index) in item.male_team" :key="index" v-if="item.id == items.arena_id">
                    <img :src="items.avatar" alt="" class="z_min_man1" v-if="item.male_team.length == 1">
                    <span v-if="item.male_team.length == 2">
                      <span :class="profile2[index]">
                        <img :src="items.avatar" alt="" class="head_portrait">
                      </span>
                    </span>
                    <span v-if="item.male_team.length == 3">
                      <span :class="profile3[index]">
                        <img :src="items.avatar" alt="" class="head_portrait">
                      </span>
                    </span>
                    <span v-if="item.male_team.length == 4">
                      <span :class="profile4[index]">
                        <img :src="items.avatar" alt="" class="head_portrait">
                      </span>
                    </span>
                    <span v-if="item.male_team.length == 5">
                      <span :class="profile5[index]">
                        <img :src="items.avatar" alt="" class="head_portrait">
                      </span>
                    </span>
                    <span v-if="item.male_team.length == 6">
                      <span :class="profile6[index]">
                        <img :src="items.avatar" alt="" class="head_portrait">
                      </span>
                    </span>
                  </span>
                </div>
                <p class="z_man_name ellipsis_1">{{item.male_team_name}}</p>
              </div>
              <div class="z_score_head">
                <div class="z_score">{{item.male_team_num}} : {{item.female_team_num}}</div>
                <button class="z_btn" @click="onJoin(item.id)" v-if="item.status == 0">{{join}}</button>
                <button class="z_btn" @click="$router.push({path: `/liveParticulars/${item.id}`})" v-if="item.status == 1">进入直播</button>
                <button class="z_btn" @click="$router.push({path: `/liveParticulars/${item.id}`})" v-if="item.status == 2">查看回放</button>
              </div>
              <div class="z_woman_head">
                <div class="z_woman" @click="$router.push({path: `/liveParticulars/${item.id}`})">
                  <span v-for="(items, index) in item.female_team" v-if="item.id == items.arena_id">
                    <img :src="items.avatar" alt="" class="z_min_woman1">
                    <span v-if="item.female_team.length == 2">
                      <span :class="profile2[index]">
                        <img :src="items.avatar" alt="" class="head_portrait">
                      </span>
                    </span>
                    <span v-if="item.female_team.length == 3">
                      <span :class="profile3[index]">
                        <img :src="items.avatar" alt="" class="head_portrait">
                      </span>
                    </span>
                    <span v-if="item.female_team.length == 4">
                     <span :class="profile4[index]">
                        <img :src="items.avatar" alt="" class="head_portrait">
                      </span>
                    </span>
                    <span v-if="item.female_team.length == 5">
                      <span :class="profile5[index]">
                        <img :src="items.avatar" alt="" class="head_portrait">
                      </span>
                    </span>
                    <span v-if="item.female_team.length == 6">
                      <span :class="profile6[index]">
                        <img :src="items.avatar" alt="" class="head_portrait">
                      </span>
                    </span>
                  </span>
                </div>
                <p class="z_woman_name">{{item.female_team_name}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </mescroll-vue>
  </div>
</template>

<script>
  import {Group, Cell, XHeader, Swiper, XInput, Search, SwiperItem} from 'vux'
  import MescrollVue from 'mescroll.js/mescroll.vue'
  import {$loadingHide, $toastSuccess} from '../../config/util'

  export default {
    name: 'live',
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
        actiove: 0,
        actioveV2: 8888,
        groups: [],
        join: '加入',
        profile2: ['z_min2_1', 'z_min2_2'],
        profile3: ['z_min3_1', 'z_min3_2', 'z_min3_3'],
        profile4: ['z_min4_1', 'z_min4_2', 'z_min4_3', 'z_min4_4'],
        profile5: ['z_min5_1', 'z_min5_2', 'z_min5_3', 'z_min5_4', 'z_min5_5'],
        profile6: ['z_min6_1', 'z_min6_2', 'z_min6_3', 'z_min6_4', 'z_min6_5', 'z_min6_6'],
        labels: [],
        groupsID: 0,
        labelsID: [],
        arenaID: '',
        arenas: [],
        information: [],
        page: 1,
        mescroll: null, //  mescroll实例对象
        mescrollDown: {}, // 下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
        mescrollUp: { // 上拉加载的配置.
          callback: this.getathletics, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
          // 以下是一些常用的配置,当然不写也可以的.
          page: {
            num: 0, // 当前页 默认0,回调之前会加1; 即callback(page)会从1开始
            size: 15 // 每页数据条数,默认10
          },
          // htmlLoading: '<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip">加载中..</p>' // 上拉加载中的布局
          htmlNodata: '<p class="upwarp-nodata" v-if="list.length > 0">-- 暂无更多 --</p>' // 无数据的布局
        },
        orgTotal: 0,
        time: ''
      }
    },
    watch: {
    },
    methods: {
      cutTabClick (item, index) {
        this.actiove = index
        item.isSelected = !item.isSelected
        let IDs = []
        for (let itemV of this.labels) {
          if (itemV.isSelected) {
            IDs.push(itemV.id)
          }
        }
        this.labelsID = IDs
        this.getathletics({num: 1}, this.mescroll)
      },
      cutTabV2Click (item, index) {
        this.actioveV2 = index
        this.groupsID = item.id
        this.getathletics({num: 1}, this.mescroll)
      },
      mescrollInit (mescroll) {
        this.mescroll = mescroll
      },
      getclassify () {
        let vm = this
        this.$http.get(`/official/square`).then(({data}) => {
          vm.groups = data.groups
          vm.labels = data.labels
          for (let item of vm.labels) {
            item.isSelected = false
          }
        })
      },
      getathletics (page, mescroll) {
        let vm = this
        this.$http.get(`/official/arenas?group_id=${vm.groupsID}&label_ids=${vm.labelsID}&page=${page.num}`).then(({data}) => {
          this.page = page.num
          vm.arenas = data.arenas
          this.information = page.num === 1 ? [] : this.information
          let information = vm.arenas.data.map((item) => {
            return {
              id: item.id,
              female_team_name: item.female_team_name,
              female_team_num: item.female_team_num,
              female_team: item.female_team,
              male_team_name: item.male_team_name,
              male_team_num: item.male_team_num,
              male_team: item.male_team,
              start_time: item.start_time,
              status: item.status,
              title: item.title
            }
          })
          this.information.push(...information)
          vm.orgTotal = vm.arenas.total
          $loadingHide(false)
          vm.$nextTick(() => {
            mescroll.endSuccess(data.arenas ? data.arenas.data : 1)
          })
        })
      },
      onJoin (id) {
        this.$http.post(`/official/join/arenas/` + id).then(({data}) => {
          $toastSuccess('加入成功')
          this.join = '已加入'
          this.getathletics()
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    mounted () {
      this.getclassify()
    }
  }
</script>

<style scoped lang="less">
  .tab-list{
    width: 98%;
    height: 100%;
    margin-left: 10px;
    padding-bottom: 18px;
    white-space: nowrap;
    overflow-x:scroll;
  }
  ::-webkit-scrollbar {
    width: 0px;
    display: none;
    background-color: #fff;
  }
  .tab-li {
    display: inline-block;
    width: 138px;
    height: 48px;
    border-radius: 25px;
    border: 1px solid #666666;
    text-align: center;
    line-height: 48px;
    font-size: 24px;
    color: #666666;
    margin-top: 30px;
    margin-left: 20px;
    background:#ffffff;
  }
  /*点击后样式*/
  .active{
    color: #D92553;
    border-color: #D92553;
  }
  .Active{
    display: inline-block;
    width: 138px;
    height: 48px;
    border: 1px solid #D92553;
    border-radius: 25px;
    text-align: center;
    line-height: 48px;
    font-size: 24px;
    margin-top: 30px;
    margin-left: 20px;
    color: #D92553;
    background:#ffffff;
  }
  .wire{
    width: 100%;
    height: 1px;
    background: #b0b0b0;
  }
  .tab-listV2{
    width: 98%;
    height: 100%;
    padding-left: 10px;
    padding-bottom: 35px;
    white-space: nowrap;
    overflow-x:scroll;
  }
  .tab-liV2{
    display: inline-block;
    width: 320px;
    height: 200px;
    border-radius: 6px;
    text-align: center;
    line-height: 200px;
    font-size: 24px;
    color: #ffffff;
    margin-top: 32px;
    margin-left: 20px;
    background:#000000;
  }
  /*点击后样式*/
  .ActiveV2{
    display: inline-block;
    width: 320px;
    height: 200px;
    border-radius: 6px;
    border: 1px solid #666666;
    text-align: center;
    line-height: 200px;
    font-size: 24px;
    color: #D92553;
    margin-top: 30px;
    margin-left: 20px;
    background:#000000;
  }
  .z_box{
    position: relative;
  }
  .blind_date{
    position: absolute;
    right: 0;
    top: 5px;
    .z_blind_date{
      font-size: 24px;
      color: #D92553;
    }
    .arrows_icon{
      width: 30px;
      vertical-align: middle;
    }
  }
  .time {
    width: 100%;
    height: 56px;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    line-height: 56px;
    color: #666666;
    background: #f6f6f6;
  }
  .athletics{
    width: 100vw;
    height: 306px;
    .z_arena{
      margin: 42px 0 20px 106px;
      .icon{
        width: 40px;
        height: 26px;
        vertical-align: middle;
      }
      .z_title{
        color: #666666;
        font-size: 24px;
        letter-spacing: 1px;
      }
    }
    .head_portrait{
      overflow: hidden;
      .z_man_head{
        float: left;
        text-align: center;
        margin-left: 108px;
        .z_man{
          position: relative;
          width: 115px;
          height: 115px;
          background: #f6f6f6;
          border-radius: 50%;
          overflow: hidden;
          /*padding: 8px;*/
          .z_min_man1{
            position: absolute;
            left: 10px;
            top: 18px;
            width: 42px;
            height: 42px;
            border-radius: 50%;
          }
          .z_min2_1{
            position: absolute;
            left: 10px;
            top: 18px;
          }
          .z_min2_2{
            position: absolute;
            left: 62px;
            top: 18px;
          }
          .head_portrait{
            width: 42px;
            height: 42px;
            border-radius: 50%;
          }
          .z_min3_1{
            position: absolute;
            left: 10px;
            top: 18px;
          }
          .z_min3_2{
            position: absolute;
            left: 62px;
            top: 18px;
          }
          .z_min3_3{
            position: absolute;
            left: 36px;
            top: 56px;
          }
          .z_min4_1{
            position: absolute;
            top: 18px;
            left: 10px;
          }
          .z_min4_2{
            position: absolute;
            left: 62px;
            top: 18px;
          }
          .z_min4_3{
            position: absolute;
            left: 10px;
            top: 56px;
          }
          .z_min4_4{
            position: absolute;
            left: 62px;
            top: 56px;
          }
          .z_min5_1{
            position: absolute;
            top: 18px;
            left: 10px;
          }
          .z_min5_2{
            position: absolute;
            left: 62px;
            top: 18px;
          }
          .z_min5_3{
            position: absolute;
            left: 10px;
            top: 56px;
          }
          .z_min5_4{
            position: absolute;
            left: 36px;
            top: 56px;
          }
          .z_min5_5{
            position: absolute;
            left: 62px;
            top: 56px;
          }
          .z_min6_1{
            position: absolute;
            left: 10px;
            top: 18px;
          }
          .z_min6_2{
            position: absolute;
            left: 36px;
            top: 18px;
          }
          .z_min6_3{
            position: absolute;
            left: 62px;
            top: 18px;
          }
          .z_min6_4{
            position: absolute;
            left: 10px;
            top: 56px;
          }
          .z_min6_5{
            position: absolute;
            left: 36px;
            top: 56px;
          }
          .z_min6_6{
            position: absolute;
            left: 62px;
            top: 56px;
          }
        }
        .z_man_name{
          width: 120px;
          color: #000;
          margin-top: 10px;
          font-weight: bold;
          font-size: 30px;
        }
      }
      .z_score_head{
        z-index: 999;
        text-align: center;
        float: left;
        margin-left: 76px;
        .z_score{
          line-height: 115px;
          color: #000;
          font-size: 40px;
          font-weight: bold;
        }
        .z_btn{
          width: 138px;
          height: 46px;
          border: 1px solid #D92553;
          border-radius: 23px;
          margin-top: 8px;
          color: #D92553;
          background: white;
        }
      }
      .z_woman_head{
        float: right;
        margin-right: 108px;
        text-align: center;
        .z_woman{
          position: relative;
          width: 115px;
          height: 115px;
          background: #f6f6f6;
          border-radius: 50%;
          overflow: hidden;
          /*padding: 8px;*/
          .head_portrait{
            width: 42px;
            height: 42px;
            border-radius: 50%;
          }
          .z_min_woman1{
            position: absolute;
            left: 10px;
            top: 20px;
            width: 42px;
            height: 42px;
            border-radius: 50%;
          }
          .z_min2_1{
            position: absolute;
            left: 10px;
            top: 18px;
          }
          .z_min2_2{
            position: absolute;
            left: 62px;
            top: 18px;
          }
          .z_min3_1{
            position: absolute;
            left: 10px;
            top: 18px;
          }
          .z_min3_2{
            position: absolute;
            left: 62px;
            top: 18px;
          }
          .z_min3_3{
            position: absolute;
            left: 36px;
            top: 56px;
          }
          .z_min4_1{
            position: absolute;
            top: 18px;
            left: 10px;
          }
          .z_min4_2{
            position: absolute;
            left: 62px;
            top: 18px;
          }
          .z_min4_3{
            position: absolute;
            left: 10px;
            top: 56px;
          }
          .z_min4_4{
            position: absolute;
            left: 62px;
            top: 56px;
          }
          .z_min5_1{
            position: absolute;
            top: 18px;
            left: 10px;
          }
          .z_min5_2{
            position: absolute;
            left: 62px;
            top: 18px;
          }
          .z_min5_3{
            position: absolute;
            left: 10px;
            top: 56px;
          }
          .z_min5_4{
            position: absolute;
            left: 36px;
            top: 56px;
          }
          .z_min5_5{
            position: absolute;
            left: 62px;
            top: 56px;
          }
          .z_min6_1{
            position: absolute;
            left: 10px;
            top: 18px;
          }
          .z_min6_2{
            position: absolute;
            left: 36px;
            top: 18px;
          }
          .z_min6_3{
            position: absolute;
            left: 62px;
            top: 18px;
          }
          .z_min6_4{
            position: absolute;
            left: 10px;
            top: 56px;
          }
          .z_min6_5{
            position: absolute;
            left: 36px;
            top: 56px;
          }
          .z_min6_6{
            position: absolute;
            left: 62px;
            top: 56px;
          }
        }
        .z_woman_name{
          width: 120px;
          color: #000;
          margin-top: 10px;
          font-weight: bold;
          font-size: 30px;
        }
      }
    }
  }
</style>
