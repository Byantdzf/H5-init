<!-- 这是一个简易的范例，重点突出自动滚动底部 -->
<template>
  <div>
    <div class="z_box">
      <div class="chat_box" id="gundong">
        <div>
          <p class="moreMessage inline-block font28" @click="page++,getinteraction()">{{text}}</p>
        </div>
        <div v-for="item in comments" style="overflow: hidden">
          <img :src="item.photo" alt="" class="chat_photo flo_l">
          <div class="chat_message flo_l">
            <div style="color: white"><span class="chat_name">{{item.name}}：</span>{{item.comment}}</div>
          </div>
        </div>
      </div>
      <div class="chat_message_click">
        <input type="text" class="chat_content" v-model="content" maxlength="30" @click="tokenFn">
        <div class="chat_send" @click="onSend">发送</div>
        <img src="https://images.ufutx.com/201909/18/982e873c34b48881d10519435e0c0188.png" alt=""
             @click="$router.push({path: `/live`})" class="icon_home">
      </div>
    </div>
    <!--<componentLike></componentLike>-->
  </div>
</template>
<script>
  import componentLike from '../../components/componentLike'
  import {$toastText, $loadingHide} from '../../config/util'

  export default {
    name: 'scroll',
    components: {componentLike},
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
  .z_box {
    position: absolute;
    bottom: 20px;
    z-index: 99;
  }

  .chat_box {
    width: 100vw;
    max-height: 350px;
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
    width: 44px;
    height: 44px;
    margin-left: 10px;
    border-radius: 50%;
  }

  .chat_message {
    max-width: 460px;
    word-wrap: break-word;
    line-height: 42px;
    padding: 4px 10px;
    font-size: 22px;
    border-radius: 10px;
    margin-bottom: 12px;
    margin-left: 10px;
    background-color: rgba(0, 0, 0, 0.6);
  }

  .chat_name {
    font-size: 22px;
    color: #D92553;
  }

  .chat_message_click {
    overflow: hidden;
    width: 500px;
    margin-top: 20px;
    margin-left: 76px;
  }

  .chat_content {
    float: left;
    width: 300px;
    height: 40px;
    border: none;
    border-radius: 6px 0 0 6px;
    -webkit-appearance: none;
    outline: none;
  }

  .chat_send {
    float: left;
    width: 80px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    background: #D92553;
    border-radius: 0 6px 6px 0;
    color: #ffffff;
    font-size: 22px;
  }

  .icon_home {
    width: 38px;
    height: 38px;
    border: 1px solid #fff;
    margin-left: 30px;
    border-radius: 50%;
  }
</style>
