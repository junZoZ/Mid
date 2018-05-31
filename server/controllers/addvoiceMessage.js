const { mysql } = require('../qcloud')

module.exports = async ctx => {
  var message = {
    m_content: ctx.query.content,
    m_latitude: ctx.query.latitude,
    m_longitude: ctx.query.longitude,
    m_voiceUrl: ctx.query.voiceUrl,
    m_voiceTime: ctx.query.voiceTime,
    open_id: ctx.query.open_id
  }
  // 增 
  result = await mysql("message").insert(message);
  // 查 
  //var res = await mysql("Book").where({ id }).first() 
  // 改 
  //await mysql("Book").update({ price: 66 }).where({ id }) 
  // 删 
  //await mysql("Book").del().where({ id }) 
  ctx.body = result;
  ctx.state.data = "success";
} 
