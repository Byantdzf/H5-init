<template>
  <!--<vux-upload-->
    <!--:url="url"-->
    <!--:headers="headers"-->
    <!--:images="images"-->
    <!--:readonly="false"-->
    <!--:max="9"-->
    <!--:withCredentials="false"-->
    <!--:span="4"-->
    <!--:preview="true"-->
    <!--@success="onSuccess"-->
    <!--@error="onError"-->
    <!--@remove="onRemove"-->
  <!--&gt;-->
  <!--</vux-upload>-->
</template>

<script>
  import {$toastWarn, $toastSuccess} from '../config/util'
  // import VuxUpload from 'vux-upload'
  export default {
    name: 'upload',
    data () {
      return {
        avatar: '',
        file: '',
        images: [],
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('ACCESS_TOKEN'),
          'Content-Type': 'multipart/form-data'
        },
        imgData: [],
        ossConfig: {},
        host: '',
        showBg: false,
        url: process.env.NODE_ENV === 'development' ? 'http://love.hankin.ufutx.cn/api/official/uploads' : 'https://love.ufutx.com/api/official/uploads'
      }
    },
    components: {
      // VuxUpload
    },
    props: ['uploadType', 'imgUrl', 'imgWidth', 'imgHeight'],
    methods: {
      onSuccess (res, file) {
        $toastSuccess('上传成功')
        this.$emit('upload', res.data)
      },
      onError (event, file) {
        $toastWarn('上传失败')
        this.$emit('upload', event.data)
      },
      onRemove (index) {
        console.log('删除')
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
      this.getSignature()
    }
  }
</script>

<style scoped lang="less">
  .avatar {
    cursor: pointer;
    position: relative;
    .input-file {
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      cursor: pointer;
    }
    .bg {
      width: 100%;
      height: 100%;
      color: #fff;
      background-color: rgba(0, 0, 0, 0.3);
      text-align: center;
      cursor: pointer;
      position: absolute;
      top: 0;
      left: 0;
    }
    .text {
      padding-top: 10px;
      color: lightblue;
    }
  }
</style>
