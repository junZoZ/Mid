/*getthought_adv.js
**Author: Tanhao(541025737@qq.com)
**Function: getthought加强版,搜索出每一组upvote最高的标签
*/
const { mysql } = require('../qcloud')

module.exports = async ctx => {
  var open_id = ctx.query.open_id
  var la_low = ctx.query.la_low;
  var lo_low = ctx.query.lo_low;
  var lo_high = ctx.query.lo_high;
  var la_high = ctx.query.la_high

  var la_section = (la_high - la_low) / ctx.query.n
  var lo_section = (lo_high - lo_low) / ctx.query.m

  //选取点赞量最高的结果
  //因为设置了字段别名，result 返回一个包含两个数组的数组，第一个数组为数据，第二个为描述
  result = await mysql.raw('SELECT thought.*,cSessionInfo.user_info, (SELECT vote_type FROM tVote WHERE tVote.open_id = ? and tVote.thought_id = thought.thought_id) AS vote_type , ROUND(thought.thought_latitude / ?) as c, ROUND(thought.thought_longitude / ?) as r FROM thought, cSessionInfo WHERE thought.open_id = cSessionInfo.open_id AND thought_upvote = (SELECT MAX(thought_upvote) FROM thought as t WHERE (thought_latitude BETWEEN ? AND ?) AND (thought_longitude BETWEEN ? AND ?) AND ROUND(t.thought_latitude / ?) = ROUND(thought.thought_latitude / ?) AND ROUND(t.thought_longitude / ?) = ROUND(thought.thought_longitude / ?))', [open_id, la_section, lo_section, la_low, la_high, lo_low, lo_high, la_section, la_section, lo_section, lo_section])

  // 增 
  //result = await mysql("thought").insert();
  // 查 
  //var res = await mysql("Book").where({ id }).first() 
  // 改 
  //await mysql("Book").update({ price: 66 }).where({ id }) 
  // 删 
  //await mysql("Book").del().where({ id }) 
  ctx.body = result[0];
  ctx.state.data = "success";
} 
