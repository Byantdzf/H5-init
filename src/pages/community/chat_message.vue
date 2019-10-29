<!-- 这是一个简易的范例，重点突出自动滚动底部 -->
<template>
  <div>
    <div class="z_box">
      <div class="chat_box" id="gundong">
        <div>
          <p class="moreMessage inline-block font28" @click="page++,getinteraction()">{{text}}</p>
        </div>
        <div v-for="item in comments" style="overflow: hidden">
          <div class="chat_message flo_l">
            <img :src="item.photo" alt="" class="chat_photo" @click="$router.push({path: `/information/${item.id}`})">
            <div class="chat_name">{{item.name}}</div>
            <div class="chat_comment">{{item.comment}}</div>
          </div>
        </div>
      </div>
      <div class="chat_message_back">
        <div class="chat_message_click">
          <input type="text" class="chat_content" v-model="content" maxlength="20" @click="tokenFn" @blur="fixScroll" placeholder="请输入内容">
          <div class="chat_send" @click="onSend">发送</div>
        </div>
      </div>
    </div>
    <div class="canvas_box">
      <div class="liker">
        <canvas class="hearts-canvas"></canvas>
        <div class="btn backCover" style="background-image:url('https://images.ufutx.com/201910/21/57b3cf74b4d32c109b4926ae3aea030b.png')">
        </div>
      </div>
    </div>
    <img src="https://images.ufutx.com/201910/21/44641052ec087246a15e8551df3adfac.png" alt=""
         @click="$router.push({path: `/live`})" class="icon_home">
  </div>
</template>
<script>
  import '../../javascript/bubbling'
  import {$toastText, $loadingHide} from '../../config/util'

  export default {
    name: 'scroll',
    components: {},
    data () {
      return {
        content: '',
        timeout: null,
        src: 'http://tx.haiqq.com/uploads/allimg/170505/0424395200-4.jpg',
        chat: [],
        comments: [],
        top: '',
        page: 1,
        msg_scrollTop: '',
        inft: true,
        text: '加载更多',
        arena_id: ''
      }
    },
    watch: {
      top: function () {
        if (this.top !== this.msg_scrollTop) {
          clearInterval(this.timer)
        } else {
          this.timer = setInterval(() => {
            this.getinteraction()
          }, 3000)
        }
      }
    },
    methods: {
      fixScroll () {
        let u = navigator.userAgent
        let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
        if (isiOS) {
          window.scrollTo(0, 0)
        }
      },
      getinteraction () {
        let vm = this
        vm.$http.get(`official/arenas/` + vm.arena_id + `/comments?page=${vm.page}`).then(({data}) => {
          vm.inft = data.data
          vm.comments = vm.page === 1 ? [] : vm.comments
          if (data.data.length < 1) {
            this.text = ''
            return
          }
          let comments = []
          for (let item of data.data.reverse()) {
            comments.push(
              {
                created_at: item.created_at,
                id: item.user.id,
                photo: item.user.photo,
                name: item.user.name,
                comment: item.comment
              }
            )
          }
          vm.comments.unshift(...comments)
          this.$nextTick(() => {
            let msg = document.getElementById('gundong') // 获取对象
            msg.scrollTop = msg.scrollHeight // 滚动高度
            this.msg_scrollTop = msg.scrollTop
          })
          $loadingHide(false)
        })
      },
      tokenFn () {
        let cookieArr = document.cookie.split('; ')
        let cookieobj = {}
        cookieArr.forEach((i) => {
          let arr = i.split('=')
          cookieobj[arr[0]] = arr[1]
        })
        if (!cookieobj.ACCESS_TOKEN) {
          $toastText('你尚未登录...')
          setTimeout(() => {
            window.location.href = window.location.href.split('#/')[0] + '#/login'
          }, 800)
        }
      },
      onSend () {
        let data = {
          content: this.content
        }
        this.$http.post(`official/comment/arenas/` + this.arena_id, data).then(({data}) => {
          this.photo = data.user.photo
          this.commented_name = data.user.name
          this.commented_id = data.user.id
          this.created_at = data.created_at
          this.comments.unshift(
            {
              comment: this.content,
              id: this.commented_id,
              name: this.commented_name,
              photo: this.photo,
              created_at: this.created_at
            }
          )
          this.content = ''
          this.page = 1
          // 核心代码
          // 滚动
          this.$nextTick(() => {
            let msg = document.getElementById('gundong') // 获取对象
            msg.scrollTop = msg.scrollHeight // 滚动高度
          })
          this.getinteraction()
        }).catch((error) => {
          console.log(error)
        })
      },
      handleScroll () {
        this.top = document.getElementById('gundong').scrollTop
      }
      // send () {
      //   let info = {info: this.content, src: 'http://tx.haiqq.com/uploads/allimg/170505/0424395200-4.jpg'}
      //   this.chat.push(info)
      //   console.log(this.chat)
      //   // 核心代码
      //   // 滚动
      //   this.$nextTick(() => {
      //     let msg = document.getElementById('gundong') // 获取对象
      //     msg.scrollTop = msg.scrollHeight // 滚动高度
      //   })
      //   this.getinteraction()
      // }
    },
    beforeDestroy () {
      clearInterval(this.timer)
    },
    mounted () {
      document.getElementById('gundong').addEventListener('scroll', this.handleScroll)
      this.arena_id = this.$route.params.id
      this.getinteraction()
    }
  }
</script>
<style scoped>
  @import '../../assets/style/bubbling.css';
  .canvas_box{
    position: absolute;
    z-index: 99;
    bottom: 670px;
    right: 60px;
  }
  .hearts-canvas{
    width: 200px;
    height: 400px;
  }
  .btn{
    margin-left: 80px;
    width: 50px;
    height: 50px;
  }
  .z_box {
    position: absolute;
    bottom: 0;
    z-index: 99;
  }

  .chat_box {
    width: 100vw;
    max-height: 400px;
    overflow: auto;
  }

  .moreMessage {
    margin-left: 200px;
    margin-bottom: 12px;
    border-radius: 6px;
    color: #b0b0b0;
    background-color: rgba(255, 255, 255, 0.4);
  }

  .chat_photo {
    width: 42px;
    height: 42px;
    margin-left: 14px;
    border-radius: 50%;
  }

  .chat_message {
    display: flex;
    max-width: 520px;
    line-height: 42px;
    padding: 4px 10px;
    font-size: 26px;
    border-radius: 24px;
    margin-bottom: 6px;
    margin-left: 24px;
    background-color: rgba(0, 0, 0, 0.6);
  }
  .chat_name {
    max-width: 110px;
    font-size: 26px;
    margin-left: 10px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    color: #fda6a6;
  }
  .chat_comment{
    max-width: 330px;
    margin-left: 10px;
    font-weight: 600;
    color: #fff;
  }
  .chat_message_back{
    max-width: 100vw;
    height: 104px;
    background-color: rgba(0, 0, 0, 0.1);
  }
  .chat_message_click {
    overflow: hidden;
    line-height: 104px;
    text-align: center;
  }
  .chat_content {
    float: left;
    margin-left: 24px;
    margin-top: 20px;
    padding: 0 90px 0 10px;
    width: 600px;
    height: 64px;
    border: none;
    color: #EDEDED;
    border-radius: 18px;
    background-color: rgba(0, 0, 0, 0.6);
  }

  .chat_send {
    /*position: relative;*/
    /*top: -22px;*/
    float: left;
    margin-top: 26px;
    margin-left: -100px;
    left: 388px;
    width: 82px;
    height: 52px;
    text-align: center;
    line-height: 52px;
    background: #D92553;
    border-radius: 18px;
    color: #ffffff;
    font-size: 22px;
  }
  .icon_home {
    position: absolute;
    z-index: 99;
    bottom: 300px;
    right: 30px;
    width: 50px;
  }
</style>
