<template>
  <div style="background: #F6F6F6;">
    <div class="main-bc">
      <div class="logo"  v-bind:style="{backgroundImage:'url(' + information.logo + ')'}" @click="type = 'logo'">
        <uploadOss @onSuccess="onSuccess"></uploadOss>
      </div>
      <div class="main-item ff" v-for="item,index in information.info" :style="index == 5?'border: none;':''">
        <p class="main-title color6" :style="index == 4?'width:62vw':''">{{item.title}} <span v-if="index ===4" class="font26">(640px*200px)</span></p>
        <div class="flo_r">
          <span v-if="item.type === 'input'">
            <input type="text" class="colorb0 font28 main-input text-right" placeholder="点击填写" :value="item.value"/>
          </span>
          <span v-if="item.type === 'image'">
            <input type="text" class="colorb0 font28 main-input text-right" style="width: 22vw" placeholder="点击上传" />
          </span>
          <img src="https://images.ufutx.com/201907/25/730a43c929bcc4521dbabb8c76b353ca.png" class="icon" alt="">
        </div>
      </div>
      <div class="main-intro">
        <p class="color6">社群描述</p>
        <textarea rows="6" cols="25" name="imgTable.imgDesc"></textarea>
        <div style="height: 180px;background: #f6f6f6;"></div>
      </div>
    </div>
    <div class="main-buttom">
      <div class="main-cancel flo_l">取消</div>
      <div class="main-save flo_r" @click="save">确定</div>
    </div>
  </div>
</template>

<script>
  import {Group, Cell, XHeader, Swiper, XInput, SwiperItem} from 'vux'
  // import {$toastText} from '../../config/util'
  import uploadOss from '../../components/upload_oss'

  export default {
    components: {
      Group,
      Cell,
      XHeader,
      Swiper,
      SwiperItem,
      XInput,
      uploadOss
    },
    data () {
      return {
        id: '',
        type: '',
        information: {
          logo: 'https://images.ufutx.com/201907/25/5fa19a0b8b779e140a79f4936dc93bc9.png',
          info: [
            {title: '社群信息', type: 'input', value: ''},
            {title: '分类', type: 'input', value: ''},
            {title: '群二维码', type: 'image', value: ''},
            {title: '群主微信码', type: 'image', value: ''},
            {title: '社群海报', type: 'image', value: ''},
            {title: '海报链接', type: 'input', value: ''}
          ],
          intro: ''
        }
      }
    },
    methods: {
      onSuccess (val) {
        console.log(val)
        switch (this.type) {
          case 'logo':
            this.information.logo = val
            break
        }

        // this.avatar = val
        // let data = {
        //   photo: this.avatar
        // }
        // this.$http.put('/official/users/photo', data).then(({data}) => {
        //   console.log('等待审核...')
        // }).catch((error) => {
        //   console.log(error)
        // })
      },
      save () {
        console.log(this.information)
      }
    },
    mounted () {
      this.id = this.$route.params.id
    }
  }
</script>

<style lang="less" scoped>
  .main-bc{
    width: 100vw;
    background: white;
    background-image: url("https://images.ufutx.com/201907/25/2f03aa6c5960592f7f28aa1c6cdb35c4.png");
    background-repeat: no-repeat;
    background-size: contain;
    padding-top: 36vw;
    overflow: hidden;
    .logo{
      width: 190px;
      height: 190px;
      border-radius: 50%;
      background-repeat: no-repeat;
      background-size: contain;
      margin: auto;
      overflow: hidden;
      position: relative;
    }
    .main-item{
      border-bottom: 1px solid #b0b0b0;
      padding: 30px 16px;
      overflow: hidden;
      .main-title{
        float: left;
        width: 40vw;
      }
      .main-input{
        border: none;
      }
      .icon{
        width: 36px;
        vertical-align: middle;
      }
      ::-webkit-input-placeholder {
        color: #b0b0b0;
      }
      ::-moz-placeholder {
        color: #b0b0b0;
      }
      :-ms-input-placeholder {
        color: #b0b0b0;
      }
    }
    .main-intro{
      p {
        background: #f6f6f6;
        padding: 6px 16px;
      }
      textarea{
        width: 96%;
        resize: none;
        border: none;
        padding: 2%;
      }
    }
  }
  .main-buttom{
    position: fixed;
    bottom: 1%;
    left: 0;
    width: 100%;
    background: none;
    .main-cancel,.main-save{
      width: 256px;
      height: 60px;
      line-height: 60px;
      border: 1px solid #D82653;
      text-align: center;
      color: #D82653;
      border-radius: 8px;
      margin: 38px 20px;
    }
    .main-save{
      background: #D82653;
      color: white;
    }
  }
</style>

