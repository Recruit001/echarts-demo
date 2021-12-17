// axios 网络请求封装
// 导入axios
import axios from 'axios'
// 默认访问路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/'
// 按需导出请求函数
export const getApi = function(path,obj){
  if(obj){
    return axios.get(path,obj)
  }
  else{
    return axios.get(path)
  }
}