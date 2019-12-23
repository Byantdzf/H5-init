<template>
  <div class="column-center loading-wrap text-center" :class="init?'hide': ''" v-if="!hide">
    <!--<image class="loading-icon" src="/images/svg/audio.svg"></image>-->
    <!--<image class="loading-icon" src="/images/svg/audio1.svg"></image>-->
    <!--<image class="loading-icon" src="https://images.ufutx.com/201902/25/542cc218e40cbc8a8e3a9ce23d7f4789.gif"></image>-->
    <!--<img src="https://images.ufutx.com/201902/25/542cc218e40cbc8a8e3a9ce23d7f4789.gif" alt="" />-->
    <img src="../assets/image/audio1.svg" class="loading-icon" alt="" />
    <!--<image src="https://images.ufutx.com/201901/09/924ba75de28c5c35d0abc26ac5cbdb03.png" mode="aspectFill" style="width: 375rpx;height: 375rpx;position: absolute;left: 27%;bottom: 0;"></image>-->
    <!--<image src="https://images.ufutx.com/201901/07/1c4a242d898fd90c1020e7a4ea38aa51.png" mode="aspectFill" style="width: 100%;height: 100%;position: absolute;left: 0;bottom: 0;"></image>-->
  </div>
</template>

<script>
  export default {
    name: 'loading',
    props: ['init'],
    data () {
      return {
        hide: false
      }
    },
    watch: {
      init () {
        console.log(this.init, 'loadi')
        setTimeout(() => {
          if (this.init) {
            this.hide = true
          }
        }, 800)
      }
    },
    methods: {},
    mounted () {
      console.log(this.init)
    }
  }
</script>

<style scoped lang="less">
  .column-center{
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    background: white;
  }
  .loading-icon {
    width: 120px;
    height: 120px;
    margin: 42vh auto;
  }
  .hide{
    animation: opacity2 800ms ease-in;
    animation-fill-mode: forwards;
  }
  @keyframes opacity2{
    0%{opacity:1}
    50%{opacity:.8;}
    100%{
      opacity:0;
      display: none;
    }
  }
</style>
