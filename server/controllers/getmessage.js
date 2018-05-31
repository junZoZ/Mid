const { mysql } = require('../qcloud')

module.exports = async ctx => {
  var open_id = ctx.query.open_id
  var la_low = ctx.query.la_low;
  var lo_low = ctx.query.lo_low;
  var lo_high = ctx.query.lo_high;
  var la_high = ctx.query.la_high

  //分页获取相关参数
  var last_id = ctx.query.last_id;
  var page_type = ctx.query.page_type;  //up、down、none
  var item_count = ctx.query.item_count;  //一次获取的数量

  //查找附近message
  //分页机制实现(前提 m_id 按时间顺序排列, 时间越近越大)：
  //1.向上拉获取最新信息 -- 分情况
  //1.1返回结果数量小于item_count,前端将其插入原数据集
  //1.2返回结果数量等于item_count,前端将抛弃原数据集(直接替换)
  //2.向下拉获取历史消息 -- 直接插入
  if(page_type == "none"){
    res_message = await mysql
      .select(
      'm_id',
      'm_content',
      'm_latitude',
      'm_longitude',
      'm_datetime',
      'm_voiceUrl',
      'm_voiceTime',
      'dynamic',
      'open_id'
      //'user_info
      )
      .from("message")
      .whereBetween('m_latitude', [la_low, la_high])
      .whereBetween('m_longitude', [lo_low, lo_high])
      .orderBy('m_id','desc')
      .limit(item_count)
    // .innerJoin('cSessionInfo', 'message.open_id', 'cSessionInfo.open_id')
  }
  else if(page_type == "up"){
    //向上翻代表更新
    res_message = await mysql
      .select(
      'm_id',
      'm_content',
      'm_latitude',
      'm_longitude',
      'm_datetime',
      'm_voiceUrl',
      'm_voiceTime',
      'dynamic',
      'open_id'
      )
      .from("message")
      .where('m_id','>',last_id)
      .whereBetween('m_latitude', [la_low, la_high])
      .whereBetween('m_longitude', [lo_low, lo_high])
      .orderBy('m_id', 'desc')
      .limit(item_count)
  }
  else if(page_type == "down"){
    //向下翻代表查询历史信息
    res_message = await mysql
      .select(
      'm_id',
      'm_content',
      'm_latitude',
      'm_longitude',
      'm_datetime',
      'm_voiceUrl',
      'm_voiceTime',
      'dynamic',
      'open_id'
      )
      .from("message")
      .where('m_id','<',last_id)
      .whereBetween('m_latitude', [la_low, la_high])
      .whereBetween('m_longitude', [lo_low, lo_high])
      .orderBy('m_id', 'desc')
      .limit(item_count)
  }


  //查找所涉及到的回复记录
  var m_idlist = [];
  for(item in res_message){
    m_idlist.push(res_message[item].m_id)
  }
  res_reply = await mysql
    .select(
      'mr_id',
      'mr_content',
      'm_id',
      'open_id'
      //'user_info'
    )
    .from('mReply')
    .whereIn('m_id', m_idlist)
   // .innerJoin('cSessionInfo', 'mReply.open_id', 'cSessionInfo.open_id')
  var idlist = [];
  for (item in res_message) {
    idlist.push(res_message[item].open_id)
  }
  for (item in res_reply) {
    idlist.push(res_reply[item].open_id)
  }
  //查找所涉及的用户信息
  res_user_info = await mysql
    .select(
    'user_info'
    )
    .from('cSessionInfo')
    .whereIn('open_id', idlist)



  //保留open_id，将需要用的用户信息写在map里
  // var idmap = {};
  // for(i in res_message){
  //   res_message[i].user_info = JSON.parse(res_message[i].user_info)
  //   idmap[res_message[i].user_info.openId] = {
  //     'nickName': res_message[i].user_info.nickName,
  //     'avatarUrl': res_message[i].user_info.avatarUrl,
  //   }
  //   res_message[i]['open_id'] = res_message[i].user_info.openId
  //   delete res_message[i].user_info
  // }

  // for (i in res_reply) {
  //   res_reply[i].user_info = JSON.parse(res_reply[i].user_info)
  //   idmap[res_reply[i].user_info.openId]={
  //     'nickName': res_reply[i].user_info.nickName,
  //     'avatarUrl': res_reply[i].user_info.avatarUrl,
  //   }
  //   res_reply[i]['open_id'] = res_reply[i].user_info.openId;
  //   delete res_reply[i].user_info
  // }

  ctx.body = {
    'res_message':res_message,
    'res_reply':res_reply,
    'res_user_info':res_user_info
  };
  ctx.state.data = "success";
}