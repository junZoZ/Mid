const { mysql } = require('../qcloud')

module.exports = async ctx => {

    var open_id = ctx.query.open_id
    var diary_id = ctx.query.diary_id

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

    ctx.body = {
        'diaryvote': diaryvote
    };
    ctx.state.data = "success";
}