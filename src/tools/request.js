// axios 网络请求封装
// 导入axios
import axios from 'axios'
// 创建axios 实例对象
// 请求后台数据的接口
const axiosBackStage = axios.create({
  baseURL: 'http://127.0.0.1:8888/api/'
})
// 按需导出请求函数
export const getApi = function(path,obj){
  if(obj){
    return axiosBackStage.get(path,obj)
  }
  else{
    return axiosBackStage.get(path)
  }
}

// 请求同一路径下的接口
const axios2 = axios.create({
  baseURL: 'http://localhost:8080/static/map/'
})

// 按需导出

export const get2Api = function(path,obj){
  if(obj){
    return axios2.get(path,obj)
  }
  else{
    return axios2.get(path)
  }
}