import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入封装axios 并进行全局注册
import { getApi,get2Api } from '@/tools/request.js'
// 导入全局配置样式表
import '@/assets/css/global.css'
// 导入字体样式
import './assets/font/iconfont.css'
// 导入websocket 实例
import SocketService from '@/tools/socket_service.js' 
// 连接websocket 服务器
SocketService.Instance.connect()
// 将实例挂载到vue 原型上
Vue.prototype.$socket = SocketService.Instance

Vue.config.productionTip = false

Vue.prototype.$getApi = getApi
Vue.prototype.$get2Api = get2Api
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
