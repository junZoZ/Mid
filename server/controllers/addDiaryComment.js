const { mysql } = require('../qcloud')

module.exports = async ctx => {

    var diaryComment = {
        comment_content: ctx.query.comment_content,
        diary_id: ctx.query.diary_id,
        open_id: ctx.query.open_id
    }

    // 增 
    result = await mysql("diaryComment").insert(diaryComment);

    ctx.body = result;
    ctx.state.data = "success";
}
