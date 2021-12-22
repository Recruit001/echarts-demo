// 后台入口文件
// 1、创建koa实例对象
const Koa = require('koa')
const app = new Koa()
const respDurationMiddleware = require('./middleware/koa_response_duration.js')
const respHeaderMiddleware = require('./middleware/koa_response_header.js')
const respDataMiddleware = require('./middleware/koa_response_data.js')
const webSocketService = require('./service/web_socket_service')
webSocketService.listen()
// 2、绑定中间件
// 绑定第一层中间件
app.use(respDurationMiddleware)
// 绑定第二层中间件
app.use(respHeaderMiddleware)
// 绑定第三层中间件
app.use(respDataMiddleware)
// 3、监督端口号
app.listen(8888)