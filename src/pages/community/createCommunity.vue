<template>
  <div style="background: #F6F6F6;">
    <div class="main-bc">
      <div class="logo"  v-bind:style="{backgroundImage:'url(' + information.logo + ')'}" @click="type = 'logo'">
        <uploadOss @onSuccess="onSuccess"></uploadOss>
      </div>
      <div class="main-item ff" v-for="item,index in information.info" :style="index == 5?'border: none;':''">
        <p class="main-title color6" :style="index == 4?'width:62vw':''">{{item.title}}
          <span v-if="index ===4" class="font26">(640px*200px)</span>
          <span class="theme_clo" v-if="index < 4">*</span>
        </p>
        <div class="flo_r">
          <span v-if="item.type === 'input'">
            <input type="text" class="color6 font28 main-input text-right" placeholder="点击填写" v-model="item.value"/>
            <img src="https://images.ufutx.com/201907/25/730a43c929bcc4521dbabb8c76b353ca.png" class="icon" alt="">
          </span>
          <span v-if="item.type === 'picker'">
            <input type="text" class="color6 font28 main-input text-right" placeholder="点击选择" readonly  v-model="communityClass[0]" @click="showPopupPicker = true" />
            <img src="https://images.ufutx.com/201907/25/730a43c929bcc4521dbabb8c76b353ca.png" class="icon" alt="">
          </span>
          <span v-if="item.type === 'image'">
            <div @click="itemIndex = index, type = 'other'">
              <div class="colorb0 font28 main-input text-right" style="width: 22vw;position: relative;"
                   v-if="item.value == ''">
              点击上传
              <img src="https://images.ufutx.com/201907/25/730a43c929bcc4521dbabb8c76b353ca.png" class="icon" alt="">
              <uploadOss @onSuccess="onSuccess"></uploadOss>
              </div>
              <div class="colorb0 font28 main-input text-right" style="width: 22vw;position: relative;" v-else>
                <img :src="item.value" alt="" class="image">
                <img src="https://images.ufutx.com/201907/25/730a43c929bcc4521dbabb8c76b353ca.png" class="icon" alt="">
                <uploadOss @onSuccess="onSuccess"></uploadOss>
              </div>
            </div>
          </span>
        </div>
      </div>
      <div class="main-intro">
        <p class="color6">社群描述<span class="theme_clo" >*</span></p>
        <group>
          <popup-picker :show.sync="showPopupPicker" :show-cell="false" :data="list" v-model="communityClass" popup-title="社群分类"></popup-picker>
        </group>
        <textarea rows="6" cols="25" name="imgTable.imgDesc" class="color6" v-model="information.intro"></textarea>
        <div style="height: 180px;background: #f6f6f6;"></div>
      </div>
    </div>
    <div class="main-buttom">
      <div class="main-cancel flo_l" @click="$router.go(-1)">取消</div>
      <div class="main-save flo_r" @click="save">确定</div>
    </div>
  </div>
</template>

<script>
  import {Group, Cell, XHeader, Swiper, XInput, SwiperItem, PopupPicker} from 'vux'
  import {$toastText, $toastSuccess} from '../../config/util'
  import uploadOss from '../../components/upload_oss'

  export default {
    components: {
      Group,
      Cell,
      XHeader,
      Swiper,
      SwiperItem,
      XInput,
      uploadOss,
      PopupPicker
    },
    data () {
      return {
        id: '',
        type: '',
        init: false,
        communityClass: [],
        showPopupPicker: false,
        list: [],
        classClass: [],
        itemIndex: 0,
        information: {
          logo: 'https://images.ufutx.com/201907/25/5fa19a0b8b779e140a79f4936dc93bc9.png',
          info: [
            {title: '社群信息', type: 'input', value: ''},
            {title: '分类', type: 'picker', value: ''},
            {title: '群二维码', type: 'image', value: ''},
            {title: '群主微信码', type: 'image', value: ''},
            {title: '社群海报', type: 'image', value: ''},
            {title: '海报链接', type: 'input', value: ''}
          ],
          intro: ''
        }
      }
    },
    watch: {
      communityClass (val) {
        for (let item of this.classClass) {
          if (val[0] === item.title) {
            this.information.info[1].value = item.id
          }
        }
        console.log(this.information.info[1].value)
      }
    },
    methods: {
      onSuccess (val) {
        switch (this.type) {
          case 'logo':
            this.information.logo = val
            break
        }
        if (this.itemIndex !== 0) {
          this.information.info[this.itemIndex].value = val
        }
      },
      save () {
        if (this.information.logo === 'https://images.ufutx.com/201907/25/5fa19a0b8b779e140a79f4936dc93bc9.png') {
          return $toastText('请上传群logo图')
        }
        let data = {
          logo: this.information.logo,
          title: this.information.info[0].value,
          group_id: this.information.info[1].value,
          qrcode: this.information.info[2].value,
          wechat_qrcode: this.information.info[3].value,
          poster: this.information.info[4].value,
          poster_path: this.information.info[5].value,
          intro: this.information.intro
        }
        console.log(data)
        if (this.id > 0) {
          this.$http.put(`/official/user/communities/${this.id}`, data).then(({data}) => {
            $toastSuccess('保存成功')
            this.$router.push({name: 'communityClass', params: {id: this.information.info[1].value}})
          }).catch((error) => {
            console.log(error)
          })
          return
        }
        this.$http.post('/official/community', data).then(({data}) => {
          $toastSuccess('创建成功')
          this.$router.push({name: 'communityClass', params: {id: this.information.info[1].value}})
        }).catch((error) => {
          console.log(error)
        })
      },
      getClassList () {
        let vm = this
        vm.$http.get(`/official/community/groups?nopage=1`).then(({data}) => {
          vm.init = true
          vm.classClass = data
          let list = vm.classClass.map((item, index) => {
            return item.title
          })
          vm.list = [[...list]]
        }).catch((error) => {
          console.log(error)
        })
      },
      getOrderList () {
        let vm = this
        vm.$http.get(`/official/user/communities/${vm.id}`).then(({data}) => {
          vm.init = true
          vm.information.logo = data.logo
          vm.information.intro = data.intro
          vm.information.info[0].value = data.title
          vm.information.info[1].value = data.group_id
          vm.information.info[2].value = data.qrcode
          vm.information.info[3].value = data.wechat_qrcode
          vm.information.info[4].value = data.poster
          vm.information.info[5].value = data.poster_path
          for (let item of this.classClass) {
            if (item.id === data.group_id) {
              vm.communityClass[0] = [item.title]
            }
          }
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    mounted () {
      this.id = this.$route.params.id
      console.log(this.id)
      this.getClassList()
      if (this.id > 0) {
        this.getOrderList()
      }
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
        .image{
          width: 36px;
          position: absolute;
          right: 46px;
        }
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

