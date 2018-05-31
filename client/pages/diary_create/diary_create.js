// pages/diary_create/diary_create.js
const app = getApp()
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        disabled_photo: false,
        disabled_text: false,
        is_preview: false,
        is_text: false,
        is_finish: false,
        listNum: 0, //viewList计数变量，目前没用
        viewList: [],   //用户插入的文本和图片
        nodes: [],  //预览游记时渲染富文本的数组
        thoughtList: [], //根据时间选择的感谢
        begindate: '',
        enddate: '',
        diary_title: ''
    },

    /**
     * 上传图片事件
     */
    uploadPhoto: function () {
        var that = this

        // 选择图片
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                util.showBusy('正在上传')
                var filePath = res.tempFilePaths[0]

                // 上传图片
                wx.uploadFile({
                    url: config.service.uploadUrl,
                    filePath: filePath,
                    name: 'file',

                    success: function (res) {
                       // util.showSuccess('上传图片成功')
                        console.log(res)
                        res = JSON.parse(res.data)
                        console.log(res)
                        that.setData({
                            imgUrl: res.data.imgUrl
                        })
                        that.insertPhoto(res.data.imgUrl)
                    },

                    fail: function (e) {
                        util.showModel('上传图片失败')
                    }
                })

            },
            fail: function (e) {
                console.error(e)
            }
        })
    },

    /**
     * 插入图片事件
     */
    insertPhoto: function (options) {

        var newList = [{
            is_photo: true,
            value: options
        }];

        var newNum = this.data.listNum + 1;

        this.setData({
            viewList: this.data.viewList.concat(newList),
            listNum: newNum
        })

        this.setData({
            disabled_text: false,
            is_text: false
        })

    },

    /**
     * 显示插入文字视图
    */
    showInsertText: function (options) {
        this.setData({
            disabled_text: true,
            is_text: true
        })
    },

    /**
     * 显示设置标题视图
    */
    goFinish: function (options) {
        this.setData({
            is_finish: true
        })
    },

    /**
     * 取消显示设置标题视图
    */
    cancelFinish: function (options) {
        this.setData({
            is_finish: false,
        })
    },

    /**
     * 获取标题输入
    */
    setTitle: function (e) {
        //console.log(e)
        this.data.diary_title = e.detail.value
    },

    /**
     * 插入文字事件
     */
    insertText: function (options) {

        var newList = [{
            is_photo : false,
            value: options.detail.value.textarea,
        }];

        var newNum = this.data.listNum + 1;

        this.setData({
            viewList: this.data.viewList.concat(newList),
            listNum: newNum
        })

        this.setData({
            disabled_text: false,
            is_text: false
        })
    },

    /**
     * 预览游记
     */
    primaryDiary: function(options) {
        var newChildren = []

        for (var i = 0; i < this.data.viewList.length; i++) {
            this.data.viewList[i].index
            if (this.data.viewList[i].is_photo) {
                newChildren = newChildren.concat({
                    name: 'img',
                    attrs: {
                        src: this.data.viewList[i].value,
                        width: '355rpx'
                    }
                })
            }
            else {
                newChildren = newChildren.concat({
                    type: 'text',
                    text: this.data.viewList[i].value
                }, {
                        name: 'br',
                    })

            }
        }

        this.setData({
            nodes: [{
                name: 'h1',
                attrs: {
                    class: 'div_class',
                    style: 'line-height: 60px; color: black;'
                },
                children: [{
                    type: "text",
                    text: this.data.diary_title
                }]
            },{
                name: 'hr'
            },{
                name: 'div',
                attrs: {
                    class: 'div_class',
                    style: 'line-height: 60px; color: black;'
                },
                children: newChildren
            }],
            is_preview: true
        })

    },

    /**
    *  上移
    */
    moveup: function (e) {
        
        var index = e.target.dataset.index;

        if (index>0){
            var t_view = this.data.viewList[index - 1];
            this.data.viewList[index - 1] = this.data.viewList[index];
            this.data.viewList[index] = t_view;

            this.setData({
                viewList: this.data.viewList
            });
        }
        
    },

    /**
    *  下移
    */
    movedown: function (e) {

        var index = e.target.dataset.index;

        if (index < this.data.viewList.length - 1) {
            var t_view = this.data.viewList[index + 1];
            this.data.viewList[index + 1] = this.data.viewList[index];
            this.data.viewList[index] = t_view;

            this.setData({
                viewList: this.data.viewList
            });
        }

    },
    
     /**
     *  删除
     */
    remove: function (e) {

        var index = e.target.dataset.index;
        
        this.data.viewList.splice(index, 1);
        
        this.setData({
            viewList : this.data.viewList
        });

    },

    /**
     * 返回继续编辑游记
     */
    goback: function (options){
        this.setData({
            is_preview: false,
            is_finish: false
        })
    },

    /**
     * 生成游记
     */
    createDiary: function (options) {

        var diary_abs = '';
        var diary_imgUrl = '';

        var dn_type_list = new Array(this.data.viewList.length);
        var dn_value_list = new Array(this.data.viewList.length);

        for (var i = 0; i < this.data.viewList.length; i++) {
            dn_type_list[i] = this.data.viewList[i].is_photo;
            dn_value_list[i] = this.data.viewList[i].value;
            if (this.data.viewList[i].is_photo && diary_imgUrl == ''){
                diary_imgUrl = this.data.viewList[i].value;
            }    
            if (!this.data.viewList[i].is_photo && diary_abs == '') {
                diary_abs = this.data.viewList[i].value;
            } 
        }
        
        var that = this;

        //创建游记
        wx.request({
            url: config.service.addDiaryUrl,
            data: {
                diary_title: that.data.diary_title,
                diary_abstract: diary_abs,
                diary_imageurl: diary_imgUrl,
                open_id: app.globalData.userInfo.openId
            },
            header: { 'content-type': 'application/json' },
            success: function (res) {
                console.log(res)

                //创建游记节点
                wx.request({
                    url: config.service.addDiaryNodeListUrl,
                    data: {
                        dn_type: dn_type_list,
                        dn_value: dn_value_list,
                        diary_id: res.data[0]
                    },
                    header: { 'content-type': 'application/json' },
                    success: function (res) {
                        console.log(res)
                        wx.switchTab({
                            url: '../diary/diary',
                        })
                    }
                })

            }
        })


    },

    /**
     * 选择背景音乐
     */
    selectMusic: function (options) {


    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.is_timepicker){
            this.data.begindate = options.begindate;
            this.data.enddate = options.enddate;

            var that = this;

            wx.request({
                url: config.service.getthought_timeUrl,
                data: {
                    open_id: app.globalData.userInfo.openId,
                    begindate: this.data.begindate,
                    enddate: this.data.enddate
                },
                header: { 'content-type': 'application/json' },
                success: function (res) {
                    console.log(res)

                    var newView = []
                    that.data.thoughtList = res.data;

                    for (var i = 0; i < that.data.thoughtList.length; i++) {
                        if (that.data.thoughtList[i].thought_imageurl) {
                            newView = newView.concat({
                                is_photo: true,
                                value: that.data.thoughtList[i].thought_imageurl
                            })
                        }
                        if (that.data.thoughtList[i].thought_content) {
                            newView = newView.concat({
                                is_photo: false,
                                value: that.data.thoughtList[i].thought_content
                            })
                        }
                    }

                    that.setData({
                        viewList: newView
                    })
                }
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