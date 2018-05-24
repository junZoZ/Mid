const { mysql } = require('../qcloud')

module.exports = async ctx => {

    var diary_id = ctx.query.diary_id

    diary = await mysql
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
        .where('diary_id', diary_id)

    diaryNodeList = await mysql
        .select(
        'dn_order',
        'dn_type',
        'dn_value'
        )
        .from('diaryNode')
        .where('diary_id', diary_id)
        .orderBy('dn_order', 'asc')

    ctx.body = {
        'diary': diary,
        'diaryNodeList': diaryNodeList
    };
    ctx.state.data = "success";
}
