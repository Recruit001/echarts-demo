import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入组件 注册路由
import Sellerpage from '../views/Sellerpage.vue'
import Trendpage from '../views/Trendpage.vue'

Vue.use(VueRouter)

const routes = [
  {path: '/sellerpage',name: 'Sellerpage',component: Sellerpage},
  {path: '/trendpage',name: 'Trendpage',component: Trendpage}
]

const router = new VueRouter({
  routes
})

export default router
