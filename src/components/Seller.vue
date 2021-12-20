<template>
  <div class="com-son">
    <!-- 存放图表的盒子 -->
    <div class="echarts-box" ref = "bar">
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Seller',
    data(){
      return{
        echartsInstance: null,
        allData: null,
        currenPage: 0,
        pageSize: 5,
        total: null,
        timeId: null
      }
    },
    methods:{
      // 初始化图标实例
      initEcharts(){
        this.echartsInstance = echarts.init(this.$refs.bar,'chalk')
        // 处理配置项
        const initOption = {
          title:{
            text: '| 商家销售量统计',
            top: '3%',
            left:'2%'
          },
          grid:{
            top: '20%',
            right: '6%',
            bottom: '3%',
            left: '3%',
            containLabel: true
          },
          xAxis:{
            type: 'value'
          },
          yAxis:{
            type: 'category',
          },
          series:[
            {
              name: '销量',
              type: 'bar',
              label: {
                show: true,
                position: 'right',
                color: '#fff'
              },
              itemStyle: {
                borderRadius:[0,33,33,0],
                color:{
                  type: 'line',
                  x:0,
                  y:0,
                  x2:1,
                  y2:0,
                  colorStops:[
                    {
                      offset: 0,
                      color: '#5052EE'
                    },
                    {
                      offset: 1,
                      color: '#AB6EE5'
                    }
                  ]
                }
              }
            }
          ],
          tooltip:{
            trigger: 'axis',
            axisPointer:{
              type: 'line',
              lineStyle:{
                type: 'solid',
                color: '#2D3443',
              },
              z: 1
            }
          }
        }
        // 设置图表
        this.echartsInstance.setOption(initOption)
        // 设置配置项
      },
      // 获取数据
      async getData(){
        // 发送ajax请求
        const {data: res} = await this.$getApi('/seller')
        console.log(res)
        // 数据顺序处理
        res.sort((a,b) => {
          return a.value - b.value
        })
        // 将返回数据存放在data中
        this.allData = res
        // 启动配置图表
        this.updataEcharts()
      },
      // 配置图表
      updataEcharts(){
        // 边界数
        this.total = this.allData.length % this.pageSize == 0 ? this.allData.length / this.pageSize : Math.floor(this.allData.length / this.pageSize + 1)
        let jbData = this.allData.slice(this.currenPage * this.pageSize,(this.currenPage + 1) * this.pageSize)
        console.log(jbData)
        // 数据处理
          // 分类数据
        const cateData = jbData.map(item => {
          return item.name
        })
          // 数据值
        const valueData = jbData.map(item => {
          return item.value
        })
        // 获取图表配置项
        // ui设置处理
        const dataOption = {
          xAxis:{
            max: this.allData[this.allData.length - 1].value
          },
          yAxis:{
            data: cateData// 分类数据
          },
          series:[
            {
              data: valueData,// 数据值
            }
          ]
        }
        // 设置图表
        this.echartsInstance.setOption(dataOption)
        this.screenAdapter()
        this.beginTime()
      },
      beginTime(){
        this.timeId = setTimeout(() => {
          if(this.timeId){
            clearTimeout(this.timeId)
          }
          this.currenPage ++
          if(this.currenPage >= this.total){
            this.currenPage = 0
          }
          this.updataEcharts()
        },3000)
      },
      handleMouseMove(){
        clearTimeout(this.timeId)
      },
      screenAdapter(){
        // 字体大小获取
        const titleFontSize = this.$refs.bar.offsetWidth / 100 * 3.6
        // 配置项处理
        const adapterOption = {
          title:{
            textStyle: {
              fontSize: titleFontSize
            }
          },
          series:[
            {
              barWidth: titleFontSize,
              itemStyle: {
                borderRadius:[0,titleFontSize / 2,titleFontSize / 2,0],
              }
            }
          ],
          tooltip:{
            axisPointer:{
              lineStyle:{
                width: titleFontSize,
              }
            }
          }
        }
        // 设置配置项
        this.echartsInstance.setOption(adapterOption)
        this.echartsInstance.resize()
      }
    },
    mounted(){
      // 初始化图表
      this.initEcharts()
      // 获取数据
      this.getData()
      // 给echarts实例对象绑定事件
      this.echartsInstance.on('mousemove',this.handleMouseMove)
      this.echartsInstance.on('mouseout',this.beginTime)
      window.addEventListener('resize',this.screenAdapter)
    },
    destroyed(){
      clearTimeout(this.timeId)
      window.removeEventListener('resize')
    }
  }
</script>

<style>
</style>
