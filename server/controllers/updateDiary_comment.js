const { mysql } = require('../qcloud')

module.exports = async ctx => {

    var diary_id = ctx.query.diary_id

    result1 = await mysql("diary")
        .where('diary_id', diary_id)
        .increment('diary_comment_num', 1)

    result2 = await mysql
        .select(
        'diary_id',
        'diary_browse_num',
        'diary_vote_num',
        'diary_comment_num',
        'diary_hot'
        )
        .from('diary')
        .where('diary_id', diary_id)

    var diary_hot = result2[0].diary_browse_num + 3 * result2[0].diary_vote_num * result2[0].diary_vote_num
        + 5 * result2[0].diary_comment_num * result2[0].diary_comment_num;

    result3 = await mysql("diary")
        .update({ diary_hot: diary_hot })
        .where('diary_id', diary_id)

    ctx.body = {
        'result1': result1,
        'result2': result2,
        'result3': result3,
        'diary_hot': diary_hot
    };
    
    ctx.state.data = "success";
}
