<template>
  <div v-transfer-dom>
    <previewer :list="list" ref="previewer" :options="options" @on-index-change="logIndexChange"></previewer>
  </div>
</template>

<script>
  import {Previewer, TransferDom} from 'vux'

  export default {
    props: ['list'],
    directives: {
      TransferDom
    },
    components: {
      Previewer
    },
    data () {
      return {
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
      logIndexChange (arg) {
        console.log(arg)
      }
    }
  }
</script>

<style lang="less" scoped>
</style>
