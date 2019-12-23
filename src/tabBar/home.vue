<template>
  <div style="padding: 22px">
    <h3>红包项目初始化</h3>
    <div style="padding: 22px 0;">
      <SliderVerificationCode v-model="value"   @change="handleChange" style="border-radius: 8px" >
        <!--<template slot="icon">-->
          <!--<img src="http://img0.imgtn.bdimg.com/it/u=4196167340,3762683264&fm=26&gp=0.jpg" alt="" width="32px" height="32px">-->
        <!--</template>-->
      </SliderVerificationCode>
    </div>
    <!--<div class="vessel" v-if="!showModal">-->
      <!--<img src="http://images.ufutx.com/201907/09/cc558035065ad83a89bb7b5754d918c4.png" alt="" class="close"-->
           <!--@click="hideModal">-->
      <!--<div class="modal-vessel" @click="gotoShare"></div>-->
    <!--</div>-->
  </div>
</template>

<script>
  import {Group, Cell, XHeader, Swiper, XInput, Search, SwiperItem} from 'vux'
  import MescrollVue from 'mescroll.js/mescroll.vue'
  import swiperComponent from '../components/swiper'
  import {$toastSuccess} from '../config/util'

  export default {
    components: {
      Group,
      Cell,
      XHeader,
      Swiper,
      SwiperItem,
      XInput,
      Search,
      swiperComponent,
      MescrollVue
    },
    data () {
      return {
        value: true,
        content: 'asdadasd',
        showModal: false,
        init: false,
        paas: ''
      }
    },
    methods: {
      handleChange (value) {
        console.log('您验证结果为:', value)
        $toastSuccess('验证通过')
      },
      hideModal () {
        this.showModal = false
      },
      gotoLink () {
        window.location.href = 'https://mp.weixin.qq.com/s/Ukz4VwbvFbdL0Wr57iCKSg'
      },
      gotoShare () {
        this.showModal = false
        window.location.href = `http://love.hankin.ufutx.cn/wx/bind/v2`
      },
      goTo (item) {
        this.$router.push({
          name: `communityDetail`,
          params: {id: item.id},
          query: {title: item.title, logo: item.icon}
        })
      },
      goToDetail (item) {
        if (item.id > 2) {
          this.$router.push({
            path: `${item.link}`
          })
          return
        }
        window.location.href = item.link
      }
    },
    mounted () {
      this.paas = localStorage.getItem('paasName')
    }
  }
</script>

<style lang="less" scoped>
  body {
    background: #f7f7f7 !important;
  }

  .vessel {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, .7);

    .close {
      width: 60px;
      position: absolute;
      top: 20%;
      right: 12%;
    }

    .modal-vessel {
      background-image: url("http://images.ufutx.com/201907/09/7f45e1fa8d1774f7f1e9f30b7516221d.png");
      background-size: contain;
      background-repeat: no-repeat;
      animation: myMove 300ms linear;
      animation-fill-mode: forwards;
      @keyframes myMove {
        from {
          width: 0;
          height: 0;
          margin: 27% auto;
        }
        to {
          width: 86%;
          height: 72%;
          margin: 30% auto;
        }
      }
    }
  }
</style>
