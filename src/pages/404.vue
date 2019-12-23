<template>
  <div id="noPage">
  </div>
</template>

<script>
  export default {
    name: 'noPage',
    data () {
      return {
      }
    },
    methods: {
      onClick () {
        this.$store.dispatch('login')
      }
    },
    mounted () {
      console.log(this.$store.state.route)
    }
  }
</script>

<style  lang="less" scoped>
  body{
    background: #f7f7f7 !important;
   #noPage{
     width: 100vw;
     height: 100vh;
     background-image: url("https://images.ufutx.com/201903/26/0c4732d85260ce96974623baf88fecb5.jpeg");
     background-size: contain;
     background-repeat: no-repeat;
   }
  }
</style>
