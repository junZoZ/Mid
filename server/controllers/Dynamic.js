const { mysql } = require('../qcloud')

module.exports = async ctx => {

  var dynamic = ctx.query.dynamic
  var filePath = ctx.query.voiceFilePath
  
  result1 = await mysql("message")
    .update({ dynamic: dynamic })
    .where('m_voiceUrl', filePath)



  ctx.body = {
    'result1': result1,
  };
  ctx.state.data = "success";
}
