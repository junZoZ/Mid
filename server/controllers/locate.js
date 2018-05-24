const { mysql } = require('../qcloud') 

module.exports = async ctx => {
  // 增 
  var position = { 
    openId: 11,
    XX: 213.12,
    YY: 45.454
  } 
  await mysql("position").insert(position)
  // 查 
  //var res = await mysql("Book").where({ id }).first() 
  // 改 
  //await mysql("Book").update({ price: 66 }).where({ id }) 
  // 删 
  //await mysql("Book").del().where({ id }) 
  
  ctx.state.data = "OK11" 
} 
