// pages/diary_pre_create.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        is_timepicker: false,
        begindate: '',
        enddate: '',
    },

    /**
     * 完成时间选择，自动选择相应感想
    */
    finishTimePicker: function (e) {
        this.data.is_timepicker = true;
        var param = 'is_timepicker=' + this.data.is_timepicker + '&';
        param += 'begindate=' + this.data.begindate + '&';
        param += 'enddate=' + this.data.enddate;
        wx.navigateTo({
            url: '../diary_create/diary_create?' + param
        })
    },

    /**
     * 不进行时间选择，直接编辑游记
    */
    cancelTimePicker: function (e) {
        var param = 'is_timepicker=' + is_timepicker
        wx.navigateTo({
            url: '../diary_create/diary_create?' + param
        })
    },

    /**
     * 时间选择器_开始时间
     */
    beginDateChange: function (e) {
        console.log('begin_picker发送选择改变，携带值为', e.detail.value)
        var begindate = new Date(e.detail.value)
        this.setData({
            begindate: begindate.toLocaleDateString()
        })
    },

    /**
     * 时间选择器_结束时间
     */
    endDateChange: function (e) {
        console.log('end_picker发送选择改变，携带值为', e.detail.value)
        var enddate = new Date(e.detail.value)
        this.setData({
            enddate: enddate.toLocaleDateString()
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var day7 = new Date();
        var today = new Date();
        day7.setDate(day7.getDate() - 7);

        this.setData({
            begindate: day7.toLocaleDateString(),
            enddate: today.toLocaleDateString()
        })
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