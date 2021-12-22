<template>
  <div class="com-son">
  	<div class="echarts-box" ref = 'stock'>
    </div>
  </div>
</template>

<script>
  // 导入vuex 属性
  import { mapState } from 'vuex'
  export default{
    name: 'Stock',
    data(){
      return {
        echartsInstance: null,
        allData: null,
        currentIndex: 0,
        total: 0,
        timeId: null
      }
    },
    computed:{
      ...mapState(['theme'])
    },
    watch:{
      theme(){
        // 图表销毁
        this.echartsInstance.dispose()
        // 重新绘制图表
        this.initEcharts()
        this.updataEcharts()
        this.screenAdapter()
      }
    },
    methods:{
      initEcharts(){
        // 初始化echarts实例
        this.echartsInstance = echarts.init(this.$refs.stock,this.theme)
        // 梳理配置项
        const initOption = {
          title:{
            text: '| 库存销售量',
            top: '3%',
            left: '2%'
          },
          series:[
            {
              type: 'pie',
              label:{
                show:true,
                position: 'center',
              },
              labelLine:{
                show: false
              },
              emphasis:{
                scale: false
              }
            },
            {
              type: 'pie',
              label:{
                show:true,
                position: 'center',
              },
              labelLine:{
                show: false
              },
              emphasis:{
                scale: false
              }
            },
            {
              type: 'pie',
              label:{
                show:true,
                position: 'center',
              },
              labelLine:{
                show: false
              },
              emphasis:{
                scale: false
              }
            },
            {
              type: 'pie',
              label:{
                show:true,
                position: 'center',
              },
              labelLine:{
                show: false
              },
              emphasis:{
                scale: false
              }
            },
            {
              type: 'pie',
              label:{
                show:true,
                position: 'center',
              },
              labelLine:{
                show: false
              },
              emphasis:{
                scale: false
              }
            }
          ]
        }
        // 设置配置项
        this.echartsInstance.setOption(initOption)
      },
      async getData(res){
        // const {data: res} = await this.$getApi('stock')
        this.allData = res
        this.total = this.allData.length % 5 == 0 ? this.allData.length / 5 : parseInt(this.allData.length / 5) + 1
        this.updataEcharts()
        this.screenAdapter()
        this.echartsSetInterVal()
      },
      updataEcharts(){
        // 处理数据
        // 5个圆环对应的圆心点 
        const centerPointers = [ ['18%', '40%'], ['50%', '40%'], ['82%', '40%'], ['34%', '75%'], ['66%', '75%'] ]
        // 增加5个圆环的渐变颜色范围 
        const colorArrs = [ ['#4FF778', '#0BA82C'], ['#E5DD45', '#E8B11C'], ['#E8821C', '#E55445'], ['#5052EE', '#AB6EE5'], ['#23E5E5', '#2E72BF'] ]
        const startValue = this.currentIndex * 5
        const endValue = (this.currentIndex + 1) * 5
        let seriesData = this.allData.slice(startValue,endValue).map((item,index) => {
          let obj = {
            name: item.name,
            type: 'pie',
            label:{
              color: colorArrs[index][0],
              formatter: () => {
                return item.name + '\n\n' + item.sales
              }
            },
            data: [],
            center: centerPointers[index],
          }
          obj.data.push({
            value: item.sales,
            itemStyle: {
              color:{
                type: 'line',
                x:0,
                y:1,
                x2:0,
                y2:0,
                colorStops:[
                  {
                    offset: 0,
                    color: colorArrs[index][0]
                  },
                  {
                    offset: 1,
                    color: colorArrs[index][1]
                  }
                ]
              }
            }
          })
          obj.data.push({
            value: item.stock,
            itemStyle: {
              color: '#333843'
            }
          })
          return obj
        })
        // 梳理配置项
        const dataOption = {
          series: seriesData
        }
        // 设置配置项
        this.echartsInstance.setOption(dataOption)
      },
      screenAdapter(){
        // 字体大小获取
        const titleFontSize = this.$refs.stock.offsetWidth / 100 * 3.6
        const innerRadius = titleFontSize * 2.6 
        const outterRadius = innerRadius * 1.125
        // 配置项处理
        const adapterOption = {
          title:{
            textStyle:{
              fontSize: titleFontSize
            }
          },
          series:[
            {
              label:{
                fontSize: titleFontSize / 2,
              },
              radius:[innerRadius,outterRadius]
            },
            {
              label:{
                fontSize: titleFontSize / 2,
              },
              radius:[innerRadius,outterRadius]
            },
            {
              label:{
                fontSize: titleFontSize / 2,
              },
              radius:[innerRadius,outterRadius]
            },
            {
              label:{
                fontSize: titleFontSize / 2,
              },
              radius:[innerRadius,outterRadius]
            },
            {
              label:{
                fontSize: titleFontSize / 2,
              },
              radius:[innerRadius,outterRadius]
            }
          ]
        }
        this.echartsInstance.setOption(adapterOption)
        this.echartsInstance.resize()
      },
      echartsSetInterVal(){
        this.timeId = setInterval(() => {
          this.currentIndex ++
          if(this.currentIndex >= this.total){
            this.currentIndex = 0
          }
          this.updataEcharts()
        },5000)
      }
    },
    created(){
      this.$socket.registerCallBack('stockData',this.getData)
    },
    // 设置配置项
    mounted(){
      // 初始化echarts实例
      this.initEcharts()
      // 获取数据
      // this.getData()
      this.$socket.send({
        action: 'getData',
        socketType: 'stockData',
        chartName: 'stock',
        value: ''
      })
      // 尺寸改变时候适配
      window.addEventListener('resize',this.screenAdapter)
      // 鼠标移入图表暂停循环
      this.echartsInstance.on('mouseover',() => {
        clearInterval(this.timeId)
      })
      // 鼠标移出图表开启循环
      this.echartsInstance.on('mouseout',() => {
        this.echartsSetInterVal()
      })
    },
    destroyed(){
      clearInterval(this.timeId)
      window.removeEventListener('resize')
      this.$socket.unRegisterCallBack('stockData')
    }
  }
</script>

<style lang = 'less' scoped >
</style>
