const { mysql } = require('../qcloud')

module.exports = async ctx => {
    var diary = {
        diary_title: ctx.query.diary_title,
        diary_abstract: ctx.query.diary_abstract,
        diary_imageurl: ctx.query.diary_imageurl,
        open_id: ctx.query.open_id
    }
    // 增 
    result = await mysql("diary").insert(diary);

    ctx.body = result;
    ctx.state.data = "success";
}
