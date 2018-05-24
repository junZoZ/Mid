/* pages/map_show/map_show.js
** Author: Tanhao(541025737@qq.com)
** Function: 显示地图
*/

var config = require('../../config')
const app = getApp()
var qcloud = require('../../vendor/wafer2-client-sdk/index')
// pages/map_show/map_show.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //保存从上级页面传来的参数
    params : {},
    //喜欢 标识
    is_like:0,

    //附近地点列表
    around_list:[]
  },

  poitap:function(e){
    var that = this
    console.log(that.data.params.poi_id)
    if (that.data.params.poi_id){
      wx.request({
        url: config.service.getpoidetailUrl,
        data: {
          poi_id: that.data.params.poi_id
        },
        header: { 'content-type': 'application/json' },
        success: function (res) {
          console.log(res.data[0][0].poi_info)
          var poi_info = JSON.parse(res.data[0][0].poi_info)
          var location = poi_info.location.split(',')
          location[0] = Number(location[0])
          location[1] = Number(location[1])
          wx.openLocation({
            latitude: location[1] ,
            longitude: location[0] ,
            scale: 28,
            name: poi_info.name,
            address: poi_info.address,
            success: function (e) {
              console.log("success")
            }
          })
        }
      })
    }
  },

  itemtap:function(e){
    console.log(e.currentTarget.id)
    //跳转
    var thought_info = this.data.around_list[e.currentTarget.id]
    var user_info = JSON.parse(this.data.around_list[e.currentTarget.id].user_info)

    //console.log(thought_info)
    var paramstr = ""
    paramstr += 'nickName=' + user_info.nickName + '&'
    paramstr += 'avatarUrl=' + user_info.avatarUrl + '&'
    paramstr += 'gender=' + user_info.gender + '&'
    paramstr += 'thought_id=' + thought_info.thought_id + '&'
    paramstr += 'thought_content=' + thought_info.thought_content + '&'
    paramstr += 'thought_imageurl=' + thought_info.thought_imageurl + '&'
    paramstr += 'thought_latitude=' + thought_info.thought_latitude + '&'
    paramstr += 'thought_longitude=' + thought_info.thought_longitude + '&'
    paramstr += 'thought_location=' + thought_info.thought_location + '&'
    paramstr += 'thought_type=' + thought_info.thought_type + '&'
    paramstr += 'thought_datetime=' + thought_info.thought_datetime + '&'
    paramstr += 'thought_upvote=' + thought_info.thought_upvote + '&'
    paramstr += 'poi_id=' + thought_info.poi_id + '&'
    paramstr += 'vote_type=' + thought_info.vote_type

    //这里用redirectTo, 关闭当前页面
    wx.redirectTo({
      url: '/pages/map_show/map_show?' + paramstr,
    })
  },

  votetap:function(){
    var that = this
    wx.request({
      url: config.service.votethoughtUrl,
      data:{
        thought_id:that.data.params.thought_id,
        open_id: app.globalData.userInfo.openId,
        vote_type: that.data.is_like
      },
      header: { 'content-type': 'application/json' },
      success:function(res){
        console.log(res)
        that.setData({
          is_like: (!that.data.is_like)?1:0
        })
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options)
    var dt = new Date(options.thought_datetime)
    var datestr = dt.toLocaleString()
    options.thought_datetime = datestr;
    //console.log(datestr)

    //获取附近的thought
    wx.request({
      url: config.service.getthought_aroundUrl,
      // n 和 m 可以调整
      data: {
        open_id: app.globalData.userInfo.openId,
        la_low: Number(options.thought_latitude) - 0.01,
        la_high: Number(options.thought_latitude) +  0.01,
        lo_low: Number(options.thought_longitude) -  0.01,
        lo_high: Number(options.thought_longitude) +  0.01,
        n: 5,
        m: 5
      },
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res);
        
        for(var index in res.data){
          res.data[index]['thought_brief'] = res.data[index].thought_content.substring(0,10)
        }

        that.setData({
          around_list : res.data
        })
      },
      fail:function(res){
        console.log(res);
      }
    })

    if(options.vote_type == 1 ){
      this.setData({
        params: options,
        is_like:1
      })
    }
    else{
      this.setData({
        params: options
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})