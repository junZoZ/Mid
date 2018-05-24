const { mysql } = require('../qcloud')

module.exports = async ctx => {

    var diary_id = ctx.query.diary_id

    result1 = await mysql("diary")
        .where('diary_id', diary_id)
        .increment('diary_browse_num', 1)

    result2 = await mysql("diary")
        .where('diary_id', diary_id)
        .increment('diary_hot', 1)

    ctx.body = {
        'result1': result1,
        'result2': result2
    };
    ctx.state.data = "success";
}
