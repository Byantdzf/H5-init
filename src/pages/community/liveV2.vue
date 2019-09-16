<template>

</template>

<script>
  export default {
    name: 'liveV2',
    data () {
      return {
        list: ['推荐', '全部', '招商供应', '招聘求职', '出租求组', '二手设备', '采购求购'],
        actiove: 0
      }
    },
    methods: {
      cutTabClick (index) {
        // console.log(index);
        this.actiove = index
      }
    }
  }
</script>

<style scoped lang="less">

</style>
