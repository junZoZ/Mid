//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
//获取应用实例
const app = getApp()

Page({
  data: {
    button_enter: '进入程序',

    remind: '加载中',
    angle: 0,

    //登录相关
    userInfo: {},
    logged: false,
    takeSession: true,
    requestResult: '',

    //canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  //登录相关函数
  login: function () {
    if (this.data.logged) return

    //util.showBusy('正在登录')
    var that = this

    // 调用登录接口
    qcloud.login({
      success(result) {
        if (result) {
          //util.showSuccess('登录成功')
          that.setData({
            userInfo: result,
            logged: true
          })
          //将数据保存在全局
          app.globalData.userInfo = that.data.userInfo
          console.log(app.globalData.userInfo)
        } else {
          // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
          qcloud.request({
            url: config.service.requestUrl,
            login: true,
            success(result) {
              //util.showSuccess('登录成功')

              that.setData({
                userInfo: result.data.data,
                logged: true
              })
              //将数据保存在全局
              app.globalData.userInfo = that.data.userInfo
              console.log(app.globalData.userInfo)
            },

            fail(error) {
              //util.showModel('请求失败', error)
              console.log('request fail', error)
            }
          })
        }
      },

      fail(error) {
        //util.showModel('登录失败', error)
        console.log('登录失败', error)
      }
    })
  },

  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  goToIndex: function () {
    wx.switchTab({
      url: '/pages/map/map',
    })
  },

  bindGetUserInfo: function (e) {
    if (this.data.logged){
      wx.switchTab({
        url: '/pages/map/map',
      })
      return;
    }

    var that = this;
    var userInfo = e.detail.userInfo;

    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          that.login()
        } else {
          util.showModel('用户未授权', e.detail.errMsg);
        }
      }
    });

  },
  //生命周期函数--监听页面初次渲染完成
  onLoad: function () {
    var that = this;

    //UI相关控制代码
    wx.onAccelerometerChange(function (res) {
      var angle = -(res.x * 30).toFixed(1);
      if (angle > 14) { angle = 14; }
      else if (angle < -14) { angle = -14; }
      if (that.data.angle !== angle) {
        that.setData({
          angle: angle
        });
      }
    });
  }
  
})


