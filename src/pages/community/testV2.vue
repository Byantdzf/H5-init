<!-- 这是一个简易的范例，重点突出自动滚动底部 -->
<template>
  <div>
    自己想~~~~~~~~~
  </div>
</template>
<script>
  import componentLike from '../../components/componentLike'
  export default {
    name: 'scroll',
    components: {componentLike},
    data () {
      return {
        chat: [
          {info: '聊天内容，触发后push一个'}
        ],
        i: 1
      }
    },
    methods: {
      take () {
        let info = {info: '聊天内容，触发后push一个' + this.i++}
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
  .test {
    width: 100vw;
    height: 300px;
    overflow: auto;
    background: #D92553;
  }
</style>
