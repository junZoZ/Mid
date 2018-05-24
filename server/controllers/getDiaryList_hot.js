const { mysql } = require('../qcloud')

module.exports = async ctx => {

    var limitNum = 10;

    hotDiaryList = await mysql
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
        'diary_comment_num',
        'diary_hot'
        )
        .from('diary')
        .orderBy('diary_hot', 'desc')
        .limit(limitNum)

    ctx.body = {
        'hotDiaryList': hotDiaryList
    };
    ctx.state.data = "success";
}