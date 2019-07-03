<template>
  <div v-transfer-dom>
    <popup v-model="showModal" :is-transparent="true">
      <div class="bc_share backCover" @click="hideModal">
        <img src="https://images.ufutx.com/201904/24/43e0d6008b6f9c6282188b52f4113648.png" alt="" width="100%"
             style="position:fixed;top: 0;z-index: 9999">
        <img src="https://images.ufutx.com/201904/24/50228a05c7311dffe4962b3e99c239ee.png" alt="" width="100%"
             class="fixed_bot">
      </div>
    </popup>
  </div>
</template>

<script>
  import {TransferDom, Popup} from 'vux'

  export default {
    props: ['show'],
    directives: {
      TransferDom
    },
    components: {
      Popup
    },
    data () {
      return {
        showModal: this.show
      }
    },
    watch: {
      show (val) {
        this.showModal = val
        console.log(val)
      }
    },
    methods: {
      hideModal () {
        this.$emit('hideModal', false)
      }
    },
    mounted () {
    }
  }
</script>

<style  lang="less" scoped>
  .bc_share {
    width: 100%;
    height: 100vh;
    position: relative;
    background: rgba(0, 0, 0, 0.3);
  }
</style>
