<template>
  <div v-transfer-dom>
    <popup v-model="showModal" :is-transparent="true">
      <div class="bc_share backCover" @click="hideModal">
        <img src="https://images.ufutx.com/201907/10/c914e9a9edfcd61b3f9af1bb4d022525.png" alt="" width="100%"
             style="position:fixed;top: 0;z-index: 9999">
        <img src="https://images.ufutx.com/201907/10/c77e6e27f763d29e2a7bf47c4707dcae.png" alt="" width="100%"
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
    background: rgba(0, 0, 0, 0.5);
  }
</style>
