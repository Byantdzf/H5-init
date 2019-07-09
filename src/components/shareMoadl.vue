<template>
  <div v-transfer-dom>
    <popup v-model="showModal" :is-transparent="true">
      <div class="bc_share backCover" @click="hideModal">
        <img src="http://images.ufutx.com/201907/09/34bdd025c1c4aecbaf26ebf47887ebdc.png" alt="" width="100%"
             style="position:fixed;top: 0;z-index: 9999">
        <img src="http://images.ufutx.com/201907/09/057b2343fc8ed4e76fe8ddf5cd244b4f.png" alt="" width="100%"
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
