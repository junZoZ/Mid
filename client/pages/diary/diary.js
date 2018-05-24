// pages/diary/diary.js
const app = getApp()
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        hotDiaryList: [],
        diaryList: [],
        defaultImg: '/image/defaultImg.jpg'
    },

    /**
     * 跳转到新建游记页面
     */
    createDiary: function () {
        wx.navigateTo({
            url: '../diary_pre_create/diary_pre_create'
        })
    },

    /**
     * 跳转到游记详情页面
    */
    viewDiary: function (e) {
        var diary_id = e.target.dataset.diary_id;
        console.log('diary_id:' + diary_id);
        var param = 'diary_id=' + diary_id
        wx.navigateTo({
            url: '../diary_view/diary_view?'+param
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        /*var that = this;

        wx.request({
            url: config.service.getDiaryListUrl,
            data: {
                open_id: app.globalData.userInfo.openId
            },
            header: { 'content-type': 'application/json' },
            success: function (res) {
                console.log(res.data);
                that.data.diaryList = []; //清空

                //刷新视图层
                that.setData({
                    diaryList : res.data.diaryList
                })
            }
        })*/
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
        var that = this;

        wx.request({
            url: config.service.getDiaryList_hotUrl,
            data: {
                open_id: app.globalData.userInfo.openId
            },
            header: { 'content-type': 'application/json' },
            success: function (res) {
                console.log(res.data);
                that.data.hotDiaryList = []; //清空

                //刷新视图层
                that.setData({
                    hotDiaryList: res.data.hotDiaryList
                })
            }
        })

        wx.request({
            url: config.service.getDiaryListUrl,
            data: {
                open_id: app.globalData.userInfo.openId
            },
            header: { 'content-type': 'application/json' },
            success: function (res) {
                console.log(res.data);
                that.data.diaryList = []; //清空

                //刷新视图层
                that.setData({
                    diaryList: res.data.diaryList
                })
            }
        })
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