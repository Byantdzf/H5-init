<template>
  <div class="box_background">
    <div class="box_camera_backgruond">
      <div class="bc_box">
        <textarea placeholder="请填写内容" class="input_text" maxlength="120" @input="descInput" v-model="desc"></textarea>
        <div class="circle font28 bold">
          <p class="text">{{remnant}}/120</p>
        </div>
      </div>
      <!--<div class="icon_camera">-->
        <!--<div class="box_camera" v-for="(item,index) in list" :key="index">-->
          <!--<div :style="{ backgroundImage: 'url('+ item +')'}" class="camera_s"></div>-->
        <!--</div>-->
        <!--<div class="box_camera">-->
          <!--<img src="https://images.ufutx.com/201904/09/bb2fdcbe0524ea66203db1407618cc68.png" alt="" class="camera_s">-->
        <!--</div>-->
        <!--<div class="clearfloat"></div>-->
      <!--</div>-->
      <div class="camera_bottom">
        <div class="save font28 theme_bc" @click="save">提交</div>
        <div class="clearfloat"></div>
      </div>
      <div class="clearfloat"></div>
    </div>
  </div>
</template>

<script>
  import {$toastSuccess, $toastWarn} from '../../config/util'

  export default {
    name: 'feedBack',
    data () {
      return {
        desc: '',
        remnant: 0,
        list: []
      }
    },
    methods: { // 方法
      descInput () {
        this.remnant = this.desc.length
      },
      getData () {
        // let vm = this
        this.$http.get(`https://www.easy-mock.com/mock/5cac036b78c07c41509dde60/example/list_copy_1554777362218`).then(({data}) => {
          // vm.list = data.data.list
        }).catch((error) => {
          console.log(error)
        })
      },
      save () {
        if (!this.desc) {
          return $toastWarn('请输入反馈内容')
        }
        let data = {
          content: this.desc
        }
        this.$http.post(`/official/feedback`, data).then(({data}) => {
          $toastSuccess('感谢你的反馈！')
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    mounted () { // 拉取数据
      this.getData()
    }
  }
</script>

<style scoped lang="less">
  .box_background{
    width: 100vw;
    height: 100vh;
    background-color: #f0f3f5;
  }
  .box_camera_backgruond{
    background-color: #ffffff;
  }
  .box{
    /*position: relative;*/
  }
  .circle{
    text-align: right;
    padding: 30px 35px;
  }
  .input_text{
    font-size: 30px;
    padding: 20px 36px;
    width: 678px;
    height: 300px;
    border: none;
    outline: none;
  }
  .icon_camera{
    padding: 0 35px 0 35px;
  }
  .box_camera{
    float: left;
    text-align: center;
    width: 33.3%;
  }
  .camera_s{
    width: 218px;
    height: 218px;
    display: inline-block;
    margin-top: 4px;
    background-size: cover;
    background-repeat: no-repeat;
    /*background: black !important;*/
  }
  .camera_bottom{
    padding-bottom: 60px;
    padding-right: 36px;
    margin-top: 120px;
  }
  .save{
    padding: 12px 22px;
    border-radius: 6px;
    background-color: #00a400;
    float: right;
    color: white;
  }
</style>
