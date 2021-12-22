// 导入websocket 
const websocket = require('ws')
const path = require('path')
const getData = require('../utiles/utiles.js')
// 创建websocket 实例
let wss = new websocket.Server({
  port: 9998
})
// 创建监督事件
module.exports.listen = function(){
  // 监督是否连接
  wss.on('connection',client => {
    console.log('有客户端连接')
    // 监督是否有数据发过来
    client.on('message',async msg => {
      console.log('在客户端有数据发过来')
      let payload = JSON.parse(msg)
      if(payload.action == 'getData'){
        let filePath = '../data/' + payload.chartName + '.json'
        filePath = path.join(__dirname,filePath)
        let res = await getData.getJson(filePath)
        payload.data = res
        client.send(JSON.stringify(payload))
      }
      else{
        wss.clients.forEach(item => {
          console.log('*******************')
          item.send(JSON.stringify(payload))
        })
      }
    })
  })
}