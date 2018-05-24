const { mysql } = require('../qcloud')

module.exports = async ctx => {

    var diary_id = ctx.query.diary_id;
    var open_id = ctx.query.open_id;

    diaryvote = await mysql
        .select(
        'diary_id',
        'vote_time',
        'vote_type',
        'open_id'
        )
        .from('diaryVote')
        .where('open_id', open_id)
        .where('diary_id', diary_id)

    if (diaryvote.length > 0){
        result1 = await mysql('diaryVote')
            .where('open_id', open_id)
            .where('diary_id', diary_id)
            .del()

        result2 = await mysql("diary")
            .where('diary_id', diary_id)
            .decrement('diary_vote_num', 1)
    }
    else{
        var diaryVote = {
            diary_id: diary_id,
            open_id: open_id
        }
        result1 = await mysql('diaryVote')
            .insert(diaryVote)

        result2 = await mysql("diary")
            .where('diary_id', diary_id)
            .increment('diary_vote_num', 1)
        
    }

    result3 = await mysql
        .select(
        'diary_id',
        'diary_browse_num',
        'diary_vote_num',
        'diary_comment_num',
        'diary_hot'
        )
        .from('diary')
        .where('diary_id', diary_id)

    var diary_hot = result3[0].diary_browse_num + 3 * result3[0].diary_vote_num * result3[0].diary_vote_num
        + 5 * result3[0].diary_comment_num * result3[0].diary_comment_num;

    result4 = await mysql("diary")
        .update({ diary_hot: diary_hot })
        .where('diary_id', diary_id)
        
    ctx.body = {
        'result1': result1,
        'result2': result2,
        'result3': result3,
        'diary_hot': diary_hot,
        'result4': result4
    };
    ctx.state.data = "success";
}
