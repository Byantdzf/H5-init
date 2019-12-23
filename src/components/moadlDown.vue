<template>
  <div v-transfer-dom>
    <popup v-model="showModal" :is-transparent="true" position="bottom" @on-hide="hideModal">
      <slot></slot>
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
</style>
