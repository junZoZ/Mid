/*getthought_time.js
**Function: 依据开始和结束时间选择thought
*/
const { mysql } = require('../qcloud')

module.exports = async ctx => {
    var open_id = ctx.query.open_id
    var begindate = ctx.query.begindate
    var enddate = ctx.query.enddate

    result = await mysql
        .select(
            'thought_id', 
            'thought_content', 
            'thought_imageurl', 
            'thought_latitude',
            'thought_longitude',
            'thought_location',
            'thought_type',
            'thought_datetime',
            )
        .from("thought")
        .where('open_id', open_id)
        .whereBetween('thought_datetime', [begindate, enddate])

    ctx.body = result;
    ctx.state.data = "success";
} 
