const { mysql } = require('../qcloud')

module.exports = async ctx => {
  var thought = {
    thought_content: ctx.query.content,
    thought_positive: ctx.query.positive,
    thought_sentiment: ctx.query.sentiment,
    thought_latitude: ctx.query.latitude,
    thought_longitude: ctx.query.longitude,
    thought_imageurl: ctx.query.imageurl,
    thought_type: ctx.query.type,
    thought_location: ctx.query.location,
    poi_id: ctx.query.poi_id,
    open_id : ctx.query.open_id
  }
  var poi = {
    poi_id:ctx.query.poi_id,
    poi_info:ctx.query.poi
  }
  // 增 
  var result1 = await mysql("thought").insert(thought);
  var result2
  if(poi.poi_id!=null){
    try{
      result2 = await mysql("poi").insert(poi);
    }
    catch(e){
      result2 = e
    }
  }
  // 查 
  //var res = await mysql("Book").where({ id }).first() 
  // 改 
  //await mysql("Book").update({ price: 66 }).where({ id }) 
  // 删 
  //await mysql("Book").del().where({ id }) 
  ctx.body = [result1,result2];
  ctx.state.data = "success";
} 
