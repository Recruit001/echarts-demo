<template>
  <div class="com-father">
    <Trend></Trend>
  </div>
</template>

<script>
  // 导入子组件
  import Trend from '@/components/Trend.vue'
  export default{
    name: 'Trendpage',
    components:{
      Trend
    }
  }
</script>

<style lang = 'less' scoped >
</style>
