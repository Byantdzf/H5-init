<template>
  <div>
    <div class="vessel" v-if="showModalTimeUp">
      <img src="http://images.ufutx.com/201907/09/cc558035065ad83a89bb7b5754d918c4.png" alt="" class="close"
           @click="hideModal">
      <div class="modal-vessel shake-slow">
        <div v-if="!showPic">
          <img src="https://images.ufutx.com/201907/11/403d2174039ff35f9267fa1c3b14a7b7.png" alt="" :class="image_amin?'image_amin':''">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        showPic: false,
        image_amin: true,
        showModalTimeUp: false
      }
    },
    methods: {
      hideModal () {
        this.showModalTimeUp = false
      }
    },
    mounted () {
      this.showModalTimeUp = true
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
