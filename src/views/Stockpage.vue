<template>
  <div class="com-father">
    <Stock></Stock>
  </div>
</template>

<script>
  // 导入子组件
  import Stock from '@/components/Stock.vue'
  export default{
    name: 'Stockpage',
    components:{
      Stock
    }
  }
</script>

<style lang = 'less' scoped >
</style>
