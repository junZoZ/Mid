/*map.js
**Author：Tanhao(541025737@qq.com)
**Modified by Tanhao 2018.4.9  ---- 添加了获取感想模块
**Modified by Tanhao 2018.4.18 ---- 更改样式
**Modified by Tanhao 2018.4.22 ---- 优化了调用逻辑
**Modified by Tanhao 2018.4.25 ---- 修复了安卓端初次加载页面不显示marker的bug
*/

//config配置了URL请求路径
var config = require('../../config')
const app = getApp()
var qcloud = require('../../vendor/wafer2-client-sdk/index')

Page({
  data: {

    //map的高度，需要根据不同屏幕适配
    windowHeight: '0px',
    windowWidth: '0px',
    // 用于将px换算为rpx， windowWidth/750  （单位px/rpx）
    rpxtopx_ratio:0.0,
    

    //地理位置信息，与map组件数据绑定。 以下两个值无意义
    latitude:24.2627,
    longitude:118.0523,

    //地图缩放尺度,范围从5-18
    scale:16,
    
    //感想、标记
    thought:{},
    markers:[],
    
  },

  //当前区域变化
  regionchange(e) {
    //console.log(e.type)
    //地图当前区域变化会触发两次事件(开始和结束),e.type有{'begin','end'}两种类型
    var that = this;
    //只在区域变化结束时获取感想
    if(e.type=='end'){
      that.map.getRegion({
        success: function (res_region) {
          console.log(res_region)
          that.getThought(
            res_region.southwest.latitude, 
            res_region.northeast.latitude, 
            res_region.southwest.longitude, 
            res_region.northeast.longitude
          )
        }
      })
    }
  },


  //marker点击事件(marker点击出现的callout是map组件的属性)
  markertap(e) {
    //var user_nickName = JSON.parse(this.data.thought[e.markerId].user_info).nickName
    //console.log(user_nickName+":"+this.data.thought[e.markerId].thought_content)
  },

  //点击callout跳转到感想展示页面
  callouttap:function(e){
    var thought_info = this.data.thought[e.markerId]
    var user_info = JSON.parse(this.data.thought[e.markerId].user_info)
    
    //console.log(thought_info)
    var paramstr = ""
    paramstr += 'nickName=' + user_info.nickName + '&'
    paramstr += 'avatarUrl=' + user_info.avatarUrl + '&'
    paramstr += 'gender=' + user_info.gender + '&'
    paramstr +=  'thought_id=' + thought_info.thought_id+'&'
    paramstr +=  'thought_content=' + thought_info.thought_content + '&'
    paramstr += 'thought_imageurl=' + thought_info.thought_imageurl + '&'
    paramstr +=   'thought_latitude=' + thought_info.thought_latitude + '&'
    paramstr +=   'thought_longitude=' + thought_info.thought_longitude + '&'
    paramstr +=   'thought_location=' + thought_info.thought_location + '&'
    paramstr +=   'thought_type=' + thought_info.thought_type + '&'
    paramstr +=   'thought_datetime=' + thought_info.thought_datetime + '&'
    paramstr += 'thought_upvote=' + thought_info.thought_upvote + '&'
    paramstr += 'poi_id=' + thought_info.poi_id + '&'
    paramstr += 'vote_type=' + thought_info.vote_type

    //console.log(paramstr)
    wx.navigateTo({
      url: '/pages/map_show/map_show?'+paramstr,
    })
  },

  locationtap:function(e) {
    this.map.moveToLocation();
  },
  
  buttontap:function(){
    wx.navigateTo({
      url: '/pages/map_edit/map_edit',
    })
  },

  //组装marker
  createMarker: function (item) {
    let marker = {
      iconPath: "/image/"+item.thought_type+item.thought_sentiment+".png",
      id: item.thought_id || 0,
      latitude: item.thought_latitude,
      longitude: item.thought_longitude,
      title:"123",
      callout:{
        content:item.thought_content + "\n<点击查看详情>",
        fontSize:15,
        borderRadius:40,
        padding:25,
        display:'BYCLICK',
        textAlign:'center'
      },
    //  label: {
    //   content:"123条足迹",
    // },
      width: 50*this.data.rpxtopx_ratio,
      height: 50*this.data.rpxtopx_ratio
    }
    return marker;
  },
  
  //获取指定经纬度周围的感想（向后端发送请求）
  getThought: function (latitude_low,latitude_high,longitude_low,longitude_high) {
    var that = this;
    qcloud.request({
      url: config.service.getthought_advUrl,
      // n 和 m 可以调整
      data: {
        open_id: app.globalData.userInfo.openId,
        la_low: latitude_low,
        lo_low: longitude_low,
        lo_high: longitude_high,
        la_high: latitude_high,
        n:15,
        m:Math.floor(that.data.windowHeight/that.data.windowWidth * 15)
      },
      header: { 'content-type': 'application/json' },
      success: function (res) {
        //异步请求成功后的回调函数：此处应该setData，刷新视图层
        console.log(res.data);
        that.data.markers = []; //清空
        that.data.thought = {};
        for (let item of res.data) {
          let _marker = that.createMarker(item);
          that.data.markers.push(_marker);   //构建markers数组

          let thought_id = item.thought_id;
          that.data.thought[thought_id] = item;   //以thought_id为索引
        }
        //刷新视图层
        that.setData({
          markers: that.data.markers,
          thought: that.data.thought
        })
      }
    })
  },

  //------------------------------------------
  //以下为生命周期函数
  //监听页面加载事件
  onLoad: function (option) {
    console.log("map onload")
    //使用wx.createMapContext获取map上下文(this.map下的几个函数)
    this.map = wx.createMapContext('map')
  },
  
  //监听页面初次渲染完成
  onReady: function (e) {
    console.log("map onready")
    var that = this
    //回到当前定位位置
    //在此调用的原因：首次进入希望调用，但希望在map_show页面返回时不调用
    //this.map.moveToLocation()
    //更新：由于在手机端上述代码不会执行，则采用以下方法
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        //这里延迟500毫秒，以等待地图组件移至定位点
        setTimeout(function(){
          that.map.getRegion({
            success: function (res_region) {
              console.log(res_region)
              that.getThought(
                res_region.southwest.latitude,
                res_region.northeast.latitude,
                res_region.southwest.longitude,
                res_region.northeast.longitude
              )
            }
          })
        },500)
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("map onshow")
    var that = this; 
    
    //之所以在此设置屏幕宽高是因为适配安卓虚拟键的显示与隐藏
    //因为map组件无法通过100%来设置高度，所以必须获取屏幕长度并通过setData设置
    //又onshow在页面初次加载和跳转后都会被执行
    //虽然用户隐藏虚拟键后无法及时设置，但可以在切换页面返回后及时调整
    try {
      var res = wx.getSystemInfoSync()
      //设置controls在屏幕上的位置
      this.setData({
        windowHeight: res.windowHeight,
        windowWidth: res.windowWidth,
        rpxtopx_ratio:res.windowWidth/750
      })
      app.globalData.deviceInfo.windowHeight = res.windowHeight;
      app.globalData.deviceInfo.windowWidth = res.windowWidth;
    } catch (e) {
      console.log(e)
    }
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("map onhide")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("map onunload")
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("map onpulldownrefresh")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("map onreachbottom")
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log("map onshareappmessage")
  }
})

