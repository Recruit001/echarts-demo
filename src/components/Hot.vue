<template>
  <div class="com-son">
  	<div class="echarts-box" ref = 'hot'></div>
    <div class="changeBar">
      <span class = "iconfont icon-arrow-down" @click = 'subIndex' :style = "{fontSize:fontSize,color: colorStyle}"></span>
      <span class = "iconfont icon-arrow-up" @click = 'addIndex' :style = "{fontSize:fontSize,color: colorStyle}" ></span>
    </div>
    <div class="title-Hot" :style = "{fontSize:fontSize,color: colorStyle}" >{{ titleHot }}</div>
  </div>
</template>

<script>
  // 导入vuex 属性
  import { mapState } from 'vuex'
  // 导入主题变化的不同样式
  import { getThemeValue } from '@/tools/theme_utils.js'
  export default{
    name: 'Hot',
    data(){
      return{
        echartsInstance: null,
        allData: null,
        currentIndex: 0,
        titleFontSize: 0
      }
    },
    computed:{
      titleHot(){
        if(!this.allData){
          return ''
        }
        else{
          return this.allData[this.currentIndex].name
        }
      },
      fontSize(){
        return this.titleFontSize + 'px'
      },
      // 将主题映射为计算属性
      ...mapState(['theme']),
      colorStyle(){
        return getThemeValue(this.theme).titleColor
      }
    },
    // 监督主题的变化
    watch:{
      theme(){
        // 销毁原有图表
        this.echartsInstance.dispose()
        // 重新初始化图表
        this.initEcharts()
        this.updataEcharts()
        this.screenAdapter()
      }
    },
    methods:{
      initEcharts(){
        // 初始化echarts 实例
        this.echartsInstance = echarts.init(this.$refs.hot,this.theme)
        // 梳理配置项
        const initOption = {
          title:{
            text: '| 热销商品销售金额占比统计',
            top: '3%',
            left: '2%'
          },
          legend:{
            icon: 'circle',
            top: '15%'
          },
          series:[
            {
              type: 'pie',
              center:['50%','60%'],
              label:{
                show: false
              },
              emphasis:{
                label:{
                  show:true
                },
                labelLine:{
                  show: false
                }
              }
            }
          ]
        }
        // 设置配置项
        this.echartsInstance.setOption(initOption)
      },
      async getData(res){
        // 获取数据
        // const {data: res} = await this.$getApi('hotproduct')
        this.allData = res
        this.updataEcharts()
        this.screenAdapter()
      },
      updataEcharts(){
        // 处理数据
        let seriesData = this.allData[this.currentIndex].children
        // 梳理配置项
        const dataOption = {
          tooltip:{
            formatter: arg =>{
              let returnStr = arg.data.name + '：' + arg.data.value
              let sum = 0
              arg.data.children.forEach(item => {
                sum += item.value
              })
              arg.data.children.forEach(item => {
                returnStr += '<br />'
                let itemRadio = parseInt(item.value / sum * 100) + '%'
                returnStr += item.name + '：' + itemRadio
              })
              return returnStr
            }
          },
          series:[
            {
              data: seriesData,// 饼图数据
            }
          ]
        }
        // 设置配置项
        this.echartsInstance.setOption(dataOption)
      },
      // 分辨率处理
      screenAdapter(){
        // 字体大小获取
        this.titleFontSize = this.$refs.hot.offsetWidth / 100 * 3.6
        // 配置项处理
        const adapterOption = {
          title:{
            textStyle:{
              fontSize: this.titleFontSize
            }
          },
          legend:{
            itemWidth: this.titleFontSize,
            itemHeight: this.titleFontSize,
            itemGap: this.titleFontSize,
            textStyle:{
              fontSize: this.titleFontSize / 2
            }
          },
          series:[
            {
              radius: this.titleFontSize * 4.5,
            }
          ]
        }
        // 设置配置项
        this.echartsInstance.setOption(adapterOption)
        this.echartsInstance.resize()
      },
      addIndex(){
        this.currentIndex ++
        // 边界处理
        if(this.currentIndex >= this.allData.length){
          this.currentIndex = 0
        }
        this.updataEcharts()
      },
      subIndex(){
        this.currentIndex --
        // 边界处理
        if(this.currentIndex < 0){
          this.currentIndex = 2
        }
        this.updataEcharts()
      }
    },
    created(){
      // 注册存储回调函数
      this.$socket.registerCallBack('hotData',this.getData)
    },
    mounted(){
      // 初始化echarts 实例
      this.initEcharts()
      // 获取数据
      // this.getData()
      this.$socket.send({
        action: 'getData',
        socketType: 'hotData',
        chartName: 'hot',
        value: ''
      })
      // 适配
      window.addEventListener('resize',this.screenAdapter)
    },
    destroyed(){
      window.removeEventListener('resize')
      // 清楚注册的函数
      this.$socket.unRegisterCallBack('hotData')
    }
  }
</script>

<style lang = 'less' scoped >
  .changeBar{
    width: 80%;
    position: absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    display: flex;
    justify-content: space-between;
    align-items: center;
    span{
      cursor: pointer;
      user-select: none;
      color:#fff;
    }
  }
  .title-Hot{
    position: absolute;
    bottom: 3%;
    right: 15%;
    color:#fff;
  }
</style>
