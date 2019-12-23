<template>
  <swiper :options="swiperOption" ref="mySwiper">
    <swiper-slide v-for="item,index in list" :key="index">
      <div class="swiper-box" @click="routeToDetail(item.user.type, item.user.id)">
        <div class="swiper-image backCover" v-bind:style="{backgroundImage:'url(' + item.photo + ')'}"></div>
      </div>
    </swiper-slide>
    <!--<div class="swiper-pagination" slot="pagination"></div>-->
  </swiper>
</template>

<script>
  import 'swiper/dist/css/swiper.css'
  import {swiper, swiperSlide} from 'vue-awesome-swiper'

  export default {
    props: ['list'],
    components: {
      swiper,
      swiperSlide
    },
    data () {
      return {
        items: ['https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=186013082,1813081494&fm=26&gp=0.jpg', 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1764518554,1793241374&fm=26&gp=0.jpg', 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2874178855,3759158108&fm=26&gp=0.jpg'],
        swiperOption: {
          autoplay: true,
          effect: 'coverflow',
          coverflowEffect: {
            rotate: 12,
            stretch: 0,
            depth: 60,
            modifier: 2,
            slideShadows: false
          },
          pagination: {
            el: '.swiper-pagination'
          }
        },
        // swiperOption: {
        //   autoplay: true,
        //   loop: true,
        //   effect: 'coverflow',
        //   grabCursor: true,
        //   centeredSlides: true,
        //   slidesPerView: 'auto',
        //   loopAdditionalSlides: '0',
        //   observer: true, // 修改swiper自己或子元素时，自动初始化swiper
        //   observeParents: true, // 修改swiper的父元素时，自动初始化swiper
        //   observeSlideChildren: true,
        //   coverflowEffect: {
        //     rotate: 12,
        //     stretch: 0,
        //     depth: 60,
        //     modifier: 2,
        //     slideShadows: false
        //   },
        //   pagination: {
        //     el: '.swiper-pagination',
        //     type: 'bullets'
        //   }
        // },
        swiperSlides: [1, 2, 3, 4, 5]
      }
    },
    computed: {
      swiper () {
        return this.$refs.mySwiper.swiper
      }
    },
    watch: {
      list () {
        console.log(this.list)
      }
    },
    methods: {
      routeToDetail (type, id) {
        if (type === 'single') {
          this.$router.push({name: 'information', params: {id: id}})
        } else {
          this.$router.push({name: 'introducer', params: {id: id}})
        }
      },
      onSlideClick () {
      }
    },
    mounted () {
      // current swiper instance
      // 然后你就可以使用当前上下文内的swiper对象去做你想做的事了
      // console.log('this is current swiper instance object', this.swiper)
      this.swiper.slideTo(1, 1000, false)
    }
  }
</script>

<style scoped lang="less">
  .swiper-box{
    padding: 12px;
    .swiper-image{
      width: 88%;
      height: 680px;
      box-shadow: 1px 1px 12px #d0d0d0;
      margin-left: 6%;
    }
  }
</style>
