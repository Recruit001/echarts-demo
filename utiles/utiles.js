// 文件处理工具
const fs = require('fs')
module.exports.getJson = function(filePath){
  return new Promise((resolve,reject) => {
    fs.readFile(filePath,'utf-8',function(error,data){
      if(error){
        reject(error)
      }
      else{
        resolve(data)
      }
    })
  })
}