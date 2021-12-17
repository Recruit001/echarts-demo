<template>
  <div class="com-son">
    <div class="line-title-box" :style = "{fontSize:(fontSize + 'px')}">
      <div class="title-line">
        <span>{{ '| ' + titleLine }}</span>
        <span :class = 'spanClass' @click = 'showControl = !showControl' id = 'span' :style = "{fontSize:(fontSize + 'px'),marginLeft:(fontSize / 5 + 'px')}"></span>
      </div>
      <div class="select-box" v-show = 'showControl'>
        <div class="select-item" v-for = 'item in itemData' :key = 'item.key' @click = 'selectItemClick(item.key)' :style = "{marginLeft:marginLeft}">{{ item.text }}</div>
      </div>
    </div>
    <div class="echarts-box" ref = 'line'>
    </div>
  </div>
</template>

<script>
  export default{
    name: 'Trend',
    data(){
      return {
        echartsInstance: null,
        allData: null,
        showControl: false,
        choseType: 'commodity',
        titleFontSize: null
      }
    },
    computed:{
      spanClass(){
        if(this.showControl){
          return 'iconfont icon-arrow-up'
        }
        else{
          return 'iconfont icon-arrow-down'
        }
      },
      itemData(){
        if(!this.allData){
          return {}
        }
        else{
          return this.allData.type.filter(item => {
            return item.key != this.choseType
          })
        }
      },
      titleLine(){
        if(!this.allData){
          return ''
        }
        else{
          let title = ''
          this.allData.type.map(item => {
            if(item.key == this.choseType){
              title = item.text
            }
          })
          return title
        }
      },
      fontSize(){
        if(!this.titleFontSize){
          return ''
        }
        else{
          return this.titleFontSize
        }
      },
      marginLeft(){
        if(!this.titleFontSize){
          return ''
        }
        else{
          return this.titleFontSize / 2 + 'px'
        }
      }
    },
    methods:{
      // 初始化echarts实例
      initEcharts(){
        this.echartsInstance = echarts.init(this.$refs.line,'chalk')
        // 处理配置项
        let initOption = {
          legend:{
            show: true,
            icon: 'circle',
            top: '15%',
            left: '2%',
          },
          grid:{
            top: '35%',
            right: '4%',
            left: '3%',
            bottom: '1%',
            containLabel: true
          },
          tooltip:{
            trigger: 'axis'
          },
          xAxis:{
            type: 'category',
            boundaryGap: false
          },
          yAxis:{
            type: 'value'
          }
        }
        // 设置配置项
        this.echartsInstance.setOption(initOption)
      },
      async getData(){
        // 获取数据
        const {data: res} = await this.$getApi('/trend')
        this.allData = res
        this.updataEcharts()
        console.log(this.allData)
      },
      updataEcharts(){
        // 处理数据
        // 半透明的颜色值
        const colorArr1 = [ 
          'rgba(11, 168, 44, 0.5)', 
          'rgba(44, 110, 255, 0.5)', 
          'rgba(22, 242, 217, 0.5)', 
          'rgba(254, 33, 30, 0.5)', 
          'rgba(250, 105, 0, 0.5)' ]
          // 全透明的颜色值 
          const colorArr2 = [ 
            'rgba(11, 168, 44, 0)', 
            'rgba(44, 110, 255, 0)', 
            'rgba(22, 242, 217, 0)', 
            'rgba(254, 33, 30, 0)', 
            'rgba(250, 105, 0, 0)' ]
        const cateData = this.allData.common.month
        const seriesData = []
        this.allData[this.choseType].data.forEach((item,index) => {
          let obj = {
            type: 'line'
          }
          obj.name = item.name
          obj.data = item.data
          obj.stack = this.choseType
          obj.areaStyle = {
            color: {
              type: 'line',
              colorStops:[
                {
                  offset: 0,
                  color: colorArr1[index]
                },
                {
                  offset: 1,
                  color: colorArr2[index]
                }
              ]
            }
          }
          seriesData.push(obj)
        })
        // 处理配置项
        let dataOption = {
          xAxis:{
            data: cateData,// 分类数据
          },
          series: seriesData// 折线图数据
        }
        // 设置配置项
        this.echartsInstance.setOption(dataOption)
      },
      screenAdapter(){
        // 字体大小获取
        this.titleFontSize = this.$refs.line.offsetWidth / 100 * 3.6
        // 配置项处理
        const adapterOption = {
          legend:{
            itemWidth: this.titleFontSize,
            itemHeight: this.titleFontSize,
            itemGap: this.titleFontSize,
            textStyle:{
              fontSize: this.titleFontSize / 2
            }
          }
        }
        // 设置配置项
        this.echartsInstance.setOption(adapterOption)
        this.echartsInstance.resize()
      },
      selectItemClick(key){
        this.choseType = key
        this.showControl = false
        this.updataEcharts()
      }
    },
    mounted(){
      // 初始化echarts 实例
      this.initEcharts()
      // 获取数据
      this.getData()
      // 适配
      this.screenAdapter()
      window.addEventListener('resize',this.screenAdapter)
    }
  }
</script>

<style lang = 'less' scoped >
  .line-title-box{
    position: absolute;
    top:3%;
    left:2%;
    color:#fff;
    z-index: 99;
    user-select:none;
    #span{
      cursor:pointer;
    }
    .select-item{
      cursor: pointer;
    }
  }
</style>
