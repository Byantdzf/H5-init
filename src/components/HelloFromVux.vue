<template>
  <div>
    <x-header class="ignore" :left-options="{showBack: false}">福恋共享平台</x-header>
    <!--<Search auto-fixed="false" position="absolute"></Search>-->
    <div style="background: rgba(0,0,0,0.4);padding: 10px;padding-bottom: 0px;" class="font30">
      <swiper auto height="30px" direction="vertical" :interval=2000 class="text-scroll" :show-dots="false" >
        <swiper-item><p class="ellipsis_1">义务爱了 完成传奇世界H5-王者归来任务 获得20金币</p></swiper-item>
        <swiper-item><p class="ellipsis_1">基本世神 兑换《传奇世界H5》畅玩级礼包 消耗30金币</p></swiper-item>
        <swiper-item><p class="ellipsis_1">零哥章魚 完成传奇世界H5-王者归来任务 获得30金币</p></swiper-item>
        <swiper-item><p class="ellipsis_1">做迎而為 兑换【饿了么】畅享美食红包 消耗20金币</p></swiper-item>
        <swiper-item><p class="ellipsis_1">只知道不知道 兑换【饿了么】畅享美食红包 消耗20金币</p></swiper-item>
        <swiper-item><p class="ellipsis_1">基本世神 兑换《传奇世界H5》畅玩级礼包 消耗30金币</p></swiper-item>
      </swiper>
    </div>
    <div class="text-center search-box">
      <input type="text" class="homeSearch text-center" v-model="search" placeholder="请搜索Ta的名字">
    </div>
    <p class="bc_title font34 bold">征婚</p>
    <swiper :list="imgList" :auto="true" :show-desc-mask="false" :show-dots="false" :min-moving-distance="120"></swiper>
    <div class="list-item" v-for="item in list">
      <div class="image" style="background-image: url('https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1511461500,2536850263&fm=200&gp=0.jpg');"></div>
      <p style="margin-top: 8px;">
        <span class="font32">蔡文姬</span>
        <span class="font20 colorb">20岁 · 165cm · 广东深圳</span>
      </p>
      <p class="font26 color6" style="margin-top: 4px">一次就好，我陪你去看天荒地老</p>
    </div>
    <!--<group title="cell demo">-->
      <!--<cell title="VUX" value="cool" is-link></cell>-->
    <!--</group>-->
    <!--<group>-->
      <!--<x-input title="title" v-model="value"></x-input>-->
    <!--</group>-->
  </div>
</template>

<script>
  import { Group, Cell, XHeader, Swiper, XInput, Search, SwiperItem } from 'vux'

  export default {
    components: {
      Group,
      Cell,
      XHeader,
      Swiper,
      SwiperItem,
      XInput,
      Search
    },
    data () {
      return {
        value: '',
        msg: 'Hello World!',
        search: '',
        imgList: [{
          url: 'javascript:',
          img: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2622829061,2227432350&fm=26&gp=0.jpg',
          title: '我的'
        }, {
          url: 'javascript:',
          img: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=685006216,2192383313&fm=26&gp=0.jpg',
          title: '都是我的',
          fallbackImg: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2622829061,2227432350&fm=26&gp=0.jpg'
        }],
        list: [
          {}, {}, {}, {}, {}, {}, {}
        ]
      }
    }
  }
</script>

<style  lang="less" scoped>
  body{
    background: #f7f7f7 !important;
  }
  .vux-demo {
    text-align: center;
  }
  .logo {
    width: 100px;
    height: 100px
  }
  .search-box{
    margin:22px 0;
    .homeSearch{
      width: 690px;
      height: 88px;
      border-radius: 6px;
      border: none;
      box-shadow: 1px 1px 12px #e9e9e9;
    }
  }
  .bc_title{
    margin-top: 12px;
    margin-left: 22px;
    margin-bottom: 12px;
  }
  .vux-img{
    width: 90% !important;
    margin: auto;
    border-radius: 6px;
    box-shadow: 1px 1px 12px #d3d3d3;
  }
  .vux-swiper{
    text-align: center;
    p{
      color: white;
    }
  }
  .list-item{
    width: 646px;
    height: 736px;
    padding: 22px;
    margin: auto;
    border-radius: 10px;
    background: white;
    margin-top: 22px;
    box-shadow: -1px 8px 18px #dadada;
    margin-bottom: 26px;
    .image{
      width: 100%;
      height: 646px;
    }
  }
</style>
