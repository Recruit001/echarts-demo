// 业务逻辑中间件
const path = require('path')
const fileUtiles = require('../utiles/utiles.js')
module.exports = async (ctx,next) => {
  const url = ctx.request.url
  let filePath = url.replace('/api','')
  filePath = '../data' + filePath + '.json'
  try{
    filePath = path.join(__dirname,filePath)
    const res = await fileUtiles.getJson(filePath)
    ctx.response.body = res
  }catch(e){
    const errorMsg = {
      message: '读取文件内容失败, 文件资源不存在',
      status: 404
    }
    ctx.response.body = JSON.stringify(errorMsg)
  }
  next()
}