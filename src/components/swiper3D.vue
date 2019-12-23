<template>
  <!--<swiper :options="swiperOption" ref="mySwiper">-->
  <!--&lt;!&ndash; 这部分放你要渲染的那些内容 &ndash;&gt;-->
  <!--<swiper-slide v-for="item,index in items" :key="index">-->
  <!--<img :src="item" class="index_img">-->
  <!--</swiper-slide>-->
  <!--&lt;!&ndash; 这是轮播的小圆点 &ndash;&gt;-->
  <!--<div class="swiper-pagination" slot="pagination"></div>-->
  <!--</swiper>-->
  <carousel-3d width="300" height="200" :autoplay="true" :inverseScaling="800" :autoplayTimeout="4200" inverseScaling="100" :controlsVisible="true"
               @onMainSlideClick="onSlideClick">
    <slide :index="index" v-for="item,index in items" :key="index" style="background: none;border: none;">
      <img :src="item" alt="" style="box-shadow: 1px 1px 18px #b1b1b1;">
    </slide>
  </carousel-3d>
</template>

<script>
  import 'swiper/dist/css/swiper.css'
  // import {swiper, swiperSlide} from 'vue-awesome-swiper'
  import {Carousel3d, Slide} from 'vue-carousel-3d'

  export default {
    props: ['init'],
    components: {
      Carousel3d,
      Slide
    },
    data () {
      return {
        items: ['https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=186013082,1813081494&fm=26&gp=0.jpg', 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1764518554,1793241374&fm=26&gp=0.jpg', 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2874178855,3759158108&fm=26&gp=0.jpg']
      }
    },
    computed: {},
    watch: {},
    methods: {
      onSlideClick () {
      }
    },
    mounted () {

    }
  }
</script>

<style scoped lang="less">

</style>
