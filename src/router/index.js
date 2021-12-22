import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入组件 注册路由
// import Sellerpage from '../views/Sellerpage.vue'
// import Trendpage from '../views/Trendpage.vue'
// import Mappage from '../views/Mappage.vue'
// import Rankpage from '../views/Rankpage.vue'
// import Hotpage from '../views/Hotpage.vue'
// import Stockpage from '../views/Stockpage.vue'
import ScreenPage from '../views/ScreenPage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/screen',
  },
  {
    path: '/screen',
    name: ' ScreenPage',
    component: ScreenPage,
  }
  // {path: '/sellerpage',name: 'Sellerpage',component: Sellerpage},
  // {path: '/trendpage',name: 'Trendpage',component: Trendpage},
  // {path: '/mappage',name: 'Mappage',component: Mappage},
  // {path: '/rankpage',name: 'Rankpage',component: Rankpage},
  // {path: '/hotpage',name: 'Hotpage',component: Hotpage},
  // {path: '/stockpage',name: 'Stockpage',component: Stockpage}
]

const router = new VueRouter({
  routes
})

export default router
