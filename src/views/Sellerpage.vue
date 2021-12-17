<template>
  <div class="com-father">
    <Seller></Seller>
  </div>
</template>

<script>
  // 导入子组件
  import Seller from '@/components/Seller.vue'
  export default {
    name: 'Sellerpage',
    components:{
      Seller
    }
  }
</script>

<style lang = 'less' scoped >
</style>
