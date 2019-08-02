<template>
    <div class="chitchat" id="chitchat">
      <div class="hint font26 color6"><div class="color6 font30">温馨提示</div>请各位会员自觉遵守法律法规，<span class="theme_clo">遇到转款切勿相信，谨防上当受骗，</span>未实名认证的会员保持警惕；交友期保持必要的界限，保证自身安全，请勿轻易委身于人，<span class="theme_clo">请勿和用户发生借贷关系，</span>否则后果自己承担。
      </div>
      <div class="text-center">
        <p class="history font26 color6 inline-block color6"  @click="History">{{text}}</p>
      </div>
      <div class="j_page" v-for="(item,index) in messages" :key="index">
        <p class="font26 text-center colorbe zy_time">{{item.time}}</p>
        <div class="clearfix" v-if="item.me == 'Y'">
          <div class="right-Avatar flo_r backCover" v-bind:style="{backgroundImage:'url(' + item.avatar + ')'}" ></div>
          <div class="right-message flo_r theme_bc colorff font26">
            {{item.contents}}
          </div>
          <div class="clearfloat"></div>
        </div>
        <div class="clearfix" v-else>
          <div class="right-Avatar flo_l backCover" v-bind:style="{backgroundImage:'url(' + item.avatar + ')'}" ></div>
          <div class="left-message flo_l ff color6 font26">
            {{item.contents}}
          </div>
          <div class="clearfloat"></div>
        </div>
      </div>
      <div class="height160"></div>
      <div class="wa-row">
        <div class="padding_half flo_l">
          <input type="text" v-model="content"/>
        </div>
        <input type="button" size='mini' :disabled="content.length == 0" @click="sendMsg" class="send-button flo_r font28 theme_bc" value="发送"/>
      </div>
    </div>
</template>

<script>
  export default {
    name: 'chitchat',
    data () {
      return {
        avatar: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1122649470,955539824&fm=27&gp=0.jpg',
        content: '',
        messages: [],
        min_id: '',
        max_id: '',
        other_userId: '',
        text: '',
        Loadingtime: ''
      }
    },
    methods: {
      refreshV () {
        let that = this
        let url = `/official/refresh/chat/messages/${this.other_userId}?content=${this.content}&max_id=${this.max_id}`
        this.$http.get(url).then(({data}) => {
          if (data.length === 0) { return }
          that.max_id = data[0].id
          console.log('刷新成功')
          let message = {}
          data.forEach((item, index, arr) => {
            console.log(arr[index].id)
            message = {
              id: 'id_' + Date.parse(new Date()) / 1000,
              contents: arr[index].content,
              me: arr[index].is_mine === 1 ? 'Y' : 'N',
              avatar: arr[index].avatar,
              time: arr[index].created_at
            }
            that.messages.push(message)
            that.msg = ''
            that.toView = 'id_' + Date.parse(new Date()) / 1000
          })
          console.log(message)
        }).catch((error) => {
          console.log(error)
        })
      },
      sendMsg () {
        let url = `/official/send/chat/messages/to/users/${this.other_userId}?content=${this.content}&max_id=${this.max_id}`
        this.$http.post(url).then(({data}) => {
          this.max_id = data[0].id
          console.log('发送成功')
          console.log(data)
          let message = {}
          data.forEach((item, index, arr) => {
            console.log(arr[index].id)
            message = {
              id: 'id_' + Date.parse(new Date()) / 1000,
              contents: arr[index].content,
              me: arr[index].is_mine === 1 ? 'Y' : 'N',
              avatar: arr[index].avatar,
              time: arr[index].created_at
            }
            this.messages.push(message)
            this.content = ''
            this.scrollToBottom()
          })
          console.log(message)
        }).catch((error) => {
          console.log(error)
        })
      },
      History () {
        let that = this
        let url = `/official/chat/messages/with/users/${this.other_userId}?min_id=${this.min_id}`
        this.$http.get(url).then(({data}) => {
          if (data.length === 0) {
            that.text = '到顶了'
            return
          }
          that.min_id = data[data.length - 1].id
          let message = []
          data.forEach((item, index, arr) => {
            message = {
              id: arr[index].id,
              contents: arr[index].content,
              me: arr[index].is_mine === 1 ? 'Y' : 'N',
              avatar: arr[index].avatar,
              time: arr[index].created_at
            }
            that.messages.unshift(message)
          })
          console.log(this.messages)
        }).catch((error) => {
          console.log(error)
        })
      },
      getData () {
        let url = `/official/chat/messages/with/users/${this.other_userId}`
        this.$http.get(url).then(({data}) => {
          this.text = '点击查看更多'
          let message = []
          if (data.length === 0) {
            this.text = '暂无消息'
            return
          }
          this.min_id = data[data.length - 1].id
          this.max_id = data[0].id
          data.forEach((item, index, arr) => {
            message = {
              id: arr[index].id,
              contents: arr[index].content,
              me: arr[index].is_mine === 1 ? 'Y' : 'N',
              avatar: arr[index].avatar,
              time: arr[index].created_at
            }
            this.messages.unshift(message)
          })
          console.log(this.messages)
        }).catch((error) => {
          console.log(error)
        })
      },
      scrollToBottom () {
        this.$nextTick(() => {
          let container = document.getElementById('chitchat')
          container.scrollTop = container.scrollHeight
        })
      }
    },
    updated () {
      this.scrollToBottom()
    },
    beforeDestroy () {
      clearInterval(this.Loadingtime)
    },
    mounted () {
      this.other_userId = this.$route.params.id
      this.getData()
      this.scrollToBottom()
      this.Loadingtime = setInterval(() => {
        this.refreshV()
      }, 8000)
    }
  }
</script>

<style scoped lang="less">
  .chitchat{
    background: #f7f7fa;
    min-height: 100vh;
    .hint{
      background: rgba(251, 251, 251, 0.99);
      display: inline-block;
      padding: 6px 12px;
      border-radius: 10px;
      margin: 18px 48px 0px 48px;
      line-height: 1.6;
      border: 1px solid #d3d3d3;
    }
    .wa-row{
      width: 100vw;
      padding: 12px 0;
      height: 76px;
      background: white;
      position: fixed;bottom: 0;
      line-height: 100px;
      left: 0;
    }
    .padding_half{
      flex:1;
      height:80px;
      line-height: 76px;
      input{
        width: 72vw;
        margin-left: 4vw;
        padding: 0 2vw;
        height:60px;
        border: none;
        border: 1px solid #dcdcdc;
        border-radius: 12px;
      }
    }
    .send-button{
      padding: 0 22px;
      height: 64px;
      border: none;
      margin-right: 4vw;
      border-radius: 6px;
      line-height: 60px;
      color: white;
      margin-top: 8px;
    }
    .history{
      background: #DADADA;
      padding: 6px 12px;
      border-radius: 6px;
      margin: 22px auto;
      margin-bottom: 22px;
    }
    .j_page{
      padding: 32px;
      .zy_time{
        margin-bottom: 12px;
      }
      .right-Avatar {
        width: 86px;
        height: 86px;
      }
      .clearfix{
        margin-bottom: 12px;
      }
      .right-message{
        max-width: 70vw;
        margin-right: 22px;
        margin-top: 10px;
        padding: 0 12px;
        line-height: 60px;
        /*background: yellowgreen;*/
        border-radius: 8px;
        position: relative;
        &:after{
          content: ' ';
          position: absolute;
          right: -12px;
          top: 12px;
          width: 0;
          height: 0;
          border-top: 16px solid transparent;
          /*border-left: 24px solid yellowgreen;*/
          border-left: 24px solid #D92553;
          border-bottom: 16px solid transparent;
        }
      }
      .left-message{
        max-width: 70vw;
        margin-left: 22px;
        margin-top: 10px;
        padding: 0 12px;
        line-height: 60px;
        /*background: yellowgreen;*/
        border-radius: 8px;
        position: relative;
        &:before{
          content: ' ';
          position: absolute;
          left: -12px;
          top: 12px;
          width: 0;
          height: 0;
          border-top: 16px solid transparent;
          border-right: 24px solid #ffffff;
          /*border-right: 24rpx solid white;*/
          border-bottom: 16px solid transparent;
        }
      }
    }
  }
</style>
