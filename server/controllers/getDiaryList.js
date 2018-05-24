const { mysql } = require('../qcloud')

module.exports = async ctx => {
    
    var open_id = ctx.query.open_id

    diaryList = await mysql
        .select(
        'diary_id',
        'diary_title',
        'diary_abstract',
        'diary_imageurl',
        'diary_music',
        'diary_style',
        'diary_location',
        'diary_datetime',
        'diary_browse_num',
        'diary_vote_num',
        'diary_comment_num'
        )
        .from('diary')
        .where('open_id', open_id)
        .orderBy('diary_datetime', 'desc')

    ctx.body = {
        'openid': open_id,
        'diaryList': diaryList
    };
    ctx.state.data = "success";
}