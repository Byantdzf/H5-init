<template>
  <div class="introducer">
    <div class="bc_swiper">
      <swiper :list="life_photos" :min-moving-distance="120" :show-desc-mask="false" height="320px" :auto="true"
              dots-position="center" :interval="2000"></swiper>
      <span class="like colorff font28">
      <img src="https://images.ufutx.com/201904/01/2748b2373009c307d86f3750d85a812e.png" alt="" class="like_icon">
      {{information.fans_count}}
    </span>
    </div>
    <div class="bc_detail" v-if="(JSON.stringify(information) !== '{}')">
      <span class="name bold">{{information.name}}</span>
      <img src="https://images.ufutx.com/201904/15/45bfd2a6b4f2dd8bb227f6bafd8ca836.png" alt="" class="bc_icon">
      <span class="font20">{{information.rank_name}}</span>
      <div class="bc_love flo_r">
        <img src="https://images.ufutx.com/201904/03/76d6a32c1cb5e51f63de5e059624eb27.png" @click="attention"
             v-if="information.is_followed == 1" :class="{'btn_active': btnActive}" class="love">
        <img src="https://images.ufutx.com/201904/03/56bd712f02b06933f936f76cb6ac9a2a.png" @click="attention"
             :class="{'btn_active': btnActive}" v-else class="love">
      </div>
      <p class="message">
        <span class="font26 colorbe">{{information.age}}</span>
      </p>
    </div>
    <!--<div class="introduction">-->
      <!--<p style="width: 20%" class="font28 flo_l">服务格言</p>-->
      <!--<p class="colorbe flo_r font26" style="width: 80%">{{information.slogan}}</p>-->
      <!--<p class="clearfloat"></p>-->
    <!--</div>-->
    <div class="basics">
      <p style="width: 20%" class="font28 flo_l">基本资料</p>
      <div class="colorbe flo_r basicsData" style="width: 80%" v-if="(JSON.stringify(information) !== '{}')">
        <p class="item font26">{{information.age}}</p>
        <p class="item font26">{{information.birthday}}</p>
        <p class="item font26">{{'行业：'+information.industry+'-'+information.industry_sub}}</p>
        <p class="item font26">{{'公司：'+information.company}}</p>
        <p class="item font26">{{'公司职位：'+information.post}}</p>
        <p class="item font26">{{'信仰：'+information.belief}}</p>
      </div>
      <p class="clearfloat"></p>
      <div class="idealLove">
        <p style="width: 20%" class="font28 flo_l">服务格言</p>
        <p class="colorbe flo_r font26" style="width: 80%;margin-top: 0.8vw;">{{information.slogan}}</p>
        <p class="clearfloat"></p>
      </div>
    </div>
    <div class="height160"></div>
    <div class="submit" v-if="information.is_friend === 1" @click="routeToDetail(information.type, information.id)">聊天</div>
    <div class="submit" v-else @click="addFriend">加为好友</div>
    <moadlUp :show.sync="showQr" @hideModal="hideQr">
      <div class="main-qr">
        <p class="font28">请长按识别二维码，关注公众号</p>
        <img :src="information.qrcode_url" alt=""/>
        <div class="text-center font22 color6" style="margin-top: 12px;">
          <img src="http://images.ufutx.com/201907/04/0eaf2cfa1d2dcb3ac25f20ad1117d52d.png" alt="" class="qrImage">
          长按识别二维码
        </div>
      </div>
    </moadlUp>
  </div>
</template>

<script>
  import {Group, Cell, XHeader, XInput, Swiper} from 'vux'
  import {$toastSuccess} from '../../config/util'
  import moadlUp from '../../components/moadlUp'

  export default {
    name: 'introducer',
    components: {
      Group,
      Cell,
      XHeader,
      XInput,
      Swiper,
      moadlUp
    },
    data () {
      return {
        id: '',
        btnActive: false,
        information: {},
        showQr: false,
        paas: '',
        life_photos: [],
        imgList: [{
          url: 'javascript:',
          img: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2622829061,2227432350&fm=26&gp=0.jpg'
        }, {
          url: 'javascript:',
          img: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=685006216,2192383313&fm=26&gp=0.jpg',
          fallbackImg: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2622829061,2227432350&fm=26&gp=0.jpg'
        }]
      }
    },
    watch: {
      information () {
        if (this.information.is_followed === 1) {
          this.btnActive = true
          return
        }
        this.btnActive = false
      }
    },
    methods: {
      hideQr (value) {
        this.showQr = value
      },
      routeToDetail (type, id) {
        this.$router.push({name: 'chitchatDetail', params: {id: id}})
      },
      attention () {
        this.$http.post(`/follow/users/${this.id}`).then(({data}) => {
          this.btnActive = !this.btnActive
          this.information.is_followed = !this.information.is_followed
          if (data.is_followed) {
            this.information.fans_count++
          } else {
            this.information.fans_count--
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      addFriend () {
        if (!this.information) return
        if (this.paas === 'ZNSJ' && this.information.subscribe === 0) {
          this.showQr = true
          return
        }
        this.$http.post(`/official/add/friend/${this.id}`).then(({data}) => {
          $toastSuccess('请求已发送')
        }).catch((error) => {
          console.log(error)
        })
      },
      getData () {
        this.$http.get(`/official/users/${this.id}`).then(({data}) => {
          this.information = data
          this.life_photos = data.life_photos.map((item) => {
            return {
              img: item.photo
            }
          })
          this.life_photos.unshift({img: this.information.photo})
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    mounted () {
      if (this.$route.query.paas) {
        this.paas = this.$route.query.paas
        console.log(this.paas)
      }
      this.id = this.$route.params.id
      this.getData()
    }
  }
</script>

<style lang="less" scoped>
  body {
    background: #f5f5f5 !important;

    .like {
      padding: 6px 22px;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 24px;
      margin-top: -80px;
      z-index: 999999;
      position: absolute;
      right: 35px;

      .like_icon {
        width: 28px;
        margin-right: 2px;
      }
    }

    .bc_detail {
      padding: 30px;

      .name {
        font-size: 36px;
      }

      .bc_icon {
        width: 36px;
        margin: 0 -4px -4px 12px;
      }

      .bc_love {
        margin-top: -10px;

        .love {
          width: 120px;
        }
      }

      .message {
        border-bottom: 1px solid #D2D2D2;
        padding-bottom: 30px;
      }
    }

    .introduction, .basics {
      padding: 0 30px 30px 30px;
      border-bottom: 2px solid #D2D2D2;
    }

    .idealLove {
      padding: 42px 30px 42px 0px;
      border-bottom: 2px solid #D2D2D2;
    }
    .basics {
      padding: 20px 30px 30px 30px;
      padding-right: 0;
      border: none;
      .basicsData {
        border-bottom: 2px solid #D2D2D2;
        padding-bottom: 22px;
        .item {
          padding: 8px 18px;
          background: #f7f7f7;
          display: inline-block;
          border: 2px solid #D2D2D2;
          border-radius: 8px;
          color: black;
          margin: 0px 20px 20px 0;
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
      width: 100vw;
      letter-spacing: 3px;
    }

    .bc_dist {
      background: #F5F5F5;
      height: 20px;
    }
    .main-qr {
      width: 86%;
      margin: auto;
      background: white;
      margin-top: 32px;
      border-radius: 12px;
      padding: 22px;
      .main-tabQr{
        width: 390px;
        /*background: red;*/
        margin: auto;
        overflow: hidden;
        border-radius: 32px;
        border: 1px solid #d6d6d6;
        margin-bottom: 16px;
        .community,.userQr{
          width: 160px;
          padding: 10px 16px;
          text-align: center;
        }
        .userQr{}
        .active{
          background: #d6d6d6;
        }
      }

      img {
        width: 100%;
        border-radius: 6px;
      }

      .text {
        padding: 22px;
      }
      .qrImage{
        width: 26px !important;
        vertical-align: middle;
        margin-bottom: 4px;
      }
    }
  }
</style>
