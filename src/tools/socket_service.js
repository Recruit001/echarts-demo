// 定义单例
export default class SocketService{
  static instance = null
  static get Instance(){
    if(!this.instance){
      this.instance = new SocketService()
    }
    return this.instance
  }
  // websocket 实例 类属性
  ws = null
  
  // 是否连接
  connected = false
  sendRetryCount = 0
  connectRetryCount = 0 // 重连次数, 重连次数越大, 下一次再发起重连的延时也就越长
  // 回调函数总数
  // 业务类型和回调函数的对于关系 
  callBackMapping = {}
  // 连接服务器
  connect(){
    // 判断浏览器是否有webSocket
    if(!window.WebSocket){
      return console.log('该浏览器不支持websocket')
    }
    else{
      // 创建websocket 实例对象
      this.ws = new WebSocket('ws://localhost:9998')
    }
    // 连接成功
    this.ws.onopen = () => {
      console.log('连接成功')
      this.connected = true
      this.connectRetryCount = 0
    }
    // 收到服务器信息
    this.ws.onmessage = msg => {
      console.log('收到服务器发送过来的信息')
      const recvData = JSON.parse(msg.data)
      const socketType = recvData.socketType
      console.log(this.callBackMapping)
      // 先判断是否有回调函数
      if(this.callBackMapping[socketType]){
        if(recvData.action == 'getData'){
          const realData = recvData.data
          this.callBackMapping[socketType].call(this,JSON.parse(realData))
        }
        else if(recvData.action == 'fullScreen'){
          this.callBackMapping[socketType].call(this,recvData)
        }
        else{
          this.callBackMapping[socketType].call(this,recvData)
        }
      }
    }
    // 连接失败
    this.ws.onclose = () => {
      this.connected = false
      console.log('连接失败')
      setTimeout(() => {
        this.connectRetryCount ++
        this.connect()
      },this.connectRetryCount * 200)
    }
  }
  // 注册存储回调函数
  /*** 
  socketType 
  * trendData sellerData mapData rankData hotData stockData * 
  * fullScreen * themeChange * callBack *
  *  回调函数 
  * */
  registerCallBack(socketType,callback){
    this.callBackMapping[socketType] = callback
  }
  unRegisterCallBack(socketType){
    this.callBackMapping[socketType] = null
  }
  send(data){
    if(this.connected){
     console.log('发送数据到服务器')
     this.ws.send(JSON.stringify(data))
     this.sendRetryCount = 0
    }
    else{
      this.sendRetryCount ++
      setTimeout(() => {
        this.send(data)
      },500 * this.sendRetryCount)
    }
  }
}