<!-- 这是一个简易的范例，重点突出自动滚动底部 -->
<template>
  <div>
    <div class="z_box">
      <div class="chat_box" id="gundong">
        <div v-for="item in chat" style="overflow: hidden">
          <img :src="src" alt="" class="chat_photo flo_l">
          <div class="chat_message flo_l">
            <div style="color: white" ><span class="chat_name">曾荣耀：</span>{{item.info}}</div>
          </div>
        </div>
      </div>
      <div>
        <input type="text" class="chat_content" v-model="content">
        <div class="chat_send" @click="take">发送</div>
      </div>
    </div>
  </div>
</template>
<script>
  import componentLike from '../../components/componentLike'
  export default {
    name: 'scroll',
    components: {componentLike},
    data () {
      return {
        content: '',
        src: 'http://tx.haiqq.com/uploads/allimg/170505/0424395200-4.jpg',
        chat: []
      }
    },
    methods: {
      take () {
        let info = {info: this.content, src: 'http://tx.haiqq.com/uploads/allimg/170505/0424395200-4.jpg'}
        this.chat.push(info)
        console.log(this.chat)
        // 核心代码
        // 滚动
        this.$nextTick(() => {
          let msg = document.getElementById('gundong') // 获取对象
          msg.scrollTop = msg.scrollHeight // 滚动高度
        })
      }
    },
    mounted () {
    }
  }
</script>
<style scoped>
  .z_box{
    position: absolute;
    bottom: 20px;
    z-index: 99;
  }
  .chat_box{
    width: 100vw;
    max-height: 500px;
    overflow: auto;
  }
  .chat_photo{
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
    margin-bottom: 20px;
    margin-left: 10px;
    background-color: rgba(0, 0, 0, 0.6);
  }
  .chat_name{
    font-size: 22px;
    color: #D92553;
  }
  .chat_content{
    height: 40px;
    border-radius: 6px;
    -webkit-appearance:none;
    outline: none;
    margin-left: 10px;
    width: 400px;
    margin-top: 30px
  }
  .chat_send{
    display: inline-block;
    width: 80px;
    height: 40px;
    margin-bottom: 20px;
    text-align: center;
    line-height: 40px;
    background: #D92553;
    border: 1px solid #D92553;
    border-radius: 6px;
    color: #ffffff;
    font-size: 22px;
  }
</style>
