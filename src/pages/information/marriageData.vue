<template>
  <div id="marriageData">
    <ul>
      <li class="list-item">
        <span class="title font32">工作单位</span>
        <div class="flo_r">
          <input type="text" class="middle text-right font30 color6" v-model="company" placeholder="点击填写">
        </div>
      </li>
      <li class="list-item vux-1px-t">
        <span class="title font32">行业</span>
        <div class="flo_r"  @click="showModal">
          <span class="font30 color6" v-if='industries && industries.length > 1'>{{industries[0]}} {{industries[1]}}</span>
          <span class="font30 colorbe" v-else>请选择</span>
          <img src="../../assets/icon/go.png" alt="icon" class="icon">
        </div>
      </li>
      <li class="list-item" style="margin-top: 3vw;">
        <span class="title font32 flo_l">服务格言</span>
        <!--<router-link :to="{name:'textareaData',query:{title: '服务格言'}}">-->
          <div class="text flo_l colorbe font28 ellipsis_3" @click="showTextarea = !showTextarea">
            {{slogan}}
          </div>
        <!--</router-link>-->
        <img src="https://images.ufutx.com/201903/29/d919daf1cd00a2a2202de67f7972e83f.png" alt="icon" class="edit">
        <div class="clearfloat"></div>
      </li>
    </ul>
    <div class="fixed_bot theme_bc colorff bc_box font32 text-center" @click="submit">
      提交
    </div>
    <group>
      <popup-picker :data="industriesList" style="display: none" :columns="2" ref="picker2"  @on-shadow-change="onChange('industries', $event)" :show.sync="show"  @on-change="onChange('industries', $event)" ></popup-picker>
    </group>
    <div v-transfer-dom>
      <popup v-model="showTextarea" height="100%">
        <div class="popup1">
          <group>
            <div id="textareaData">
              <div class="bc_header ff">
                <span  @click="showTextarea = !showTextarea">
                  <img src="../../assets/icon/back.png" width="20" alt="icon" class="icon middle">
                  服务格言
                </span>
                <p class="theme_clo flo_r " @click="showTextarea = !showTextarea">保存</p>
              </div>
              <div class="center ff">
                <textarea name="" id="" class="textarea"  v-model="slogan" placeholder="请输入内容" maxlength="300"></textarea>
                <p class="num flo_r">{{slogan.length}}/300</p>
                <div class="clearfloat"></div>
              </div>
            </div>
          </group>
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
  import {Datetime, Group, TransferDom, PopupPicker, Popup} from 'vux'
  import {$toastSuccess, $toastWarn} from '../../config/util'

  export default {
    name: 'marriageData',
    directives: {
      TransferDom
    },
    components: {
      Datetime,
      Group,
      PopupPicker,
      Popup
    },
    data () {
      return {
        company: '',
        slogan: '为何喜欢做介绍人？',
        industries: [],
        industriesList: [],
        firstTime: false, // 首次访问
        show: false,
        showTextarea: false
      }
    },
    watch: {

    },
    methods: {
      showModal () {
        this.show = !this.show
      },
      onChange (type, val) { //  行业
        this.industries = this.$refs.picker2 && this.$refs.picker2.getNameValues().split(' ')
        console.log(this.industries)
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
          if (this.firstTime === 'false') {
            this.getData()
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      submit () { // 提交
        let data = {
          company: this.company,
          slogan: this.slogan === '为何喜欢做介绍人？' ? '' : this.slogan,
          industry: this.industries[0],
          industry_sub: this.industries[1]
        }
        console.log(data)
        let vm = this
        vm.$http.put('/official/users/profile', data).then(({data}) => {
          console.log(data)
          $toastSuccess('完成')
          setTimeout(() => {
            this.$router.push({
              name: 'home'
            })
          }, 800)
        }).catch((error) => {
          $toastWarn(error)
        })
      },
      getData () {
        this.$http.get(`/official/users/profile`).then(({data}) => {
          console.log(data)
          this.slogan = data.slogan ? data.slogan : '为何喜欢做介绍人？'
          this.company = data.company
          this.industries[0] = data.industry
          this.industries[1] = data.industry_sub
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    mounted () {
      console.log(this.$store.state.route)
      this.getIndustries()
      if (localStorage.getItem('firstTime')) {
        this.firstTime = localStorage.getItem('firstTime')
      }
    }
  }
</script>

<style  lang="less" scoped>
  #marriageData{
    background-color: #F0F3F5 !important;
    height: 100vh;
    .list-item{
      padding: 36px 20px;
      /*border-bottom: 1px solid #b6b6b6;*/
      background: white;
      position: relative;
      margin-bottom: 1px;
      .icon{
        width: 20px;
        height: 20px;
      }
      .text{
        width: 70%;
        margin-left: 40px;
        margin-top: 4px;
      }
      .edit{
        width: 32px;
        position: absolute;
        bottom: 16px;
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
      width: 100%;
      padding: 38px 0;
      .after{
        position: relative;
        &:after{
          content: '';
          width: 2px;
          height: 64px;
          background: #b6b6b6;
          position: absolute;
          right: 0;
          top: -10px;
        }
      }
      li{
        width: 49%;
        text-align: center;
      }
    }
  }
  .dp-header{
    height: 50px !important;
    .dp-item{
      font-size: 32px !important;
    }
  }
  #textareaData{
    background-color: #F0F3F5 !important;
    height: 100vh;
    .bc_header{
      padding: 20px 26px 20px 12px;
      margin-bottom: 2px;
    }
    .center{
      padding-top: 20px;
    }
    .icon{
      margin-bottom: 2px;
    }
    .textarea{
      width: 92vw;
      border: none;
      padding: 4vw;
      min-height: 300px;
    }
    .num{
      padding: 20px 38px 40px 0;
    }
  }
</style>
