<template>
  <!--<div class="vux-upload">-->
  <!--<flexbox :gutter="0" wrap="wrap">-->
  <!--<flexbox-item :span="span" v-for="(item, index) in images" :key="index" @click.native="onPreview(index)">-->
  <!--<div class="vux-upload-bg">-->
  <!--<div class="vux-upload-content" :style="{ backgroundImage: `url(${item.src})` }">-->
  <!--<x-icon v-if="!readonly" type="ios-close" class="red" @click.native="onRemove(index, $event)"></x-icon>-->
  <!--</div>-->
  <!--</div>-->
  <!--</flexbox-item>-->
  <!--<flexbox-item :span="span" v-show="!readonly && images.length < max">-->
  <!--<div class="vux-upload-bg">-->
  <!--<div class="weui-uploader__input-box vux-upload-content" :class="{ loading: loading }">-->
  <!--<input v-show="!loading" ref="file" class="weui-uploader__input" value="" type="file" :accept="accept" :capture="capture" @change="onChange">-->
  <!--<inline-loading v-show="loading"></inline-loading>-->
  <!--</div>-->
  <!--</div>-->
  <!--</flexbox-item>-->
  <!--</flexbox>-->
  <!--<previewer :list="images" ref="previewer"></previewer>-->
  <!--</div>-->
<div>
  <input type="file" @change="onChange" class="weui-uploader__input" accept='image/*'/>
  <slot name="text"></slot>
</div>

</template>

<script>
  import { Flexbox, FlexboxItem, Previewer, InlineLoading } from 'vux'
  // import lrz from 'lrz'
  import {$toastWarn, $loadingShow, $loadingHide} from '../config/util'

  export default {
    name: 'UploadOss',
    components: {
      Flexbox,
      FlexboxItem,
      Previewer,
      InlineLoading
    },
    model: {
      prop: 'images',
      event: 'change'
    },
    props: {
      images: {
        type: Array,
        default: () => []
      },
      readonly: {
        type: Boolean,
        default: false
      },
      max: {
        type: Number,
        default: 9
      },
      beforeUpload: Function,
      withCredentials: {
        type: Boolean,
        default: false
      },
      headers: {
        type: Object,
        default: () => {
          return {
            'Authorization': 'Bearer ' + localStorage.getItem('ACCESS_TOKEN'),
            'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7nlA2zLUZKtJLFvz'
          }
        }
      },
      data: {
        type: Object,
        default: () => {
          return {}
        }
      },
      url: {
        type: String,
        required: false
      },
      span: {
        type: Number,
        default: 4
      },
      accept: {
        type: String,
        default: 'image/*'
      },
      capture: {
        type: String,
        default: '*'
      },
      preview: {
        type: Boolean,
        default: true
      },
      compress: Object
    },
    data () {
      return {
        loading: false,
        ossConfig: {},
        host: '',
        file: {}
      }
    },
    watch: {
      loading: function (newValue) {
        if (!newValue) {
          this.$refs['file'].value = ''
        }
      }
    },
    methods: {
      onChange (event) {
        // 移动端仅支持单文件上传
        this.file = event.target.files[0]
        if (!this.file) return
        $loadingShow('上传中...')
        this.uploadFile(this.file)
      },
      uploadFile (file) {
        // if (this.images.length >= this.max) {
        //   return
        // }
        if (this.beforeUpload && typeof this.beforeUpload === 'function') {
          const before = this.beforeUpload(file)
          if (before && before.then) {
            before.then(processedFile => {
              const fileType = Object.prototype.toString.call(processedFile)
              if (fileType === '[object File]' || fileType === '[object Blob]') {
                this.post(processedFile)
              } else {
                this.post(file)
              }
            })
          } else if (before !== false) {
            this.post(file)
          }
        } else {
          this.post(file)
        }
      },
      post (file) {
        this.loading = true
        var self = this
        var formData = new FormData()
        console.log(this.$md5(self.file.name))
        var fileName = this.$md5(self.file.name) + '.' + self.file.type.split('/').pop().toLowerCase()
        var filePath = self.host + '/' + self.ossConfig.dir + fileName
        formData.append('name', self.ossConfig.dir + fileName)
        formData.append('key', self.ossConfig.dir + fileName)
        formData.append('policy', self.ossConfig.policy)
        formData.append('OSSAccessKeyId', self.ossConfig.accessid)
        formData.append('success_action_status', '200')
        formData.append('signature', self.ossConfig.signature)
        formData.append('file', self.file)
        formData.append('filename', self.file.name)
        console.log(formData.entries().next())
        this.$http.post(this.host, formData, {headers: {'Content-Type': 'multipart/form-data'}}).then(({data}) => {
          console.log(filePath)
          this.$emit('onSuccess', filePath)
          // $toastSuccess('上传成功')
          $loadingHide()
        }).catch((error) => {
          $toastWarn(error)
          $loadingHide()
        })
      },
      onSuccess (res, file) {
        this.$emit('success', res, file)
      },
      onError (e, file) {
        this.$emit('error', e, file)
      },
      onRemove (index, e) {
        e.stopPropagation()
        this.$emit('remove', index)
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

<style lang="less" scoped>
  @import '~vux/src/styles/weui/widget/weui-uploader/index.less';

  .vux-upload {
    overflow: initial;
    width: 100%;
    .vux-flexbox-item {
      padding-top: 7px;
      padding-bottom: 7px;
      .vux-upload-bg {
        .loading:before, .loading:after {
          width: 0;
          height: 0;
        }
        .weui-loading {
          width: 30px;
          height: 30px;
          position: absolute;
          top: 50%;
          left: 50%;
          margin-top: -15px;
          margin-left: -15px;
        }
        width: 80%;
        margin-left: 10%;
        .vux-x-icon {
          fill: #F70968;
          position: absolute;
          top: 0;
          left: 100%;
          width: 20px;
          height: 20px;
          transform: translate(-50%, -50%);
        }
        .vux-upload-content {
          width: 100%;
          height: 0;
          padding-bottom: 100%;
          margin: 0;
          background-size: cover;
          position: relative;
        }
      }
    }
  }
</style>
