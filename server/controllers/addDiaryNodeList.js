const { mysql } = require('../qcloud')

module.exports = async ctx => {
    /*******
    这句话史前巨坑，client通过网络将请求发到server，也就是说，前台js的数组，是以json的形式发送。
    这里一般单个数据，好像会自动解析，但是数组却不会，需要手动转换一下，就是以下这句。
    JSON.parse(ctx.query.dn_type)
    *******/
    var dn_type = JSON.parse(ctx.query.dn_type)
    var dn_value = JSON.parse(ctx.query.dn_value)
    var diary_id = ctx.query.diary_id
    var diaryNodeList = []

    for (var i = 0; i < dn_type.length; i++) {
        diaryNodeList = diaryNodeList.concat({
            dn_order: i,
            dn_type: dn_type[i],
            dn_value: dn_value[i],
            diary_id: diary_id
        })
    }
    
    // 增 
    result = await mysql("diaryNode").insert(diaryNodeList);
    ctx.body = result;
    ctx.state.data = "success";
}
