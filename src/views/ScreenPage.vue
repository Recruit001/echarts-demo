<template>
  <div class="screen-container" :style = "containerStyle">
    <header class="screen-header">
      <div> <img :src="borderSrc" alt=""> </div> <span class="logo"> <img
          :src="logoSrc" alt="" /> </span> <span class="title">电商平台实时监控系统</span>
      <div class="title-right"> <img :src="themeSrc" class="qiehuan" @click = "changeTimme"> <span
          class="datetime">2049-01-01 00:00:00</span> </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div id="left-top" :class = "fullScreenStatus['trend'] ? 'fullscreen' : ''">
          <!-- 销量趋势图表 -->
          <Trend ref="trend"></Trend>
          <div class="resize" @click = "changeSize('trend')">
            <span :class="fullScreenStatus['trend'] ? 'iconfont icon-compress-alt' : 'iconfont icon-expand-alt' "></span>
          </div>
        </div>
        <div id="left-bottom" :class = "fullScreenStatus['seller'] ? 'fullscreen' : ''" >
          <!-- 商家销售金额图表 -->
          <Seller ref="seller"></Seller>
          <div class="resize" @click = "changeSize('seller')" >
            <span :class="fullScreenStatus['seller'] ? 'iconfont icon-compress-alt' : 'iconfont icon-expand-alt' "></span>
          </div>
        </div>
      </section>
      <section class="screen-middle">
        <div id="middle-top" :class = "fullScreenStatus['map'] ? 'fullscreen' : ''" >
          <!-- 商家分布图表 -->
          <Map ref = 'map'></Map>
          <div class="resize" @click = "changeSize('map')" >
            <span :class="fullScreenStatus['map'] ? 'iconfont icon-compress-alt' : 'iconfont icon-expand-alt' "></span>
          </div>
        </div>
        <div id="middle-bottom" :class = "fullScreenStatus['rank'] ? 'fullscreen' : ''" >
          <!-- 地区销量排行图表 -->
          <Rank ref = 'rank'></Rank>
          <div class="resize" @click = "changeSize('rank')" >
            <span :class="fullScreenStatus['rank'] ? 'iconfont icon-compress-alt' : 'iconfont icon-expand-alt' "></span>
          </div>
        </div>
      </section>
      <section class="screen-right">
        <div id="right-top" :class = "fullScreenStatus['hot'] ? 'fullscreen' : ''" >
          <!-- 热销商品占比图表 -->
          <Hot ref="hot"></Hot>
          <div class="resize" @click = "changeSize('hot')" >
            <span :class="fullScreenStatus['hot'] ? 'iconfont icon-compress-alt' : 'iconfont icon-expand-alt' "></span>
          </div>
        </div>
        <div id="right-bottom" :class = "fullScreenStatus['stock'] ? 'fullscreen' : ''" >
          <!-- 库存销量分析图表 -->
          <Stock ref="stock"></Stock>
          <div class="resize" @click = "changeSize('stock')" >
            <span :class="fullScreenStatus['stock'] ? 'iconfont icon-compress-alt' : 'iconfont icon-expand-alt' "></span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
  // 导入子组件
  import Seller from '@/components/Seller.vue'
  import Trend from '@/components/Trend.vue'
  import Map from '@/components/Map.vue'
  import Rank from '@/components/Rank.vue'
  import Hot from '@/components/Hot.vue'
  import Stock from '@/components/Stock.vue'
  // 导入vuex 主题
  import { mapState } from 'vuex'
  // 导入获取主题样式函数
  import { getThemeValue } from '@/tools/theme_utils.js'
  export default {
    name: 'ScreenPage',
    data(){
      return{
        fullScreenStatus: { 
          trend: false, 
          seller: false, 
          map: false, 
          rank: false, 
          hot: false, 
          stock: false,
        }
      }
    },
    computed:{
      ...mapState(['theme']),
      borderSrc(){
        return '/static/img/' + getThemeValue(this.theme).headerBorderSrc
      },
      logoSrc(){
        return '/static/img/' + getThemeValue(this.theme).logoSrc
      },
      themeSrc(){
        return '/static/img/' + getThemeValue(this.theme).themeSrc
      },
      containerStyle(){
        return {
          backgroundColor: getThemeValue(this.theme).backgroundColor,
          color: getThemeValue(this.theme).titleColor
        }
      }
    },
    created(){
      // 注册存储回调函数
      this.$socket.registerCallBack('fullScreen',this.recvData)
      this.$socket.registerCallBack('themeChange',this.changeT)
    },
    destroyed(){
      this.$socket.unRegisterCallBack('fullScreen')
    },
    methods:{
      changeSize(key){
        // 将目标状态进行保存
        let changeKey = !this.fullScreenStatus[key]
        // 将所有状态初始化
        // Object.keys(this.fullScreenStatus).forEach(item => {
        //   this.fullScreenStatus[item] = false
        // })
        // 将目标变为目标状态
        // this.fullScreenStatus[key] = changeKey
        // 将图表进行适配
        // this.$nextTick(() => {
        //   this.$refs[key].screenAdapter()
        // })
        // 发送数据
        this.$socket.send({
          action: 'fullScreen',
          socketType: 'fullScreen',
          chartName: key,
          value: changeKey
        })
      },
      recvData(data){
        // 设置全部的状态
        Object.keys(this.fullScreenStatus).forEach(item => {
          this.fullScreenStatus[item] = false
        })
        // 将目标状态进行设置
        this.fullScreenStatus[data.chartName] = data.value
        // 进行尺寸设置
        Object.keys(this.fullScreenStatus).forEach(item => {
          this.$nextTick(() => {
            this.$refs[item].screenAdapter()
          })
        })
      },
      changeTimme(){
        // this.$store.commit('changeTheme')
        this.$socket.send({
          action: 'themeChange',
          socketType: 'themeChange',
          chartName: '',
          value: ''
        })
      },
      changeT(res){
        this.$store.commit('changeTheme')
      }
    },
    components:{
      Seller,
      Trend,
      Map,
      Rank,
      Hot,
      Stock
    }
  }
</script>

<style lang='less' scoped>
  .screen-container {
    width: 100%;
    height: 100%;
    padding: 0 20px;
    background-color: #161522;
    color: #fff;
    box-sizing: border-box;
  }

  .screen-header {
    width: 100%;
    height: 64px;
    font-size: 20px;
    position: relative;

    >div {
      img {
        width: 100%;
      }
    }

    .title {
      position: absolute;
      left: 50%;
      top: 50%;
      font-size: 20px;
      transform: translate(-50%, -50%);
    }

    .title-right {
      display: flex;
      align-items: center;
      position: absolute;
      right: 0px;
      top: 50%;
      transform: translateY(-80%);
    }

    .qiehuan {
      width: 28px;
      height: 21px;
      cursor: pointer;
    }

    .datetime {
      font-size: 15px;
      margin-left: 10px;
    }

    .logo {
      position: absolute;
      left: 0px;
      top: 50%;
      transform: translateY(-80%);

      img {
        height: 35px;
        width: 128px;
      }
    }
  }

  .screen-body {
    width: 100%;
    height: 100%;
    display: flex;
    margin-top: 10px;

    .screen-left {
      height: 100%;
      width: 27.6%;

      #left-top {
        position: relative;
        height: 53%;
      }

      #left-bottom {
        /* 4.1.2.注册组件,
        并将其置于合适的容器中 组件的引入和注册 布局如下: */
        position: relative;
        height: 31%;
        margin-top: 25px;
      }
    }

    .screen-middle {
      height: 100%;
      width: 41.5%;
      margin-left: 1.6%;
      margin-right: 1.6%;

      #middle-top {
        position: relative;
        width: 100%;
        height: 56%;
      }

      #middle-bottom {
        position: relative;
        margin-top: 25px;
        width: 100%;
        height: 28%;
      }
    }

    .screen-right {
      height: 100%;
      width: 27.6%;

      #right-top {
        position: relative;
        height: 46%;
      }

      #right-bottom {
        position: relative;
        height: 38%;
        margin-top: 25px;
      }
    } 
    .resize{
      position: absolute;
      top: 20px;
      right: 20px;
      cursor: pointer;
    }
    .fullscreen{
      position: fixed !important;
      width: 100% !important;
      height: 100% !important;
      top: 0 !important;
      left: 0 !important;
      z-index: 100 !important;
      margin: 0 !important;
    }
  }
</style>
