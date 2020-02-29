<template>
  <div>
    <div class="header">
      <div class="logo">
        <img src="https://images.ufutx.com/202002/29/1bb87d41d15fe27b500a4bfcde01bb0e.png" alt="">
        <div class="register flo_r font24 colorTheme">律师注册</div>
      </div>
      <div class="search">
        <img src="https://images.ufutx.com/202002/29/72c633341b03a93a2461d365f6e498c8.png" class="icon" alt="">
        <input type="text" placeholder="搜索律师" class="font28">
      </div>
    </div>
    <swiper :list="list" :min-moving-distance="120" :show-desc-mask="false"  :auto="true"
            dots-position="center" :interval="2000"></swiper>
    <div class="mainFn">
      <div class="item text-center inline-block" v-for="(item,index) in tabList" :key="index">
        <div class="imgBox">
          <div class="image" v-bind:style="{backgroundImage:'url(' + item.img + ')'}"></div>
        </div>
        <p class="font26 color6">{{item.title}}</p>
      </div>
    </div>
    <!--    // 站内律师排名-->
    <div class="mainTitle">
      <span class="font28 bold colorTheme">站内律师排名</span>
      <div class="flo_r more font26 color6">更多<img src="https://images.ufutx.com/202002/29/3dbd6cf89a117a0f0a1c79d0204b557d.png" alt=""></div>
    </div>
    <div class="lawyerList">
      <div class="listItem" v-for="(item,index) in 4">
        <img src="https://hujia.obs.cn-south-1.myhuaweicloud.com:443/manager/3.png" alt="" class="photo">
        <div class="itemText flo_r">
          <p class="font28 bold color3 flo_l">何金宝</p>
          <p class="font28 bold colorTheme flo_r">4.24分</p>
          <p class="clearfloat"></p>
          <p class="color6 font22 ellipsis_2 info">1995年啊就是打卡很快的哈吉斯大家啊山东矿机大街上登记卡山东矿机阿砂进口的哈见客户看的哈建设大街卡号的接口和健康</p>
          <p class="font22" >
            <span class="color6">已帮助： <span class="colorTheme">38人</span></span>
            <span class="color6">关注数： <span style="color: orange">27人</span></span>
          </p>
        </div>
      </div>
    </div>
<!--    // 最新订单展示-->
    <div class="mainTitle">
      <span class="font28 bold colorTheme">最新订单展示</span>
      <div class="flo_r more font26 color6">更多<img src="https://images.ufutx.com/202002/29/3dbd6cf89a117a0f0a1c79d0204b557d.png" alt=""></div>
    </div>
    <swiperOrder></swiperOrder>
    <!--    // 最新公司动态-->
    <div class="mainTitle" style="border-bottom: 1px solid #eaebee;">
      <span class="font28 bold colorTheme">最新公司动态</span>
      <div class="flo_r more font26 color6" @click="goToNews('2')">更多<img src="https://images.ufutx.com/202002/29/3dbd6cf89a117a0f0a1c79d0204b557d.png" alt=""></div>
    </div>
    <div class="newMsg" v-for="item,index in 2">
      <div class="title flo_l">
        <p class="bold font28 color3 ellipsis_2">华为要NISADJKH撒谎登记卡很阿萨斯撒撒大声科技的好机会AKDH1</p>
        <span class="color6 font26 time">2020-01-12 12:12</span>
      </div>
      <div class="image flo_r" v-bind:style="{backgroundImage:'url(' + 'https://hujia.obs.cn-south-1.myhuaweicloud.com:443/manager/3.png' + ')'}"></div>
    </div>
<!--    最新法律速递-->
    <div class="mainTitle" style="border-bottom: 1px solid #eaebee;">
      <span class="font28 bold colorTheme">最新法律速递</span>
      <div class="flo_r more font26 color6" @click="goToNews('3')">更多<img src="https://images.ufutx.com/202002/29/3dbd6cf89a117a0f0a1c79d0204b557d.png" alt=""></div>
    </div>
    <div class="newMsg" v-for="item,index in 2">
      <div class="title flo_l">
        <p class="bold font28 color3 ellipsis_2">华为要NISADJKH撒谎登记卡很阿萨斯撒撒大声科技的好机会AKDH1</p>
        <span class="color6 font26 time">2020-01-12 12:12</span>
      </div>
      <div class="image flo_r" v-bind:style="{backgroundImage:'url(' + 'https://hujia.obs.cn-south-1.myhuaweicloud.com:443/manager/3.png' + ')'}"></div>
    </div>
<!--    法律文章精选-->
    <div class="mainTitle" style="border-bottom: 1px solid #eaebee;">
      <span class="font28 bold colorTheme">法律文章精选</span>
      <div class="flo_r more font26 color6" @click="goToNews('4')">更多<img src="https://images.ufutx.com/202002/29/3dbd6cf89a117a0f0a1c79d0204b557d.png" alt=""></div>
    </div>
    <div class="newMsg" v-for="item,index in 2">
      <div class="title flo_l">
        <p class="bold font28 color3 ellipsis_2">华为要NISADJKH撒谎登记卡很阿萨斯撒撒大声科技的好机会AKDH1</p>
        <span class="color6 font26 time">2020-01-12 12:12</span>
      </div>
      <div class="image flo_r" v-bind:style="{backgroundImage:'url(' + 'https://hujia.obs.cn-south-1.myhuaweicloud.com:443/manager/3.png' + ')'}"></div>
    </div>
<!--    精彩案例评析-->
    <div class="mainTitle" style="border-bottom: 1px solid #eaebee;">
      <span class="font28 bold colorTheme">精彩案例评析</span>
      <div class="flo_r more font26 color6" @click="goToNews('5')">更多<img src="https://images.ufutx.com/202002/29/3dbd6cf89a117a0f0a1c79d0204b557d.png" alt=""></div>
    </div>
    <div class="newMsg" v-for="item,index in 2">
      <div class="title flo_l">
        <p class="bold font28 color3 ellipsis_2">华为要NISADJKH撒谎登记卡很阿萨斯撒撒大声科技的好机会AKDH1</p>
        <span class="color6 font26 time">2020-01-12 12:12</span>
      </div>
      <div class="image flo_r" v-bind:style="{backgroundImage:'url(' + 'https://hujia.obs.cn-south-1.myhuaweicloud.com:443/manager/3.png' + ')'}"></div>
    </div>
    <div class="main-footer">
      <div class="itemF flo_l">
        <p class="colorff font26">
          <img src="https://images.ufutx.com/202002/29/2f25a041bcbcf4370a4e5c334100db78.png" alt="">3分钟语音答疑</p>
        <p class="colorff font26">
          <img src="https://images.ufutx.com/202002/29/40582c1da0aea0f332d25c5faffca0bd.png" alt="">分块购买所需服务</p>
      </div>
      <div class="itemF flo_r">
        <p class="colorff font26">
          <img src="https://images.ufutx.com/202002/29/8b494f68828c8b42916fe999eca4b97c.png" alt="">专业律师在线</p>
        <p class="colorff font26">
          <img src="https://images.ufutx.com/202002/29/d91666f92a0c75bfae49d2446b16fb87.png" alt="">方便、高效、专业更实惠</p>
      </div>
      <p class="clearfloat"></p>
      <div class="colorff linkF font26">
        <p class="bold">友情链接：</p>
        <span>中国法院网</span>
        <span>中国裁判文书网</span>
        <span>中国执行信息公开网</span>
        <span>深圳华智教育</span>
        <span>登尼特企业服务</span>
        <span>深圳法院网上诉讼服务平台</span>
      </div>
      <p class="colorff font26">粤ICP备19118141号</p>
      <p class="colorff font26">Copyright 2019-2029 hujiaonline.com All Rights Reserved. </p>

    </div>
  </div>
</template>

<script>
  import {Group, Cell, XHeader, Swiper, XInput, Search, SwiperItem} from 'vux'
  import MescrollVue from 'mescroll.js/mescroll.vue'
  import {$toastSuccess} from '../config/util'
  import swiperOrder from '../components/swiperOrder'

  export default {
    components: {
      Group,
      Cell,
      XHeader,
      Swiper,
      SwiperItem,
      XInput,
      Search,
      MescrollVue,
      swiperOrder
    },
    data () {
      return {
        list: [
          {img: 'https://hujia.obs.cn-south-1.myhuaweicloud.com:443/manager/3.png'},
          {img: 'https://hujia.obs.cn-south-1.myhuaweicloud.com:443/manager/3.png'},
          {img: 'https://hujia.obs.cn-south-1.myhuaweicloud.com:443/manager/3.png'}
        ],
        tabList: [
          {
            img: 'https://images.ufutx.com/202002/29/2bb17fe75e7e8351f1b461678b704e4e.png',
            title: '在线律师咨询'
          },
          {
            img: 'https://images.ufutx.com/202002/29/b50505615a08ef3fb2a85841ff86dfa7.png',
            title: '指定律师咨询'
          },
          {
            img: 'https://images.ufutx.com/202002/29/ccabf0b9ae33b16025a62d32a4141e5b.png',
            title: '日常法律服务'
          },
          {
            img: 'https://images.ufutx.com/202002/29/16e547f5f004810d1ad2f154c10f28e9.png',
            title: '拆分法律服务'
          },
          {
            img: 'https://images.ufutx.com/202002/29/093a4a0c3ea2fca1f1baddf6e55fa78c.png',
            title: '收费代理'
          },
          {
            img: 'https://images.ufutx.com/202002/29/14643a0826baaac636a3dc88a3120db4.png',
            title: '风险代理'
          },
          {
            img: 'https://images.ufutx.com/202002/29/ee095037e7343b368db6ef06e8606716.png',
            title: '协议文本'
          },
          {
            img: 'https://images.ufutx.com/202002/29/6b293d95ad520e153b12439c9d74dcf7.png',
            title: '律师精选'
          }
        ]
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
      goToNews (id) {
        this.$router.push({
          path: `/articleList?type=${id}`
        })
      },
      goToDetail (item) {
        if (item.id > 2) {
          this.$router.push({
            path: `/articleList?id=${item.link}`
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
  .header{
    overflow: hidden;
    padding: 32px;
    .logo {
      img {
        width: 76%;
      }
      .register{
        margin-top: 22px;
      }
    }
    .search{
      background: #f7f8fa;
      margin: auto;
      margin: 8px;
      padding: 8px 12px;
      border-radius: 32px;
      input{
        background: #f7f8fa;
        border: none;
        width: 86%;
        height: 100%;
      }
      .icon{
        width: 32px;
        height: 32px;
        margin-bottom: -5px;
      }
    }
  }
  .mainFn{
    margin: 32px 0 12px 0;
    .item{
      width: 25%;
      margin-bottom: 22px;
      .image{
        width: 60px;
        height: 60px;
        background-size: contain;
        background-repeat:no-repeat ;
        background-position: center;
        margin: auto;
      }
    }
    .imgBox{
      padding: 22px;
      display: inline-block;
      box-shadow: 1px 1px 12px #d0d0d0;
      border-radius: 50%;
    }
  }
  .mainTitle{
    border-top: 12px solid #f7f7f8;
    padding: 22px;
    padding-left: 32px;
    position: relative;
    .more{
      margin-top: 8px;
      img {
        width: 22px;
        height: 22px;
      }
    }
    &:before{
      content: '';
      width: 6px;
      height: 36px;
      position: absolute;
      top: 28px;
      left: 14px;
      background: #CF443D;
      border-radius: 42px;
    }
  }
  .lawyerList{
    .listItem{
      padding: 12px 22px;
      border-bottom: 1px solid #f7f7f8;
      overflow: hidden;
     .photo{
       background: pink;
       border-radius: 50%;
       width: 90px;
       height: 90px;
     }
    }
    .itemText{
      width: 85%;
      .info{
        margin-top: 6px;
      }
    }
  }
  .newMsg{
    padding: 14px 32px;
    overflow: hidden;
    border-bottom: 1px solid #eaebee;
    .image{
      width: 38%;
      height: 140px;
      background-size: cover;
    }
    .title{
      width: 62%;
      height: 140px;
      position: relative;
      p{padding-right: 12px;}
      .time {
        position: absolute;
        left: 0;
        bottom: 8px;
      }
    }
  }
  .main-footer{
    background: #CF443D;
    padding: 32px;
    margin-top: 120px;
    img {
      width: 40px;
      height: 40px;
      margin-bottom: -8px;
      margin-right: 4px;
    }
    .itemF{
      p{
        margin-bottom: 22px;
      }
      width: 50%;
      display: inline-block;
    }
    .linkF{
      margin: 16px 0;
      margin-top: 32px;
      p{
        margin: 12px 0;
      }
      /*span{*/
      /*  padding: 0 8px;*/
      /*}*/
    }
  }
</style>
