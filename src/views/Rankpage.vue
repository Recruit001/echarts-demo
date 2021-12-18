<template>
  <div class="com-father">
    <Rank></Rank>
  </div>
</template>

<script>
  // 导入子组件
  import Rank from '@/components/Rank.vue'
  export default{
    name: 'Rankpage',
    components:{
      Rank
    }
  }
</script>

<style lang = 'less' scoped >
</style>
