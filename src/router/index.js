import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入组件 注册路由
import Sellerpage from '../views/Sellerpage.vue'
import Trendpage from '../views/Trendpage.vue'
import Mappage from '../views/Mappage.vue'

Vue.use(VueRouter)

const routes = [
  {path: '/sellerpage',name: 'Sellerpage',component: Sellerpage},
  {path: '/trendpage',name: 'Trendpage',component: Trendpage},
  {path: '/mappage',name: 'Mappage',component: Mappage}
]

const router = new VueRouter({
  routes
})

export default router
