/*getthought_adv.js
**Author: Tanhao(541025737@qq.com)
**Function: 获取附近的thought： 最高赞的 * n条 + 最新的*m条
*/
const { mysql } = require('../qcloud')

module.exports = async ctx => {
  var open_id = ctx.query.open_id
  var la_low = ctx.query.la_low
  var lo_low = ctx.query.lo_low
  var lo_high = ctx.query.lo_high
  var la_high = ctx.query.la_high

  var n = Number(ctx.query.n)
  var m = Number(ctx.query.m)

  //两个Union的查询， 第一个是最高赞的，第二个是最新的
  result = await mysql.raw('(SELECT thought.*, user_info, (SELECT vote_type from tVote WHERE open_id = ? AND tVote.thought_id = thought.thought_id ) AS vote_type FROM thought, cSessionInfo WHERE thought.thought_latitude BETWEEN ? AND ? AND thought_longitude BETWEEN ? AND ? AND cSessionInfo.open_id = thought.open_id ORDER BY thought_upvote DESC LIMIT ?) UNION (SELECT thought.*, user_info, (SELECT vote_type from tVote WHERE open_id = ? AND tVote.thought_id = thought.thought_id ) FROM thought, cSessionInfo WHERE thought.thought_latitude BETWEEN ? AND ? AND thought_longitude BETWEEN ? AND ? AND cSessionInfo.open_id = thought.open_id ORDER BY thought_id DESC LIMIT ?)', [open_id, la_low, la_high, lo_low, lo_high, n ,open_id, la_low, la_high, lo_low, lo_high, m])

  ctx.body = result[0];
  ctx.state.data = "success";
} 
