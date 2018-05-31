/*getthought.js
**Author: Tanhao(541025737@qq.com)
**Function: 返回所有的符合坐标条件的感想 
*/

const { mysql } = require('../qcloud')

module.exports = async ctx => {
  var open_id = ctx.query.open_id
  var la_low = ctx.query.la_low;
  var lo_low = ctx.query.lo_low;
  var lo_high = ctx.query.lo_high;
  var la_high = ctx.query.la_high
  //先thought表和用户表(cSessionInfo)内连接，再将tVote左外连接：保留左表信息（因为点赞表可能没记录）
  result = await mysql
  .select(
    'thought.thought_id', 
    'thought_content', 
    'thought_positive',
    'thought_sentiment', 
    'thought_imageurl', 
    'thought_latitude',
    'thought_longitude',
    'thought_location',
    'thought_type',
    'thought_upvote',
    'thought_datetime',
    'user_info',
    'vote_type')
  .from("thought")
  .whereBetween('thought_latitude', [la_low, la_high])
  .whereBetween('thought_longitude', [lo_low, lo_high])
  .innerJoin('cSessionInfo', 'thought.open_id', 'cSessionInfo.open_id')
  .leftJoin('tVote', function () {
    this
    .onIn('tVote.open_id', [open_id])
    .andOn('tVote.thought_id', '=', 'thought.thought_id')
  })
  // 增 
  //result = await mysql("thought").insert();
  // 查 
  //var res = await mysql("Book").where({ id }).first() 
  // 改 
  //await mysql("Book").update({ price: 66 }).where({ id }) 
  // 删 
  //await mysql("Book").del().where({ id }) 
  ctx.body = result;
  ctx.state.data = "success";
} 
