<template>
  <div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        name: '黄济',
        card_num: '421281199402026318',
        token: ''
      }
    },
    methods: {
      confirmPay () { // 报名
        let vm = this
        let data = {
          name: this.name,
          card_num: this.card_num
        }
        this.$http.post(`official/user/approve/face`, data).then(({data}) => {
          vm.token = data.token
          if (vm.token != '') {
            window.location.href = `https://api.megvii.com/faceid/lite/do?token=${this.token}`
          }
        }).catch((error) => {
          console.log(error)
        })
      },
    },
    mounted () {
      this.confirmPay()
    }
  }
</script>

<style lang="less" scoped>
  .vessel{
    position: fixed;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, .7);
    z-index: 12;
  }
  .close {
    width: 60px;
    position: absolute;
    top: 12%;
    right: 15%;
  }
  .modal-vessel{
    animation: myMove 300ms linear;
    animation-fill-mode: forwards;
    img {
      width: 20%;
      display: block;
      padding-top: 40%;
      margin: auto;
    }

    .image_amin {
      animation:move 3s 0s infinite;
      -webkit-animation:move 3s 0s infinite;
      transform-origin:bottom;
      -webkit-transform-origin:bottom;
      display:block;
      @keyframes move
      {
        0%, 65%{
          -webkit-transform:rotate(0deg);
          transform:rotate(0deg);
        }
        70% {
          -webkit-transform:rotate(6deg);
          transform:rotate(6deg);
        }
        75% {
          -webkit-transform:rotate(-6deg);
          transform:rotate(-6deg);
        }
        80% {
          -webkit-transform:rotate(6deg);
          transform:rotate(6deg);
        }
        85% {
          -webkit-transform:rotate(-6deg);
          transform:rotate(-6deg);
        }
        90% {
          -webkit-transform:rotate(6deg);
          transform:rotate(6deg);
        }
        95% {
          -webkit-transform:rotate(-6deg);
          transform:rotate(-6deg);
        }
        100% {
          -webkit-transform:rotate(0deg);
          transform:rotate(0deg);
        }
      }

      @-webkit-keyframes move
      {
        0%, 65%{
          -webkit-transform:rotate(0deg);
          transform:rotate(0deg);
        }
        70% {
          -webkit-transform:rotate(6deg);
          transform:rotate(6deg);
        }
        75% {
          -webkit-transform:rotate(-6deg);
          transform:rotate(-6deg);
        }
        80% {
          -webkit-transform:rotate(6deg);
          transform:rotate(6deg);
        }
        85% {
          -webkit-transform:rotate(-6deg);
          transform:rotate(-6deg);
        }
        90% {
          -webkit-transform:rotate(6deg);
          transform:rotate(6deg);
        }
        95% {
          -webkit-transform:rotate(-6deg);
          transform:rotate(-6deg);
        }
        100% {
          -webkit-transform:rotate(0deg);
          transform:rotate(0deg);
        }
      }
    }
  }
</style>
