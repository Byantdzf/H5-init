<template>
  <div>
    <div class="tab-list">
      <div class="tab-li"
           :class="activeClass == index?'active':''"
           v-for="(item,index) in labels" @click.stop="cutTabClick(item, index)"
           :key="index">{{item.title}}
      </div>
    </div>
    <!--<div class="wire"></div>-->
    <!--<div class="tab-listV2">-->
      <!--<div class="tab-liV2"-->
           <!--:class="actioveV2 == index ?'ActiveV2' : '' "-->
           <!--v-for="(item,index) in groups" @click="cutTabV2Click(item, index)">{{item.title}}</div>-->
    <!--</div>-->
  </div>
</template>

<script>
  export default {
    name: 'live',
    data () {
      return {
        actioveV2: 0,
        groups: [],
        arr: [],
        labels: [],
        activeClass: 0,
        groupsID: '',
        labelsID: []
      }
    },
    methods: {
      cutTabClick (item, index) {
        this.activeClass = index
      },
      getclassify () {
        let vm = this
        this.$http.get(`/official/square`).then(({data}) => {
          vm.groups = data.groups
          vm.labels = data.labels
        })
      },
      getathletics () {
        let vm = this
        let data = {
          label_ids: vm.labelsID
        }
        this.$http.get(`/official/arenas?group_id=` + vm.groupsID, data).then(({data}) => {
        })
      }
    },
    mounted () {
      this.getclassify()
    }
  }
</script>

<style scoped lang="less">
  .tab-list{
    width: 98%;
    height: 100%;
    margin-left: 10px;
    padding-bottom: 18px;
    white-space: nowrap;
    overflow-x:scroll;
  }
  ::-webkit-scrollbar {
    width: 0px;
    display: none;
    background-color: #fff;
  }
  .tab-li {
    display: inline-block;
    width: 138px;
    height: 48px;
    border-radius: 25px;
    border: 1px solid #666666;
    text-align: center;
    line-height: 48px;
    font-size: 24px;
    color: #666666;
    margin-top: 30px;
    margin-left: 20px;
    background:#ffffff;
  }
  /*点击后样式*/
  .active{
    color: #D92553;
    border-color: #D92553;
  }
  .Active{
    display: inline-block;
    width: 138px;
    height: 48px;
    border: 1px solid #D92553;
    border-radius: 25px;
    text-align: center;
    line-height: 48px;
    font-size: 24px;
    margin-top: 30px;
    margin-left: 20px;
    color: #D92553;
    background:#ffffff;
  }
  .wire{
    width: 100%;
    height: 1px;
    background: #b0b0b0;
  }
  .tab-listV2{
    width: 98%;
    height: 100%;
    padding-left: 10px;
    padding-bottom: 35px;
    white-space: nowrap;
    overflow-x:scroll;
  }
  .tab-liV2{
    display: inline-block;
    width: 320px;
    height: 200px;
    border-radius: 6px;
    text-align: center;
    line-height: 200px;
    font-size: 24px;
    color: #ffffff;
    margin-top: 32px;
    margin-left: 20px;
    background:#000000;
  }
  /*点击后样式*/
  .ActiveV2{
    display: inline-block;
    width: 320px;
    height: 200px;
    border-radius: 6px;
    border: 1px solid #666666;
    text-align: center;
    line-height: 200px;
    font-size: 24px;
    color: #D92553;
    margin-top: 30px;
    margin-left: 20px;
    background:#000000;
  }
</style>
