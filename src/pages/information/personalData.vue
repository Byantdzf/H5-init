<template>
  <div id="personalData">
    <div class="setting ff">
      <div class="bc_background text-center">
        <img class="bc_img_back" src="https://images.ufutx.com/201907/24/2f03aa6c5960592f7f28aa1c6cdb35c4.png" alt="">
        <div class="uploading backCover" :style="{backgroundImage:'url(' + avatar + ')'}">
          <uploadOss @onSuccess="onSuccess"></uploadOss>
        </div>
      </div>
    </div>
    <!--<div class="wrapper ff">-->
      <!--<div class="bc_avatar text-center" >-->
        <!--<img class="bc_back" src="https://images.ufutx.com/201907/24/2f03aa6c5960592f7f28aa1c6cdb35c4.png" alt="">-->
        <!--<div class="avatar backCover" v-bind:style="{backgroundImage:'url(' + avatar + ')'}" >-->
          <!--<uploadOss @onSuccess="onSuccess"></uploadOss>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
    <ul>
      <li class="list-item">
        <span class="title font32">姓名</span>
        <div class="flo_r">
          <input type="text" class="middle text-right font30 color6" v-model="name" placeholder="点击填写">
          <!--<img src="../../src/assets/icon/go.png" alt="icon" class="icon">-->
        </div>
      </li>
      <!--<li class="list-item">-->
      <!--<span class="title font36">手机号码</span>-->
      <!--<div class="flo_r">-->
      <!--<span class="colorbe font30">点击获取</span>-->
      <!--&lt;!&ndash;<img src="../../src/assets/icon/go.png" alt="icon" class="icon">&ndash;&gt;-->
      <!--</div>-->
      <!--</li>-->
      <li class="list-item">
        <span class="title font32">性别 <span class="font26">（性别选择后无法修改）</span></span>
        <div class="flo_r" @click="showSex = !showSex">
          <span class="font30 " :class="{color6: sex.length!==0,colorbe:sex.length==0}" >{{sex.length==0?'请选择':sex}}</span>
          <img src="../../assets/icon/go.png" alt="icon" class="icon">
        </div>
      </li>
      <li class="list-item">
        <span class="title font32">出生日期</span>
        <div class="flo_r" @click="showDate">
          <span class="font30" :class="{color6: birthday.length!==0,colorbe:birthday.length==0}"  >{{birthday.length==0?'请选择':birthday}}</span>
          <img src="../../assets/icon/go.png" alt="icon" class="icon">
        </div>
      </li>
      <li class="list-item">
        <span class="title font32">信仰</span>
        <div class="flo_r" @click="showBelief = !showBelief">
          <span class="font30" :class="{color6: belief.length!==0,colorbe:belief.length==0}"  >{{belief.length==0?'请选择':belief}}</span>
          <img src="../../assets/icon/go.png" alt="icon" class="icon">
        </div>
      </li> 
    </ul>
    <div class="bc_box font32">
      <ul>
        <li class="bachelordom" @click="onClick('single')">我是单身</li>
        <li class="married" @click="onClick('marriage')">我是已婚</li>
      </ul>
    </div>
    <!--<div class="fixed_bot subjectColor colorff bc_box font32">-->
      <!--<ul>-->
        <!--<li class="inline-block after" @click="onClick('single')">我是单身</li>-->
        <!--<li class="inline-block" @click="onClick('marriage')">我是介绍人</li>-->
      <!--</ul>-->
    <!--</div>-->
    <group>
      <popup-picker style="display:none;" title="title1" :data="sexList"   @on-shadow-change="onChange('sex', $event)"  @on-change="onChange('sex', $event)" :show.sync="showSex"></popup-picker>
      <popup-picker style="display:none;" title="" :data="beliefList"   @on-shadow-change="onChange('belief', $event)"  @on-change="onChange('belief', $event)" :show.sync="showBelief"></popup-picker>
      <!--<x-address style="display:none;" title="title" :hide-district="true" :list="addressData" placeholder="请选择地址" :show.sync="showAddress" @on-shadow-change="onShowChange"  @on-change="onShowChange"></x-address>-->
    </group>
  </div>
  <!--<div id="personalData">-->
    <!--<div class="wrapper ff">-->
      <!--<div class="bc_avatar text-center" >-->
        <!--<div class="avatar backCover" v-bind:style="{backgroundImage:'url(' + avatar + ')'}" >-->
          <!--<uploadOss @onSuccess="onSuccess"></uploadOss>-->
        <!--</div>-->
        <!--&lt;!&ndash;<router-link to="upload">&ndash;&gt;-->
          <!--<p class="font26">添加个人形象照</p>-->
        <!--&lt;!&ndash;</router-link>&ndash;&gt;-->
      <!--</div>-->
      <!--&lt;!&ndash;<input @change="uploadPhoto" type="file" class="kyc-passin">&ndash;&gt;-->
    <!--</div>-->
    <!--<ul>-->
      <!--<li class="list-item">-->
        <!--<span class="title font32">姓名</span>-->
        <!--<div class="flo_r">-->
          <!--<input type="text" class="middle text-right font30 color6" v-model="name" placeholder="点击填写">-->
          <!--&lt;!&ndash;<img src="../../src/assets/icon/go.png" alt="icon" class="icon">&ndash;&gt;-->
        <!--</div>-->
      <!--</li>-->
      <!--&lt;!&ndash;<li class="list-item">&ndash;&gt;-->
        <!--&lt;!&ndash;<span class="title font36">手机号码</span>&ndash;&gt;-->
        <!--&lt;!&ndash;<div class="flo_r">&ndash;&gt;-->
          <!--&lt;!&ndash;<span class="colorbe font30">点击获取</span>&ndash;&gt;-->
          <!--&lt;!&ndash;&lt;!&ndash;<img src="../../src/assets/icon/go.png" alt="icon" class="icon">&ndash;&gt;&ndash;&gt;-->
        <!--&lt;!&ndash;</div>&ndash;&gt;-->
      <!--&lt;!&ndash;</li>&ndash;&gt;-->
      <!--<li class="list-item">-->
        <!--<span class="title font32">性别 <span class="font26">（性别选择后无法修改）</span></span>-->
        <!--<div class="flo_r" @click="showSex = !showSex">-->
          <!--<span class="font30 " :class="{color6: sex.length!==0,colorbe:sex.length==0}" >{{sex.length==0?'请选择':sex}}</span>-->
          <!--<img src="../../assets/icon/go.png" alt="icon" class="icon">-->
        <!--</div>-->
      <!--</li>-->
      <!--<li class="list-item">-->
        <!--<span class="title font32">出生日期</span>-->
        <!--<div class="flo_r" @click="showDate">-->
          <!--<span class="font30" :class="{color6: birthday.length!==0,colorbe:birthday.length==0}"  >{{birthday.length==0?'请选择':birthday}}</span>-->
          <!--<img src="../../assets/icon/go.png" alt="icon" class="icon">-->
        <!--</div>-->
      <!--</li>-->
      <!--<li class="list-item">-->
        <!--<span class="title font32">信仰</span>-->
        <!--<div class="flo_r" @click="showBelief = !showBelief">-->
          <!--<span class="font30" :class="{color6: belief.length!==0,colorbe:belief.length==0}"  >{{belief.length==0?'请选择':belief}}</span>-->
          <!--<img src="../../assets/icon/go.png" alt="icon" class="icon">-->
        <!--</div>-->
      <!--</li>-->
    <!--</ul>-->
    <!--<div class="fixed_bot subjectColor colorff bc_box font32">-->
      <!--<ul>-->
        <!--<li class="inline-block after" @click="onClick('single')">我是单身</li>-->
        <!--<li class="inline-block" @click="onClick('marriage')">我是介绍人</li>-->
      <!--</ul>-->
    <!--</div>-->
    <!--<group>-->
      <!--<popup-picker style="display:none;" title="title1" :data="sexList"   @on-shadow-change="onChange('sex', $event)"  @on-change="onChange('sex', $event)" :show.sync="showSex"></popup-picker>-->
      <!--<popup-picker style="display:none;" title="" :data="beliefList"   @on-shadow-change="onChange('belief', $event)"  @on-change="onChange('belief', $event)" :show.sync="showBelief"></popup-picker>-->
      <!--&lt;!&ndash;<x-address style="display:none;" title="title" :hide-district="true" :list="addressData" placeholder="请选择地址" :show.sync="showAddress" @on-shadow-change="onShowChange"  @on-change="onShowChange"></x-address>&ndash;&gt;-->
    <!--</group>-->
  <!--</div>-->
</template>

<script>
  import {DatetimePlugin, Group, XButton, XAddress, ChinaAddressV4Data, PopupPicker} from 'vux'
  import uploadOss from '../../components/upload_oss'
  export default {
    name: 'personalData',
    components: {
      DatetimePlugin,
      Group,
      XButton,
      XAddress,
      ChinaAddressV4Data,
      PopupPicker,
      uploadOss
    },
    data () {
      return {
        birthday: '',
        sex: '',
        avatar: 'https://images.ufutx.com/201907/24/071405ca109d301a75067f85948d0ce7.png',
        sexList: [['男', '女']],
        belief: '',
        beliefList: [['基督教', '佛教', '伊斯兰教', '其他']],
        showSex: false,
        name: '',
        address: '',
        addressData: ChinaAddressV4Data,
        ossConfig: '',
        host: '',
        file: null,
        showBelief: false
      }
    },
    watch: {
    },
    methods: {
      onSuccess (val) {
        this.avatar = val
        let data = {
          photo: this.avatar
        }
        this.$http.put('/official/users/photo', data).then(({data}) => {
          console.log('等待审核...')
        }).catch((error) => {
          console.log(error)
        })
      },
      uploadPhoto (e) {
        this.file = e.target.files[0]
        this.chooseImage()
        console.log(this.file)
        // var filesize = file.size;
        // var filename = file.name;
        // // 2,621,440   2M
        // if (filesize > 2101440) {
        //   // 图片大于2MB
        //
        // }
        // var reader = new FileReader();
        // reader.readAsDataURL(file);
        // reader.onload = function (e) {
        //
        //   // 读取到的图片base64 数据编码 将此编码字符串传给后台即可
        //   var imgcode = e.target.result;
        //   console.log(imgcode);
        // }
      },
      onChange (type, val) {
        console.log('val change', val)
        this[type] = val[0]
      },
      showDate () {
        let vm = this
        vm.$vux.datetime.show({
          value: 'birthday', // 其他参数同 props
          minYear: '1960',
          maxYear: '2019',
          confirmText: '确定',
          cancelText: '取消',
          onConfirm (value) {
            vm.birthday = value
          }
        })
      },
      onClick (type) {
        let data = {
          birthday: this.birthday,
          sex: this.sex === '男' ? 1 : 2,
          name: this.name,
          belief: this.belief,
          type: type,
          photo: this.avatar
        }
        this.$http.put('/official/users/profile', data).then(({data}) => {
          localStorage.setItem('firstTime', true)
          if (localStorage.getItem('jump')) {
            window.location.href = localStorage.getItem('jump')
          } else {
            if (type === 'single') {
              this.$router.push({
                name: 'singleData'
              })
            } else {
              this.$router.push({
                name: 'marriageData'
              })
            }
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      chooseImage () {
        var self = this
        // self.loadingStatus = true
        var formData = new FormData()
        var fileName = self.file.name + '.' + self.file.type.split('/').pop().toLowerCase()
        // var filePath = self.host + '/' + self.ossConfig.dir + fileName
        formData.append('name', self.ossConfig.dir + fileName)
        formData.append('key', self.ossConfig.dir + fileName)
        formData.append('policy', self.ossConfig.policy)
        formData.append('OSSAccessKeyId', self.ossConfig.accessid)
        formData.append('success_action_status', '200')
        formData.append('signature', self.ossConfig.signature)
        formData.append('file', self.file)
        formData.append('filename', self.file.name)
        console.log(formData)
        console.log(self.ossConfig)
        self.$http.post(self.ossConfig.host, formData).then(({data}) => {
          console.log(data)
        }).catch((error) => {
          console.log(error)
        })
      },
      onShowChange (ids, names) { // 地址
        this.address = `${names[0]} - ${names[1]}`
      },
      getSignature () { // 获取上传签证
        this.$http.get('/upload/signature').then(({data}) => {
          this.ossConfig = data
          this.host = data.host
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    mounted () {
      console.log(this.$store.state.route)
      this.getSignature()
    }
  }
</script>

<style  lang="less" scoped>
  #personalData{
    background-color: #F0F3F5 !important;
    height: 100vh;
    .setting{
      .bc_background{
        padding-bottom: 10px;
        .bc_img_back{
          width: 100%;
          height: 356px;
        }
        .uploading{
          width: 224px;
          height: 224px;
          border-radius: 50%;
          position: relative;
          margin: -130px auto 0 auto;
          background-repeat: no-repeat;
          background-size: cover;
        }
      }
    }
    /*.wrapper{*/
      /*.bc_avatar{*/
        /*.bc_back{*/
          /*width: 100%;*/
          /*height: 356px;*/
        /*}*/
        /*.avatar{*/
          /*width: 225px;*/
          /*height: 225px;*/
          /*border-radius: 50%;*/
          /*margin: auto;*/
          /*background-repeat: no-repeat;*/
          /*background-size: cover;*/
          /*background-position-x: center;*/
        /*}*/
        /*p{*/
          /*color: #787878;*/
          /*margin-top: 35px;*/
        /*}*/
      /*}*/
    /*}*/
    .list-item{
      padding: 36px 20px;
      margin-bottom: 1px;
      background: white;
      .icon{
        width: 27px;
        height: 27px;
      }
      input{
        border: none;
        background: none;
        &::-webkit-input-placeholder{
          color: #bebebe;
          text-align: right;
        }
      }
    }
    .bc_box{
      overflow: hidden;
      margin-top: 208px;
      .bachelordom, .married{
        width: 254px;
        height: 60px;
        font-weight: bold;
        display: inline-block;
        text-align: center;
        line-height: 60px;
        border: 1px solid #d92553;
        border-radius: 6px;
        letter-spacing: 1px;
      }
      .bachelordom{
        color: #ffffff;
        background: #D92553;
        margin-left: 20px;
      }
      .married{
        float: right;
        margin-right: 20px;
        color: #D92553;
      }
    }
    /*.bc_box{*/
      /*width: 100%;*/
      /*padding: 38px 0;*/
      /*.after{*/
        /*position: relative;*/
        /*&:after{*/
          /*content: '';*/
          /*width: 2px;*/
          /*height: 64px;*/
          /*background: #b6b6b6;*/
          /*position: absolute;*/
          /*right: 0;*/
          /*top: -10px;*/
        /*}*/
      /*}*/
      /*li{*/
        /*width: 49%;*/
        /*text-align: center;*/
      /*}*/
    /*}*/
  }
  .dp-header{
    height: 50px !important;
    .dp-item{
      font-size: 32px !important;
    }
  }
</style>
