const { mysql } = require('../qcloud')

module.exports = async ctx => {
 
  var vote_type = ctx.query.vote_type

  //若vote_type=0,则点赞
  if(vote_type==0){
    var vote = {
      thought_id: ctx.query.thought_id,
      open_id: ctx.query.open_id,
      vote_type: 1
    }
    result = await mysql("tVote").insert(vote);
    if(result){
      //注意knexjs的用法
      await mysql("thought").where('thought_id','=',vote.thought_id).increment('thought_upvote',1)
    }
  }
  else{
    var vote = {
      thought_id: ctx.query.thought_id,
      open_id: ctx.query.open_id,
      vote_type: 0
    }
    //否则取消点赞
    result = await mysql("tVote").where('thought_id',vote.thought_id).where('open_id',vote.open_id).del();
    if (result) {
      await mysql("thought").where('thought_id', '=', vote.thought_id).decrement('thought_upvote', 1)
    }
  }
 
  // 增 
  //result = await mysql("thought").insert();
  // 查 
  //var res = await mysql("Book").where({ id }).first() 
  // 改 
  //await mysql("Book").update({ price: 66 }).where({ id }) 
  // 删 
  //await mysql("Book").del().where({ id }) 
  ctx.body = vote.vote_type;
  ctx.state.data = vote.vote_type;
} 
