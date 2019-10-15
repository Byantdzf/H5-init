<template>
  <div class="canvas_box">
    <canvas id="cvs"></canvas>
  </div>
</template>

<script>
  import LikeHeart from '../router/LikeHeart'

  export default {
    props: ['list'],
    components: {},
    data () {
      return {
        width: 175, // 初始宽度
        height: 400, // 初始高度
        heartList: [], // 初始数组
        heartCount: 0 // 累加计数初始值
      }
    },
    watch: {},
    methods: {
      getRandomDis () {
        if (Math.random() > 0.5) {
          return -(Math.random() * 12)
        } else {
          return +(Math.random() * 12)
        }
      },
      createHeart () {
        this.heartCount++
        let positionArray = [
          {
            x: 50,
            y: 400,
            endX: 100,
            endY: 100
          }
        ]
        let img = new Image()
        // img.src = "../../static/img/" + Math.ceil(Math.random() * 2) + ".png";
        img.src = `../../static/img/${Math.ceil(Math.random() * 5)}.png`
        let p1 = {
          x: 300 + this.getRandomDis(),
          y: 200 + this.getRandomDis()
        }
        let p2 = {
          x: 10 + this.getRandomDis(),
          y: 50 + this.getRandomDis()
        }
        return new LikeHeart({
          id: this.heartCount,
          x: positionArray[0].x,
          y: positionArray[0].y,
          endX: positionArray[0].endX,
          endY: positionArray[0].endY,
          onFadeOut: this.removeItem,
          noAngel: true, // 决定是否从小到大
          // noScale: true,//决定是否左右摆动
          width: 30, // 决定心的大小
          height: 30,
          image: img,
          bezierPoint: {
            p0: {
              x: positionArray[0].x,
              y: positionArray[0].y
            },
            p1: p1,
            p2: p2,
            p3: {
              x: positionArray[0].endX,
              y: positionArray[0].endY
            }
          }
        })
      },
      removeItem (item) {
        let array = []
        for (let i = 0; i < this.heartList.length; i++) {
          if (this.heartList[i].id !== item.id) {
            array.push(this.heartList[i])
          }
        }
        this.heartList = array
      }
    },
    mounted () {
      // 飘心
      let _this = this
      let ctx = document.getElementById('cvs').getContext('2d');
      (ctx.canvas.width = _this.width);
      (ctx.canvas.height = _this.height);
      (function loop () {
        ctx.clearRect(0, 0, _this.width, _this.height)
        _this.heartList.forEach(function (item) {
          item && item.move(ctx)
        })
        requestAnimationFrame(loop)
      })()
      setInterval(function () {
        _this.heartList.push(_this.createHeart())
      }, 700)
      document.getElementById('cvs').addEventListener(
        'click',
        function () {
          console.log(111111)
          _this.heartList.push(_this.createHeart())
        },
        false
      )
    }
  }
</script>

<style lang="less" scoped>
  .canvas_box{
    width: 50px;
    height: 50px;
    background: #D92553;
  }
</style>
