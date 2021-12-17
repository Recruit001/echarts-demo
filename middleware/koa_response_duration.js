// 计算计算机处理逻辑中间件
module.exports = async (ctx,next) => {
  // 获取一进来执行的时间
  let startTime = Date.now()
  //让其他的中间件进行执行
  await next()
  // 获取执行完毕后的时间
  let endTime = Date.now()
  // 计算程序运行时间
  const duration = endTime - startTime
  // 设置响应头
  ctx.set('X-Response-Time',duration + 'ms')
}