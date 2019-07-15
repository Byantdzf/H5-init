<template>
  <div id="singleData">
    <ul>
      <li class="list-item">
        <span class="title font32">身高（cm）~</span>
        <input type="number" class="text-right font30 flo_r" v-model="stature" placeholder="点击填写身高（cm）"
               oninput="this.value=this.value.replace(/[^0-9.]+/,'');" @change="save"/>
      </li>
      <li class="list-item">
        <span class="title font32">体重（kg）~</span>
        <input type="number" class="text-right font30 flo_r" v-model="weight" placeholder="点击填写体重（kg）"
               oninput="this.value=this.value.replace(/[^0-9.]+/,'');" @change="save"/>
      </li>
      <li class="list-item">
        <span class="title font32">单身状态~</span>
        <input type="text" class="text-right font30 flo_r" v-model="state" readonly placeholder="点击选择"
               @click="popupPicker('state', 'stateList')"  @change="save">
      </li>
      <li class="list-item">
        <span class="title font32">常居地~</span>
        <input type="text" class="text-right font30 flo_r" readonly
               :value="address.length>1?address[1]+' '+address[2]:''" placeholder="点击选择"
               @click="showAddress = !showAddress " @change="save">
      </li>
      <li class="list-item">
        <span class="title font32">成长环境~</span>
        <input type="text" class="text-right font30 flo_r" v-model="resident_type" readonly placeholder="点击选择"
               @click="popupPicker('resident_type', 'residentTypeList')" @change="save">
      </li>
      <li class="list-item">
        <span class="title font32">成长地~</span>
        <input type="text" class="text-right font30 flo_r" readonly
               :value="residentAddress.length>1?residentAddress[1]+' '+residentAddress[2]:''" placeholder="点击选择"
               @click="showAddress_resident = !showAddress_resident " @change="save">
      </li>
      <li class="list-item">
        <span class="title font32">最高学历~</span>
        <input type="text" class="text-right font30 flo_r" v-model="degree" readonly placeholder="点击选择"
               @click="popupPicker('degree', 'degreeList')" @change="save">
      </li>
      <li class="list-item">
        <span class="title font32">毕业学校~</span>
        <input type="text" class="text-right font30 flo_r" v-model="graduate_school" placeholder="点击填写" @change="save">
      </li>
      <li class="list-item">
        <span class="title font32">工作单位~</span>
        <input type="text" class="text-right font30 flo_r" v-model="company" placeholder="点击填写" @change="save">
      </li>
      <li class="list-item">
        <span class="title font32">公司职位~</span>
        <input type="text" class="text-right font30 flo_r" v-model="post" placeholder="点击填写" @change="save">
      </li>
      <li class="list-item">
        <span class="title font32">单位性质~</span>
        <input type="text" class="text-right font30 flo_r" v-model="work_sort" readonly placeholder="点击选择"
               @click="popupPicker('work_sort', 'workSortList')" @change="save">
      </li>
      <li class="list-item">
        <span class="title font32">行业~</span>
        <input type="text" class="text-right font30 flo_r color6" v-if='industries.length > 1' readonly
               :value="industries[0]+ ' '+ industries[1]" placeholder="点击选择" @click="show = !show" @change="save">
        <input type="text" class="text-right font30 flo_r color6" v-else readonly placeholder="点击选择"
               @click="show = !show" @change="save">
      </li>
      <li class="list-item">
        <span class="title font32">微信号~</span>
        <input type="text" class="text-right font30 flo_r" v-model="wechat_id" placeholder="点击填写微信号" @change="save">
      </li>
      <li class="list-item" style="margin-top: 3vw;">
        <span class="title font32 flo_l">自我介绍</span>
        <!--<router-link :to="{name:'textareaData',query:{title: '自我介绍', type: 'introduction'}}">-->
        <div class="text flo_l colorbe font28 ellipsis_3" @click="showPopup('自我介绍', 'introduction')">
          {{introduction}}
        </div>
        <!--</router-link>-->
        <img src="https://images.ufutx.com/201903/29/d919daf1cd00a2a2202de67f7972e83f.png" alt="icon" class="edit">
        <div class="clearfloat"></div>
      </li>
      <li class="list-item" style="margin-top: 3vw;">
        <span class="title font32 flo_l">理想对象</span>
        <!--<router-link :to="{name:'textareaData',query:{title: '理想对象',type: 'ideal_mate'}}">-->
        <div class="text flo_l colorbe font28 ellipsis_3" @click="showPopup('理想对象', 'ideal_mate')">
          {{ideal_mate}}
        </div>
        <!--</router-link>-->
        <img src="https://images.ufutx.com/201903/29/d919daf1cd00a2a2202de67f7972e83f.png" alt="icon" class="edit">
        <div class="clearfloat"></div>
      </li>
    </ul>
    <div class="height160"></div>
    <div class="fixed_bot colorff theme_bc bc_box font32 text-center" @click="submit">
      提交
    </div>
    <div v-transfer-dom>
      <popup v-model="showTextarea" height="100%">
        <div class="popup1">
          <group>
            <div id="textareaData">
              <div class="bc_header ff">
                <span @click="showTextarea = !showTextarea">
                  <img src="../../assets/icon/back.png" width="20" alt="icon" class="icon middle">
                {{title}}
                </span>
                <p class="color flo_r" @click="showTextarea = !showTextarea">保存</p>
              </div>
              <div class="center ff">
                <textarea name="" id="" class="textarea" v-model="text" placeholder="请输入内容" maxlength="300" @change="save"></textarea>
                <p class="num flo_r">{{text.length}}/300</p>
                <div class="clearfloat"></div>
              </div>
            </div>
          </group>
        </div>
      </popup>
    </div>
    <group>
      <popup-picker style="display:none;" :data="pickerList" @on-shadow-change="onChange" @on-change="onChange"
                    :show.sync="showPicker"></popup-picker>
      <!--行业-->
      <popup-picker :data="industriesList" style="display: none" :columns="2" ref="picker2"
                    @on-shadow-change="onChangeIndustries('industries', $event)" :show.sync="show"
                    @on-change="onChangeIndustries('industries', $event)"></popup-picker>
      <popup-picker :data="addressData" style="display: none" :columns="3" ref="picker"
                    @on-shadow-change="onChangeAddress('address', $event)" :show.sync="showAddress"
                    @on-change="onChangeAddress('address', $event)"></popup-picker>
      <popup-picker :data="addressData" style="display: none" :columns="3" ref="picker1"
                    @on-shadow-change="onChangeAddress_resident('address', $event)" :show.sync="showAddress_resident"
                    @on-change="onChangeAddress_resident('address', $event)"></popup-picker>
    </group>
  </div>
</template>

<script>
  import {Datetime, TransferDom, Group, XButton, PopupPicker, Popup} from 'vux'
  import {$toastSuccess, $toastWarn} from '../../config/util'

  export default {
    name: 'singleData',
    directives: {
      TransferDom
    },
    components: {
      Datetime,
      Group,
      XButton,
      Popup,
      PopupPicker
    },
    data () {
      return {
        name: '',
        stature: '', // 身高
        weight: '', // 体重
        graduate_school: '', // 毕业学校
        company: '', // 工作单位
        post: '', // 公司职位
        wechat_id: '', // 微信号
        introduction: '家庭情况，兴趣爱好，自我评价', // 自我介绍
        ideal_mate: '写下你对另一半的期望', // 理想对象
        work_sort: '', // 单位性质
        degree: '', // 学历
        resident_type: '', // 成长环境
        state: '', // 单身状态
        industries: [],
        industriesList: [],
        show: false,
        showPicker: false,
        pickerList: [],
        itemType: '', // 对应的动态赋值
        stateList: [['从未结婚', '离异', '丧偶']],
        workSortList: [['事业单位', '公务员', '央企', '国企', '私企', '外企']],
        degreeList: [['大专', '本科', '硕士', '博士', '其他']],
        residentTypeList: [['城市', '乡村']],
        showAddress: false,
        showAddress_resident: false,
        address: [],
        addressData: [],
        residentAddress: [],
        showTextarea: false,
        firstTime: false, // 首次访问
        firstSave: false, // 首次渲染不保存
        title: '',
        text: '', // 自我介绍
        textType: ''
      }
    },
    computed: {},
    watch: {
      text () {
        this[this.textType] = this.text
      }
    },
    methods: {
      showPopup (title, type) {
        this.text = ''
        this.text = this[type]
        this.showTextarea = !this.showTextarea
        this.textType = type
        this.title = title
        this.save()
      },
      getData () {
        let data = {
          stature: this.stature,
          weight: this.weight,
          country: this.address[0],
          post: this.post,
          wechat_id: this.wechat_id,
          graduate_school: this.graduate_school,
          introduction: this.introduction === '家庭情况，兴趣爱好，自我评价' ? '' : this.introduction,
          ideal_mate: this.ideal_mate === '写下你对另一半的期望' ? '' : this.ideal_mate,
          state: this.state, // 单身状态
          province: this.address[1],
          city: this.address[2],
          resident_type: this.resident_type,
          resident_province: this.residentAddress[1],
          resident_city: this.residentAddress[2],
          degree: this.degree,
          industry: this.industries[0],
          industry_sub: this.industries[1],
          work_sort: this.work_sort
        }
        return data
      },
      popupPicker (item, list) { // 公用选择器函数
        this.showPicker = !this.showPicker
        this.pickerList = this[list]
        this.itemType = item
        // this.save()
      },
      onChangeIndustries (type, val) { //  行业
        this.industries = this.$refs.picker2 && this.$refs.picker2.getNameValues().split(' ')
        console.log(this.industries)
        this.save()
      },
      onChangeAddress (type, val) { //  地址
        this.address = this.$refs.picker && this.$refs.picker.getNameValues().split(' ')
        console.log(this.address)
        this.save()
      },
      onChangeAddress_resident (type, val) { //  常居地址
        this.residentAddress = this.$refs.picker1 && this.$refs.picker1.getNameValues().split(' ')
        console.log(this.residentAddress)
        this.save()
      },
      onChange (val) {
        console.log('val change', val)
        this[this.itemType] = val[0]
        this.save()
      },
      getIndustries () { // 初始化行业数据
        let vm = this
        vm.$http.get('/industries').then(({data}) => {
          for (let item of data) {
            vm.industriesList.push(
              {
                name: item.name,
                value: 'industry' + item.id,
                parent: 0
              }
            )
            for (let itemV of item.sub_industry) {
              vm.industriesList.push(
                {
                  name: itemV.name,
                  value: 'industry_sub' + itemV.id,
                  parent: 'industry' + item.id
                }
              )
            }
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      getCity () { // 初始化地址数据
        let vm = this
        vm.$http.get('/addresses/v2').then(({data}) => {
          for (let item of data) {
            vm.addressData.push(
              {
                name: item.name,
                value: 'address' + item.id,
                parent: 0
              }
            )
            for (let itemV of item.son) {
              vm.addressData.push(
                {
                  name: itemV.name,
                  value: 'address_son' + itemV.id,
                  parent: 'address' + item.id
                }
              )
              for (let itemSub of itemV.son) {
                vm.addressData.push(
                  {
                    name: itemSub.name,
                    value: 'address_sub' + itemSub.id,
                    parent: 'address_son' + itemV.id
                  }
                )
              }
            }
          }
          if (this.firstTime === 'false') {
            this.getUserData()
          }
          console.log(vm.addressData)
        }).catch((error) => {
          console.log(error)
        })
      },
      getUserData () {
        this.$http.get(`/official/users/profile`).then(({data}) => {
          console.log(data)
          this.stature = data.stature
          this.weight = data.weight
          this.post = data.post
          this.wechat_id = data.wechat_id
          this.graduate_school = data.graduate_school
          this.introduction = data.introduction ? data.introduction : ''
          this.ideal_mate = data.ideal_mate ? data.ideal_mate : ''
          this.degree = data.degree
          this.work_sort = data.work_sort
          this.state = data.state
          this.address[0] = data.country
          this.address[1] = data.province
          this.address[2] = data.city
          this.residentAddress[1] = data.resident_province
          this.residentAddress[2] = data.resident_city
          this.resident_type = data.resident_type
          this.resident_type = data.resident_type
          this.company = data.company
          this.industries[0] = data.industry
          this.industries[1] = data.industry_sub
          this.firstSave = false
        }).catch((error) => {
          console.log(error)
        })
      },
      save () { // 单项保存
        let vm = this
        let data = this.getData()
        vm.$http.put('/courtship/v2', data).then(({data}) => {
          console.log('完成')
        }).catch((error) => {
          console.log(`${error}---失败`)
        })
      },
      submit () { // 提交
        let vm = this
        let data = this.getData()
        vm.$http.put('/official/users/profile', data).then(({data}) => {
          console.log(data)
          $toastSuccess('完成')
          localStorage.setItem('firstTime', false)
          setTimeout(() => {
            this.$router.push({
              name: 'home'
            })
          }, 800)
        }).catch((error) => {
          $toastWarn(error)
        })
      }
    },
    mounted () {
      console.log(this.$store.state.route)
      this.getIndustries() // 行业
      this.getCity() // 地址
      if (localStorage.getItem('firstTime')) {
        this.firstTime = localStorage.getItem('firstTime')
      }
    }
  }
</script>

<style lang="less" scoped>
  #singleData {
    background-color: #F0F3F5 !important;
    height: 100vh;

    .list-item {
      padding: 36px 20px;
      /*border-bottom: 1px solid #b6b6b6;*/
      background: white;
      position: relative;
      margin-bottom: 1px;

      .icon {
        width: 20px;
        height: 20px;
      }

      .text {
        width: 70%;
        margin-left: 40px;
      }

      .edit {
        width: 32px;
        position: absolute;
        bottom: 16px;
      }

      input {
        width: 68vw;
        border: none;
        background: none;
        /*padding-right: 40px;*/
        margin-top: 6px;

        &::-webkit-input-placeholder {
          color: #bebebe;
          text-align: right;
        }
      }
    }

    .bc_box {
      width: 100%;
      padding: 38px 0;

      .after {
        position: relative;

        &:after {
          content: '';
          width: 2px;
          height: 64px;
          background: #b6b6b6;
          position: absolute;
          right: 0;
          top: -10px;
        }
      }

      li {
        width: 49%;
        text-align: center;
      }
    }
  }

  .dp-header {
    height: 50px !important;

    .dp-item {
      font-size: 32px !important;
    }
  }

  #textareaData {
    background-color: #F0F3F5 !important;
    height: 100vh;

    .bc_header {
      padding: 20px 26px 20px 12px;
      margin-bottom: 2px;
    }

    .center {
      padding-top: 20px;
    }

    .icon {
      margin-bottom: 2px;
    }

    .textarea {
      width: 92vw;
      border: none;
      padding: 4vw;
      min-height: 300px;
    }

    .num {
      padding: 20px 38px 40px 0;
    }
  }
</style>
