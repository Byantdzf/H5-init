<!-- 这是一个简易的范例，重点突出自动滚动底部 -->
<template>
  <div>
    <div class="z_box">
      <div class="attention_box">
        <img :src="guest_avatar" alt="" class="attention_photo flo_l">
        <div class="attention_data">
          <p class="attention_name">{{guest_name}}</p>
          <p class="attention_type">主播</p>
        </div>
        <div class="attention_click" @click="showModal=true">+关注</div>
      </div>
    </div>
    <div class="user_box">
      <div class="photo_box">
        <img src="http://tx.haiqq.com/uploads/allimg/170505/0424395200-4.jpg" alt="" class="user_photo">
        <img src="http://tx.haiqq.com/uploads/allimg/170505/0424395200-4.jpg" alt="" class="user_photo">
        <img src="http://tx.haiqq.com/uploads/allimg/170505/0424395200-4.jpg" alt="" class="user_photo">
        <img src="http://tx.haiqq.com/uploads/allimg/170505/0424395200-4.jpg" alt="" class="user_photo">
        <img src="http://tx.haiqq.com/uploads/allimg/170505/0424395200-4.jpg" alt="" class="user_photo">
        <img src="http://tx.haiqq.com/uploads/allimg/170505/0424395200-4.jpg" alt="" class="user_photo">
      </div>
    </div>
    <div class="flow_box">
      <div class="attention_flow">
        <img src="https://images.ufutx.com/201910/11/dd96c9e230e21b346c019454510eb02c.png" class="flow_icon" alt="">
        <span class="flow_num">{{click_num}}</span>
      </div>
    </div>
    <!--<div class="introduce_box">-->
      <!--<div class="bc_swiper">-->
        <!--<swiper :list="intro" :min-moving-distance="120" :show-desc-mask="false" height="320px" :auto="true"-->
                <!--dots-position="center" :interval="2000">-->
        <!--</swiper>-->
      <!--</div>-->
    <!--</div>-->
    <div>
      <div class="mask" v-if="showModal" @click="showModal=false"></div>
    </div>
  </div>
</template>
<script>
  import {Swiper} from 'vux'
  import componentLike from '../../components/componentLike'
  import {$loadingHide} from '../../config/util'

  export default {
    name: 'scroll',
    components: {componentLike, Swiper},
    data () {
      return {
        arena: [],
        guest_avatar: '',
        guest_name: '',
        intro: [
          {
            url: 'javascript:',
            img: 'http://img5.imgtn.bdimg.com/it/u=2967113123,3272767240&fm=26&gp=0.jpg'
          },
          {
            url: 'javascript:',
            img: 'http://img5.imgtn.bdimg.com/it/u=2967113123,3272767240&fm=26&gp=0.jpg'
          },
          {
            url: 'javascript:',
            img: 'http://img5.imgtn.bdimg.com/it/u=2967113123,3272767240&fm=26&gp=0.jpg'
          },
          {
            url: 'javascript:',
            img: 'http://img5.imgtn.bdimg.com/it/u=2967113123,3272767240&fm=26&gp=0.jpg'
          }
        ],
        showModal: false,
        click_num: '',
        arena_id: '',
        qrcode: '',
        qrcode_intro: '',
        status: ''
      }
    },
    methods: {
      getParticulars () {
        let vm = this
        this.$http.get(`/official/arenas/` + vm.arena_id).then(({data}) => {
          vm.arena = data.arena
          vm.click_num = vm.arena.click_num
          vm.guest_avatar = vm.arena.guest_avatar
          vm.guest_name = vm.arena.guest_name
          // vm.intro = vm.arena.intro
          vm.qrcode_intro = vm.arena.qrcode_intro
          vm.qrcode = vm.arena.qrcode
          vm.status = vm.arena.status
          $loadingHide(false)
          console.log(vm.intro, '000')
        })
      }
    },
    mounted () {
      this.arena_id = this.$route.params.id
      this.getParticulars()
    }
  }
</script>
<style scoped>
  .z_box{
    position: absolute;
    top: 20px;
    z-index: 99;
  }
  .attention_box{
    overflow: hidden;
    width: 350px;
    margin-left: 14px;
    border-radius: 40px;
    height: 80px;
    background-color: rgba(255, 255, 255, 0.6);
  }
  .attention_data{
    text-align: center;
    float: left;
    margin-left: 10px;
  }
  .attention_photo{
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }
  .attention_name{
    font-size: 26px;
    margin-top: 6px;
    color: white;
  }
  .attention_type{
    font-size: 20px;
    color: #D92553;
  }
  .attention_click{
    width: 120px;
    height: 80px;
    text-align: center;
    line-height: 80px;
    font-size: 30px;
    -webkit-border-top-right-radius: 40px;
    float: right;
    color: white;
    background: #E4573E;
  }
  .user_box{
    position: absolute;
    color: white;
    white-space: nowrap;
    overflow-x:scroll;
    top: 20px;
    right: 20px;
    z-index: 99;
  }
  ::-webkit-scrollbar {
    width: 0px;
    display: none;
    background-color: #fff;
  }
  .photo_box{
    width: 340px;
  }
  .user_photo{
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }
  .introduce_box{
    position: absolute;
    bottom: 0;
    z-index: 99;
  }
  .bc_swiper{
    width: 100vw;
  }
  .flow_box{
    position: absolute;
    top: 120px;
    z-index: 99;
  }
  .attention_flow{
    overflow: hidden;
    max-width: 150px;
    height: 30px;
    line-height: 30px;
    margin-left: 14px;
    border-radius: 15px;
    background-color: rgba(255, 255, 255, 0.6);

  }
  .flow_icon{
    width: 32px;
    height: 32px;
    float: left;
  }
  .flow_num{
    font-size: 20px;
    color: white;
    float: left;
    margin-left: 4px;
    margin-right: 14px;
  }
  .mask{
    width: 320px;
    height: 320px;
    position: absolute;
    top: 35%;
    left: 30%;
    background: white;
    z-index: 999;
  }
</style>
