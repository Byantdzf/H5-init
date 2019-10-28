<template>
  <div>
    <div class="z_box">
      <img src="https://images.ufutx.com/201910/21/5a66b63ff83c94d3e7974ed5214e95d7.png" alt="" class="back_roundness">
      <div class="back_rectangle"></div>
      <img :src="guest_avatar" alt="" class="attention_photo">
      <div class="attention_data">
        <p class="attention_name">{{guest_name}}</p>
        <p class="attention_type">主播</p>
      </div>
      <div class="attention_click" @click="showModal=true">关注</div>-->
      <!--<div class="attention_box">-->


        <!--<div class="attention_click" @click="showModal=true">+关注</div>-->
      <!--</div>-->
    </div>
    <div class="user_box">
      <div class="photo_box">
        <img :src="item.circle_avatar" alt="" class="user_photo" v-for="item in user_list" @click="$router.push({path: `/information/${item.id}`})">
      </div>
    </div>
    <div class="flow_box">
      <div class="attention_flow">
        <p class="audience">观众</p>
        <p class="flow_num">{{click_num}}</p>
      </div>
    </div>
    <img src="https://images.ufutx.com/201910/28/204f5df1d48ca38406f44646173b6a79.png" alt="" class="quit" @click="$router.push({path: `/live`})">
    <div v-if="showModal" @click="showModal=false" class="text-center qrcode_box">
      <p class="qrcode_text">{{qrcode_intro}}</p>
      <img :src="qrcode" alt="" class="qrcode">
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
        showModal: false,
        click_num: '',
        user_list: [],
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
          if (this.click_num >= 10000) {
            this.click_num = '1万'
          } else if (this.click_num >= 100000) {
            this.click_num = '10万'
          } else if (this.click_num >= 1000000) {
            this.click_num = '100万'
          }
          vm.guest_avatar = vm.arena.guest_avatar
          vm.guest_name = vm.arena.guest_name
          // vm.intro = vm.arena.intro
          vm.user_list = data.user_list
          vm.qrcode_intro = vm.arena.qrcode_intro
          vm.qrcode = vm.arena.qrcode
          vm.status = vm.arena.status
          $loadingHide(false)
        })
      }
    },
    created () {
      this.timer = setInterval(() => {
        this.getParticulars()
      }, 30000)
    },
    beforeDestroy () {
      clearInterval(this.timer)
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
    left: 24px;
    z-index: 99;
  }
  .back_roundness{
    position: absolute;
    z-index: 1;
    width: 88px;
    height: 88px;
  }
  .back_rectangle{
    position: absolute;
    top: 10px;
    left: 54px;
    width: 224px;
    background: #000;
    border-radius: 26px;
    height: 70px;
  }
  .attention_data{
    width: 80px;
    position: absolute;
    left: 94px;
    top: 14px;
  }
  .attention_photo{
    width: 80px;
    height: 80px;
    border-radius: 50%;
    position: absolute;
    z-index: 2;
    left: 4px;
    top: 4px;
  }
  .attention_name{
    font-size: 22px;
    font-weight: bold;
    color: white;
  }
  .attention_type{
    font-size: 18px;
    color: #D92553;
  }
  .attention_click{
    width: 80px;
    height: 52px;
    text-align: center;
    line-height: 52px;
    border-radius: 26px;
    font-size: 22px;
    color: white;
    position: absolute;
    top: 19px;
    left: 190px;
    background: #D92553;
  }
  .user_box{
    position: absolute;
    color: white;
    white-space: nowrap;
    overflow-x:scroll;
    top: 24px;
    right: 156px;
    z-index: 99;
  }
  ::-webkit-scrollbar {
    width: 0;
    display: none;
    background-color: #fff;
  }
  .photo_box{
    width: 286px;
  }
  .user_photo{
    width: 80px;
    height: 80px;
    margin-left: 4px;
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
    top: 24px;
    right: 70px;
    z-index: 99;
    width: 80px;
    text-align: center;
    height: 80px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.6);
  }
  .quit{
    width: 40px;
    position: absolute;
    top: 44px;
    right: 20px;
    z-index: 99;
  }
  .audience{
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 4px;
    color: white;
  }
  .attention_flow{
    margin-top: 14px;
  }
  .flow_num{
    font-size: 14px;
    color: white;
  }
  .qrcode_box{
    position: absolute;
    top: 30%;
    left: 30%;
    z-index: 999;
  }
  .qrcode_text{
    color: #D92553;
    font-size: 30px;
    margin-bottom: 30px;
   }
  .qrcode{
    background-repeat: no-repeat;
    background-size: cover;
    background-position-x: center;
    width: 320px;
    height: 320px;
  }
</style>
