/*getthought_adv.js
**Author: Tanhao(541025737@qq.com)
**Function: 获取附近的thought： 最高赞的 * n条 + 最新的*m条
*/
const { mysql } = require('../qcloud')

module.exports = async ctx => {
  var poi_id = ctx.query.poi_id

  //查询该点poi信息
  result = await mysql.raw('SELECT poi_info FROM `poi` WHERE poi_id = ?', [poi_id])

  ctx.body = result;
  ctx.state.data = "success";
} 


