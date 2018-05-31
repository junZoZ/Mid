/*map_edit.js
**Author：Tanhao(541025737@qq.com)
**Modified by Tanhao 2018.4.19 ---- 更改了样式
*/
const app = getApp()
//config配置了URL请求路径
var config = require('../../config')
var qqmap = require('../../qqmap/qqmap.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    position_string:"",
    position_fault:"位置信息获取失败，请开启后重试。",
    p_latitude:0,
    p_longitude:0,
    //是否成功获取到用户位置信息
    is_success:false,
    //及时保存用户输入的感想
    textvalue:"",
    positive:"",
    sentiment:"",

    //类型选择
    radioItems: [
      { name: 'feeling', value: '想法' ,checked: true},
      { name: 'restaurant', value: '美食', checked: false },
      { name: 'scenery', value: '好景', checked: false},
      { name: 'hotel', value: "旅店", checked: false},
      { name: 'entertainment', value: "娱乐", checked: false}
    ],

    keyword:"feeling",
    
    //默认类型为想法，默认地点为空
    thought_type:"feeling",
    thought_location:"",

    //选择的图片链接
    image_url:"/image/camera.png",
    image_choosen:false

  },

  selecttap: function(){
    //跳转选择POI
    var paramstr = ""
    paramstr += 'latitude=' + this.data.p_latitude + '&'
    paramstr += 'longitude=' + this.data.p_longitude + '&'
    paramstr += 'keyword=' + this.data.keyword

    console.log(paramstr)
    wx.navigateTo({
      url: '/pages/map_edit_select/map_edit_select?' + paramstr,
    })
  },

  imagetap: function () {
    var that = this

    // 选择图片
    if(that.data.image_choosen){
      // 预览图片
      wx.previewImage({
        current: this.data.image_url,
        urls: [this.data.image_url]
      })
    }else{
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          //util.showBusy('正在上传')
          var filePath = res.tempFilePaths[0]
          that.setData({
            image_url: filePath,
            image_choosen:true
          })
        },
        fail: function (e) {
          console.error(e)
        }
      })
    }
  },



  radioChange:function(e){
    var that = this
    //归为false
    for (var i in that.data.radioItems) {
      that.data.radioItems[i].checked = false;
    }
    var index = Number(e.currentTarget.id)
    that.data.radioItems[index].checked = true;
    that.data.keyword = that.data.radioItems[index].name
    this.setData({
      radioItems:that.data.radioItems,
      thought_type:that.data.radioItems[index].name
    });
    //console.log(that.data.thought_type)
  },

  //每当用户键入就保存，因为确认发表不会使textarea失焦（亲测）
  bindInput: function(e){
    //保存用户键入
    this.data.textvalue = e.detail.value; 
    wx.setStorageSync("textvalue",this.data.textvalue)
  },
  //当textarea失焦时调用
  bindBlur: function (e) {
    //this.data.textvalue = e.detail.value;
    //console.log(e.detail.value+"Blur")
  },
  //和show-confirm-bar一起使用，这里没用
  bindConfirm: function (e) {
    //this.data.textvalue = e.detail.value;
    //console.log(e.detail.value+"confirm")
  },
  

  //重新获取定位
  locationtap:function(e){

  },

  //发布按下后操作
  confirmtap:function(e){
    //console.log(app.globalData.userInfo)

    var that = this

    //先获取情感分析数据再上传
    wx.request({
      url: 'https://aip.baidubce.com/rpc/2.0/nlp/v1/sentiment_classify?charset=UTF-8&access_token=24.aefb38332020af2e1833f78e0f67366e.2592000.1530270870.282335-11308922',
      data: {
        'text': that.data.textvalue
      },
      header: {
        'content-type': 'application/json', // 默认值
      },
      method: 'POST',
      success: function (res) {
        console.log('sentiment success------------')
        console.log(res.data)
        if (res.data.items != null) {
          that.setData({
            positive: res.data.items[0].positive_prob,
            sentiment: res.data.items[0].sentiment
          });
          //若选择了图片
          if (that.data.image_choosen) {
            // 1.先上传图片
            wx.uploadFile({
              url: config.service.uploadUrl,
              filePath: that.data.image_url,
              name: 'file',

              success: function (res) {
                //util.showSuccess('上传图片成功')
                //2.进一步上传其他信息
                var res = JSON.parse(res.data)

                if (that.data.selected_poi) {
                  wx.request({
                    url: config.service.addthoughtUrl,
                    data: {
                      content: that.data.textvalue,
                      positive: that.data.positive,
                      sentiment: that.data.sentiment,
                      latitude: that.data.p_latitude,
                      longitude: that.data.p_longitude,
                      type: that.data.thought_type,
                      location: that.data.thought_location,
                      imageurl: res.data.imgUrl,
                      open_id: app.globalData.userInfo.openId,
                      poi_id: that.data.selected_poi.id,
                      poi: that.data.selected_poi
                    },
                    header: { 'content-type': 'application/json' },
                    success: function (res) {
                      console.log(res)
                      //清空暂存数据:内容及位置
                      wx.removeStorage({
                        key: 'textvalue',
                        success: function (res) { },
                      })
                      wx.removeStorage({
                        key: 'selected_poi',
                        success: function (res) { },
                      })
                    }
                  })
                }
                else {
                  wx.request({
                    url: config.service.addthoughtUrl,
                    data: {
                      content: that.data.textvalue,
                      positive: that.data.positive,
                      sentiment: that.data.sentiment,
                      latitude: that.data.p_latitude,
                      longitude: that.data.p_longitude,
                      type: that.data.thought_type,
                      location: that.data.thought_location,
                      imageurl: res.data.imgUrl,
                      open_id: app.globalData.userInfo.openId,
                      //poi_id: null,
                      //poi: null
                    },
                    header: { 'content-type': 'application/json' },
                    success: function (res) {
                      console.log(res)
                      //清空暂存数据:内容及位置
                      wx.removeStorage({
                        key: 'textvalue',
                        success: function (res) { },
                      })
                      wx.removeStorage({
                        key: 'selected_poi',
                        success: function (res) { },
                      })
                    }
                  })
                }
              },

              fail: function (e) {
                util.showModel('上传图片失败')
              }
            })
          }
          else {
            if (that.data.selected_poi) {
              wx.request({
                url: config.service.addthoughtUrl,
                data: {
                  content: that.data.textvalue,
                  positive: that.data.positive,
                  sentiment: that.data.sentiment,
                  latitude: that.data.p_latitude,
                  longitude: that.data.p_longitude,
                  type: that.data.thought_type,
                  location: that.data.thought_location,
                  //imageurl: null,
                  open_id: app.globalData.userInfo.openId,
                  poi_id: that.data.selected_poi.id,
                  poi: that.data.selected_poi
                },
                header: { 'content-type': 'application/json' },
                success: function (res) {
                  console.log(res)
                  //清空暂存数据:内容及位置
                  wx.removeStorage({
                    key: 'textvalue',
                    success: function (res) { },
                  })
                  wx.removeStorage({
                    key: 'selected_poi',
                    success: function (res) { },
                  })
                }
              })
            }
            else {
              wx.request({
                url: config.service.addthoughtUrl,
                data: {
                  content: that.data.textvalue,
                  positive: that.data.positive,
                  sentiment: that.data.sentiment,
                  latitude: that.data.p_latitude,
                  longitude: that.data.p_longitude,
                  type: that.data.thought_type,
                  location: that.data.thought_location,
                  //imageurl: null,
                  open_id: app.globalData.userInfo.openId,
                  //poi_id: null,
                  //poi: null
                },
                header: { 'content-type': 'application/json' },
                success: function (res) {
                  console.log(res)
                  //清空暂存数据:内容及位置
                  wx.removeStorage({
                    key: 'textvalue',
                    success: function (res) { },
                  })
                  wx.removeStorage({
                    key: 'selected_poi',
                    success: function (res) { },
                  })
                }
              })
            }
          }
          wx.navigateBack({})
        }
      },
      fail: function (res) {
        console.log('sentiment fail------------')
        util.showModel('上传失败请重试')
        console.log(res.data)
      }
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("map_edit onload")
    console.log(options)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("map_edit onready")
    //获取上次用户键入数据
    var that = this
    this.data.textvalue = wx.getStorageSync('textvalue')
    this.setData({
      textvalue: this.data.textvalue
    })

    //获取定位信息
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        that.setData({
          is_success:true,
          p_latitude:res.latitude,
          p_longitude:res.longitude,
          position_string:res.longitude+"E "+res.latitude+"N"
        })

      },
      fail:function(){
        that.setData({
          is_success: false,
          p_latitude: 0,
          p_longitude: 0
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("map_edit onshow")

    //获取缓存的POI
    var poi = wx.getStorageSync('selected_poi')
    if(poi){
      this.data.selected_poi = poi;
      this.setData({
        thought_location:poi.name
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("map_edit onhide")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("map_edit onunload")
    wx.removeStorage({
      key: 'selected_poi',
      success: function (res) { },
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("map_edit onpulldownrefresh")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("map_edit onreachbottom")
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log("map_edit onshareappmessage")
  }
})