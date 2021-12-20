<template>
  <div class="com-son">
    <div class="echarts-box" ref = 'rank'>
    </div>
  </div>
</template>

<script>
  export default{
    name: 'Rank',
    data(){
      return {
        echartsInstance: null,
        allData: null,
        startValue: 0,
        endValue: 9,
        timeId: null
      }
    },
    methods:{
      initEcharts(){
        // 初始化 echarts 实例对象
        this.echartsInstance = echarts.init(this.$refs.rank,'chalk')
        // 数据配置项
        const initOption = {
          title:{
            text: '| 地区销售排行',
            top: '3%',
            left: '2%'
          },
          grid:{
            top: '40%',
            left: '5%',
            right: '5%',
            bottom: '5%',
            containLabel: true
          },
          tooltip:{
            show:true
          },
          dataZoom:{
            show: false
          },
          xAxis:{
            type: 'category',
          },
          yAxis:{
            type: 'value'
          },
          series: [
            {
              type: 'bar',
            }
          ]
        }
        // 设置配置项
        this.echartsInstance.setOption(initOption)
      },
      async getData(){
        // 获取数据
        const {data: res} = await this.$getApi('rank')
        res.sort((a,b) => {
          return b.value - a.value
        })
        this.allData = res
        this.updataEcharts()
        this.screenAdapter()
        this.echatrsSetInterVal()
      },
      updataEcharts(){
        // 颜色数组
        const colorArr = [ ['#0BA82C', '#4FF778'], ['#2E72BF', '#23E5E5'], ['#5052EE', '#AB6EE5'] ]
        // 处理数据
        const cateData = this.allData.map(item => {
          return item.name
        })
        const valueData = this.allData.map(item => {
          return item.value
        })
        // 数据配置项
        const dataOption = {
          title:{
            textStyle:{
              fontSize: 66
            }
          },
          dataZoom:{
            startValue: this.startValue,
            endValue: this.endValue
          },
          xAxis:{
            data: cateData// 分类数据
          },
          yAxis:{
            max: this.allData[0].value
          },
          series: [
            {
              data: valueData,// 各分类数据
              itemStyle:{
                color: arg => {
                  let itemColor = []
                  if(arg.value >= 300){
                    itemColor = colorArr[0]
                  }
                  else if(arg.value >= 200){
                    itemColor = colorArr[1]
                  }
                  else{
                    itemColor = colorArr[2]
                  }
                  return new echarts.graphic.LinearGradient(0,0,0,1,[{
                    offset: 0,
                    color: itemColor[0]
                  },{
                    offset: 1,
                    color: itemColor[1]
                  }])
                },
                borderRadius: [33,33,0,0]
              },
              barWidth: 66,
            }
          ]
        }
        // 设置配置项
        this.echartsInstance.setOption(dataOption)
      },
      screenAdapter(){
        // 字体大小获取
        const titleFontSize = this.$refs.rank.offsetWidth / 100 * 3.6
        // 配置项处理
        const adapterOption = {
          title:{
            textStyle:{
              fontSize: titleFontSize
            }
          },
          series: [
            {
              itemStyle:{
                borderRadius: [titleFontSize / 2,titleFontSize / 2,0,0]
              },
              barWidth: titleFontSize,
            }
          ]
        }
        // 设置配置项
        this.echartsInstance.setOption(adapterOption)
        this.echartsInstance.resize()
      },
      echatrsSetInterVal(){
        if(this.timeId){
          clearInterval(this.timeId)
        }
        this.timeId = setInterval(() => {
          this.startValue ++
          this.endValue ++
          if(this.endValue >= this.allData.length){
            this.startValue = 0,
            this.endValue = 9
          }
          this.updataEcharts()
        },5000)
      }
    },
    mounted(){
      // 初始化echarts实例
      this.initEcharts()
      // 获取数据
      this.getData()
      // 鼠标移入图表后关闭循环函数
      this.echartsInstance.on('mouseover',() => {
        clearInterval(this.timeId)
      })
      // 鼠标移出图表后开启循环函数
      this.echartsInstance.on('mouseout',() => {
        this.echatrsSetInterVal()
      })
      // 适配屏幕
      window.addEventListener('resize',this.screenAdapter)
    },
    destroyed(){
      clearInterval(this.timeId)
      window.removeEventListener('resize')
    }
  }
</script>

<style lang = 'less' scoped >
</style>
