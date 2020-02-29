<template>
  <swiper :options="swiperOption" ref="mySwiper">
    <swiper-slide v-for="item,index in 4" :key="index">
      <div class="swiper-box" @click="routeToDetail(item.user.type, item.user.id)">
        <div class="swiper-list">
          <p class="title font26 colorTheme flo_l bold">发布人信息</p>
          <img src="https://hujia.obs.cn-south-1.myhuaweicloud.com:443/manager/3.png" class="photo flo_r" alt="">
          <p class="text font26 color3 flo_l bold">姓名： <span class="bold color6">刘广达</span></p>
          <p class="text font26 color3 flo_l">所在城市： <span  class="color6">广东-深圳</span></p>
          <p class="clearfloat"></p>
          <p class="title font26 colorTheme flo_l bold">订单信息</p>
          <p class="clearfloat"></p>
          <p class="text font26 color3 flo_l ">订单类型： <span class="color6">咨询订单</span></p>
          <p class="text font26 color3 flo_l ">订单编号： <span class="color6">1221122132434434343</span></p>
          <p class="text font26 color3 flo_l ">所属问题： <span class="color6">其他纠纷</span></p>
          <p class="text font26 color3 flo_l ">订单金额： <span class="bold colorTheme">10元</span></p>
          <p class="text font26 color3 flo_l ellipsis_1">发布时间： <span class="color6 ">2020-02-23 18：44萨达，爱的深刻、2020-02-23 18：44</span></p>
          <p class="text font26 color3 flo_l bold">接单律师： <span class="bold color6">刘广达</span></p>
          <img src="https://hujia.obs.cn-south-1.myhuaweicloud.com:443/manager/3.png" class="photo lawyerPhoto flo_r" alt="">
        </div>
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
    margin-bottom: 22px;
    .swiper-list{
      width: 80%;
      box-shadow: 1px 1px 12px #d0d0d0;
      margin-left: 6%;
      padding: 32px;
      overflow: hidden;
      border-radius: 12px;
      .title{
        border-bottom: 1px solid #CF443D;
        margin-bottom: 12px;
        margin-top: 12px;
      }
      .photo{
        width: 92px;
        height: 92px;
        border-radius: 50%;
        margin: 22px 12px 0 0;
        border: 4px solid #e0e0e0;
      }
      .lawyerPhoto{
        margin: -42px 12px 0 0;
      }
      .text{
        width: 72%;
        margin-bottom: 12px;
      }
    }
  }
</style>
