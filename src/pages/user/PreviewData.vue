<template>
  <div class="whole">
    <div class="background">
      <img class="diamond" src="https://images.ufutx.com/201907/19/06e64f099dab71189ce1298c776c537f.png" alt="">
      <div class="picture backCover" v-bind:style="{backgroundImage:'url(' + avatar + ')'}">
        <uploadOss @onSuccess="onSuccess"></uploadOss>
      </div>
      <p class="text">点击头像上传形象照</p>
      <div class="camera_perfect">
        <div class="perfect inline-block previewer-demo-img" v-for="(item, index) in list"  v-bind:style="{backgroundImage:'url(' + item.src + ')'}" @click="show(index)">
        </div>
      </div>
    </div>
    <div class="notHave"></div>
    <div class="compile">
      <div class="basic_data">基本资料</div>
      <div class="go_compile" @click="routeToDetail">去编辑</div>
    </div>
    <div v-transfer-dom>
      <previewer :list="list" ref="previewer" :options="options" @on-index-change="logIndexChange"></previewer>
    </div>
    <div class="not_have"></div>
    <div class="height160"></div>
    <div class="box_bottom theme_bc" @click="goUser">返回</div>
  </div>
</template>
<script>
  import { Previewer, TransferDom } from 'vux'
  import uploadOss from '../../components/upload_oss'

  export default {
    name: 'PreviewData',
    directives: {
      TransferDom
    },
    components: {
      Previewer,
      uploadOss
    },
    data () {
      return {
        user: {},
        avatar: 'https://images.ufutx.com/201904/15/6099fa31d31f5aa1f2c92986f45d3cfa.gif',
        list: [],
        options: {
          getThumbBoundsFn (index) {
            let thumbnail = document.querySelectorAll('.previewer-demo-img')[index]
            let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
            let rect = thumbnail.getBoundingClientRect()
            return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
          }
        }
      }
    },
    methods: {
      onSuccess (val) {
        this.avatar = val
        let data = {
          photo: this.avatar
        }
        this.$http.put('/official/users/photo', data).then(({data}) => {
          console.log('等待审核...')
        }).catch((error) => {
          console.log(error)
        })
      },
      logIndexChange (arg) {
        console.log(arg)
      },
      show (index) {
        if (index === this.list.length - 1) {
          this.$router.push({name: 'uploadImage'})
        }
        this.$refs.previewer.show(index)
      },
      goUser () {
        this.$router.push({name: 'user'})
      },
      routeToDetail () {
        localStorage.setItem('firstTime', false)
        if (this.user.type === 'single') {
          this.$router.push({name: 'singleData'})
        } else {
          this.$router.push({name: 'marriageData'})
        }
      },
      getUser () {
        this.$http.get(`/official/mine`).then(({data}) => {
          this.user = data
          this.avatar = data.photo
          this.list = data.profile_photos.map((item) => {
            return {
              src: item.photo
            }
          })
          this.list.push({src: 'https://images.ufutx.com/201904/03/aa9d1353dda982cc12441192d67a0948.png'})
          console.log(data.profile_photos)
          console.log(data)
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    mounted () {
      this.getUser()
    }
  }
</script>

<style scoped lang="less">
  .whole{
    height: 100vh;
    background-color: #f0f3f5;
  }
  .background{
    background-color: #ffffff;
  }
  .diamond{
    width: 750px;
    height: 200px;
  }
  .picture{
    width: 176px;
    height: 176px;
    margin: -88px auto 35px;
    position: relative;
    background-size: cover;
    background-repeat: no-repeat;
    box-shadow: 0 0 18px #bebebe;
    border-radius: 50%;
  }
  .text{
    width: 100%;
    font-size: 30px;
    text-align: center;
    color: #bebebe;
    padding-bottom: 40px;
    background-color: #ffffff;
  }
  .camera_perfect{
    width: 710px;
    padding: 0px 20px 35px 20px;
    background-color: #ffffff;
  }
  .perfect{
    width: 222px;
    height: 222px;
    margin: 0 12px 12px 0;
    background-repeat: no-repeat;
    background-size: cover;
  }
  .notHave{
    width: 100%;
    height: 20px;
    background-color: #f8f8f8;
  }
  .compile{
    width: 100%;
    height: 100px;
    background-color: #ffffff;
  }
  .basic_data{
    height: 100px;
    line-height: 100px;
    text-align: center;
    font-size: 30px;
    display: inline-block;
    margin-left: 40px;
    letter-spacing: 1px;
  }
  .go_compile{
    width: 140px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 26px;
    border: 1px solid #344a5d;
    border-radius: 30px;
    display: inline-block;
    margin-left: 390px;
  }
  .box_bottom{
    width: 100%;
    height: 104px;
    font-size: 34px;
    line-height: 104px;
    text-align: center;
    color: #ffffff;
    letter-spacing: 2px;
    position: fixed;
    bottom: 0;
    background-color: #35495e;
  }
</style>
