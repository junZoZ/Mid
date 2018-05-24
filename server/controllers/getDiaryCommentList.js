const { mysql } = require('../qcloud')

module.exports = async ctx => {

    var diary_id = ctx.query.diary_id

    diaryCommentList = await mysql('diaryComment')
        .join('cSessionInfo', 'diaryComment.open_id', '=','cSessionInfo.open_id')
        .select(
        'diaryComment.comment_id',
        'diaryComment.comment_content',
        'diaryComment.comment_time',
        'diaryComment.comment_father_id',
        'diaryComment.diary_id',
        'cSessionInfo.user_info'
        )
        .where('diaryComment.diary_id', diary_id)
        .orderBy('diaryComment.comment_time', 'desc')

    ctx.body = {
        'diaryCommentList': diaryCommentList
    };
    ctx.state.data = "success";
}