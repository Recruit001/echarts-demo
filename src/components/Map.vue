<template>
  <div class="com-son">
    <div class="echarts-box" ref = 'map'>
    </div>
  </div>
</template>

<script>
  // 导入准备好的映射工具
  import { getProvinceMapInfo } from '@/tools/map_utils.js'
  export default{
    name: 'Map',
    data(){
      return {
        echartsInstance: null,
        allData: null,
        mapObj: {}
      }
    },
    methods:{
      initEcharts(){
        // 初始化 echarts 实例对象
        this.echartsInstance = echarts.init(this.$refs.map,'chalk')
        // 处理配置项
        const initOption = {
          title:{
            text: '| 商户分布与销量排行',
            top: '3%',
            left: '2%'
          },
          legend:{
            left: '5%',
            bottom: '5%',
            orient: 'vertical'
          }
        }
        // 设置配置项
        this.echartsInstance.setOption(initOption)
      },
      async getData(){
        // 注册地图
          // 获取地图数据
        const {data: res} = await this.$get2Api('/china.json')
        echarts.registerMap('china',res)
        this.mapObj.china = 'china'
        // 获取数据
        const {data: ret} = await this.$getApi('map')
        this.allData = ret
        this.updataEcharts()
      },
      updataEcharts(){
        // 数据处理
        let seriesData = this.allData.map(item => {
          return {
            name: item.name,
            data: item.children,
            type: 'effectScatter',
            coordinateSystem: 'geo',
            rippleEffect:{
              scale: 5,
              brushType: 'stroke'
            }
          }
        })
        // 处理配置项
        const dataOption = {
          geo:{
            type: 'map',
            map: this.mapObj.china,
            top: '5%',
            bottom: '5%',
            itemStyle:{
              areaColor: '#2E72BF',
              borderColor: '#333'
            }
          },
          series: seriesData
        }
        // 设置配置项
        this.echartsInstance.setOption(dataOption)
      },
      screenAdapter(){
        // 计算大小
        const titleFontSize = this.$refs.map.offsetWidth / 100 * 3.6
        // 处理配置项
        const adapterOption = {
          title:{
            textStyle:{
              fontSize: titleFontSize
            }
          },
          legend:{
            itemWidth: titleFontSize / 2,
            itemHeight: titleFontSize / 2,
            itemGap: titleFontSize / 2,
            textStyle:{
              fontSize: titleFontSize / 2
            }
          }
        }
        // 设置配置项
        this.echartsInstance.setOption(adapterOption)
      }
    },
    mounted(){
      // 初始化 echarts 实例
      this.initEcharts()
      // 获取数据
      this.getData()
      // 分辨率设置
      this.screenAdapter()
      window.addEventListener('resize',this.screenAdapter)
      this.echartsInstance.on('click',async (arg) => {
        let obj = getProvinceMapInfo(arg.name)
        // 没有数据时不操作
        if(!obj.key) return
        if(!this.mapObj.hasOwnProperty(obj.key)){
          // 进行地图注册
          // 请求数据
          const {data: res} = await this.$get2Api(obj.path)
          echarts.registerMap(obj.key,res)
          // 保存到data中 以备下次使用
          this.mapObj[obj.key] = obj.key
        }
        // 处理配置项
        const clickOption = {
          geo:{
            map: obj.key
          }
        }
        // 设置配置项
        this.echartsInstance.setOption(clickOption)
      })
      this.echartsInstance.on('dblclick',() => {
        const dblOption = {
          geo:{
            map: 'china'
          }
        }
        this.echartsInstance.setOption(dblOption)
        this.echartsInstance.resize()
      })
    }
  }
</script>

<style lang = 'less' scoped >
</style>
