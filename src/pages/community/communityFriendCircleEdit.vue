<template>
  <div class="main-box">
    <div class="complaintText ff">
      <textarea v-model="complaintText" maxlength="120" placeholder="请填写内容"></textarea>
      <p class="ff text-right colorb0">{{complaintText.length}}/120</p>
      <div class="upload inline-block">
        <uploadOss @onSuccess="onSuccess"></uploadOss>
      </div>
      <div class="images inline-block" v-for="item,index in photoList">
        <div class="img"  v-bind:style="{backgroundImage:'url(' + item + ')'}"  @click="showImage(index)"></div>
        <p class="del font22 text-center"  @click.stop="delImage(index)">删除</p>
      </div>
      <br/>
      <div class="ComplaintBtn theme_bc text-center colorff font28 flo_r" @click="submitComplaint">发表</div>
    </div>
    <group>
      <popup-picker confirm-text="确定" :show.sync="showComplaint" :show-cell="false" :data="pickerList" @on-change="onChange" ></popup-picker>
    </group>
    <div v-transfer-dom>
      <previewer :list="list" ref="previewer" @on-index-change="logIndexChange"></previewer>
    </div>
  </div>
</template>
<script>
  import {$toastSuccess, $toastWarn, $loadingShow, $loadingHide} from '../../config/util'
  import {LoadMore, Previewer, TransferDom, PopupPicker, Group} from 'vux'
  import shareModal from '../../components/shareMoadl'
  import moadlUp from '../../components/moadlUp'
  import moadlDown from '../../components/moadlDown'
  import uploadOss from '../../components/upload_oss'

  export default {
    name: 'CircleComplaint',
    directives: {
      TransferDom
    },
    components: {
      shareModal,
      PopupPicker,
      Group,
      LoadMore,
      moadlUp,
      Previewer,
      uploadOss,
      moadlDown
    },
    data () {
      return {
        name: '',
        complaintText: '',
        editComplaint: false,
        qrType: 'community',
        showUpload: false,
        typeText: '',
        copyBtn: null, // 存储初始化复制按钮事件
        card_num: '',
        information: {},
        pickerList: [['骚扰、广告', '形象照、资料虚假或假冒', '辱骂、攻击等', '色情、暴力等', '诈骗钱财', '其他']],
        showComplaint: false,
        userInfo: {},
        photoList: [],
        list: []
      }
    },
    methods: {
      onChange (val) {
        console.log(val)
        this.typeText = val[0]
      },
      submitComplaint () {
        let data = {
          content: this.complaintText,
          photos: this.photoList
        }
        for (let item in data) {
          if (!data[item]) {
            return $toastWarn('请填写相关信息！')
          }
        }
        this.$http.post(`/official/moments`, data).then(({data}) => {
          $toastSuccess('发布成功')
          this.$router.go('-1')
        }).catch((error) => {
          console.log(error)
        })
      },
      delImage (index) {
        this.photoList.splice(index, 1)
        this.list.splice(index, 1)
      },
      copyLink () {  // 复制
        let _this = this
        let clipboard = _this.copyBtn
        clipboard.on('success', function () {
          _this.showQr = false
          setTimeout(() => {
            $toastSuccess('复制成功')
          }, 500)
        })
        clipboard.on('error', function () {
          _this.showQr = false
          setTimeout(() => {
            $toastWarn('复制失败，请手动选择复制！')
          }, 500)
        })
      },
      onSuccess (val) {
        this.photoList.push(val)
        this.list.push({src: val})
      },
      gotoDetail (id) {
        if (!id) return
        this.$router.push({
          name: 'userCommunityClass',
          params: {id: id}
        })
      },
      gotoLink (link) {
        window.location.href = link
      },
      getOpenid () {
        if (this.$isWeiXin() === true) {
          this.showOpenid = false
          let paas = localStorage.getItem('paasName')
          if (localStorage.getItem('mobile') && localStorage.getItem('mobile') !== null) {
            window.location.href = 'https://love.ufutx.com/wx/bind?mobile=' + localStorage.getItem('mobile') + `&paas=${paas}&type=community&id=${this.id}&from_user_id=${this.userInfo ? this.userInfo.id : ''}`
          } else {
            window.location.href = `https://love.ufutx.com/wx/bind?type=community&paas=${paas}&id=${this.id}&from_user_id=${this.userInfo ? this.userInfo.id : ''}`
          }
        }
      },
      save () {
        $loadingShow('识别中...')
        this.showUploadPhoto = false
        let data = {
          photo: this.photo
        }
        this.$http.put('/official/users/photo', data).then(({data}) => {
          let userInfo = JSON.parse(localStorage.getItem('userInfo'))
          userInfo.photo = this.photo
          localStorage.setItem('userInfo', JSON.stringify(userInfo))
          this.apply()
        }).catch((error) => {
          console.log(error)
        })
      },
      showImage (index) {
        this.$refs.previewer.show(index)
      },
      logIndexChange (arg) {
        console.log(arg)
      },
      hideShare (value) {
        this.showShare = value
      },
      routeToDetail (type, id) { // 跳转
        if (this.information.is_applied === 1) {
          if (type === 'marriage') {
            this.$router.push({name: 'introducer', params: {id: id}})
          } else {
            this.$router.push({name: 'information', params: {id: id}})
          }
        } else {
          $toastWarn('请先加入群！')
        }
      },
      hideQr (value) {
        this.showQr = value
      },
      hideUploadPhoto (value) {
        this.showUploadPhoto = value
      },
      hideOppenId (value) {
        this.showOpenId = value
      },
      hideComplaint (value) {
        this.editComplaint = value
      },
      routeTo (name) {
        this.$router.push({name: name})
      },
      goHome () {
        if (localStorage.getItem('paasName') !== 'FL' && localStorage.getItem('paasName')) {
          this.$router.push({name: 'home'})
        } else {
          this.$router.push({name: 'communityHome'})
        }
      },
      goCreate () {
        this.$router.push({
          name: 'createCommunity',
          params: {id: 0}
        })
      },
      apply () {
        if (!this.token) {
          localStorage.setItem('jump', window.location.href)
          this.$router.push({name: 'login'})
          return
        }
        $loadingShow('加载中...')
        this.$http.post(`/official/apply/communities/${this.id}`, data).then(({data}) => {
          $loadingHide()
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    mounted () {
      this.id = this.$route.params.id
    }
  }
</script>
<style scoped lang="less">
  .scrollView{
    background: white !important;
  }

  .main-box {
    min-height: 100vh;
    background: #F6F6F6 !important;
    .main-type{
      padding: 12px 22px;
      line-height: 52px;
      border: 1px solid #d3d3d3;
      overflow: hidden;
      input{
        border: none;
        margin-top: 14px;
      }
      .icon{
        width: 42px;
        margin-top: 8px;
      }
    }
    .complaintText{
      width: 100%;
      padding-bottom: 42px;
      overflow: hidden;
      padding-top: 12px;
      textarea{
        width: 94% !important;
        height: 300px !important;
        resize:none;
        padding: 4% 3%;
        border: none;
        color: #666666;
      }
      p{
        margin-right: 22px;
      }
      .upload{
        width: 160px;
        height: 160px;
        background-image: url('http://images.ufutx.com/201907/03/0c90095f21650cacf992e1a9d4b4e982.png');
        background-repeat: no-repeat;
        background-size: cover;
        margin-left: 32px;
        margin-top: 32px;
        position: relative;
      }
      .images{
        width: 160px;
        height: 160px;
        margin-left: 32px;
        margin-top: 32px;
        border: 1px solid #b0b0b0;
        position: relative;
        .del{
          position: absolute;
          left: 0;
          bottom: 0;
          width: 162px;
          height: 42px;
          line-height: 42px;
          background: rgba(0, 0, 0, .6);
          margin: 0;
          color: white;
        }
        .img{
          width: 160px;
          height: 160px;
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
        }
      }
      .ComplaintBtn{
        width: 90%;
        height: 80px;
        border-radius: 6px;
        line-height: 80px;
        margin-right: 32px;
        margin-top: 42px;
      }
    }
  }
</style>
