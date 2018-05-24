// pages/diary_view/diary_view.js
const app = getApp()
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        is_voted: false,
        is_childen_comment:false,
        diary_id : '',
        diaryNodeList : [],
        nodes : [],
        diary : [],
        fatherComment: [],
        commentList: [],
        comment_content:'',
        childenComment_Content:''
    },

    /**
     * 点赞游记
     */
    voteDiary: function () {
        this.setData({
            is_voted: !this.data.is_voted
        })

        //更新点赞信息，包括游记的点赞量和热度、及插入和删除相关点赞表
        wx.request({
            url: config.service.updateDiary_voteUrl,
            data: {
                diary_id: this.data.diary_id,
                open_id: app.globalData.userInfo.openId
            },
            header: { 'content-type': 'application/json' },
            success: function (res) {
                console.log(res.data);
            }
        })

    },

    /**
     * 渲染游记
     */
    renderDiary: function () {
        var newChildren = []

        for (var i = 0; i < this.data.diaryNodeList.length; i++) {
            if (this.data.diaryNodeList[i].dn_type) {
                newChildren = newChildren.concat({
                    name: 'img',
                    attrs: {
                        src: this.data.diaryNodeList[i].dn_value,
                        width: '355rpx'
                    }
                })
            }
            else {
                newChildren = newChildren.concat({
                    type: 'text',
                    text: this.data.diaryNodeList[i].dn_value
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
                    text: this.data.diary[0].diary_title
                }]
            }, {
                name: 'hr'
            }, {
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
     * 获取评论
     */
    getDiaryComment: function () {
        var that = this;

        //获取评论
        wx.request({
            url: config.service.getDiaryCommentListUrl,
            data: {
                diary_id: this.data.diary_id
            },
            header: { 'content-type': 'application/json' },
            success: function (res) {
                console.log(res.data);

                var diaryCommentList = res.data.diaryCommentList;

                for (var i = 0; i < diaryCommentList.length; i++){
                    diaryCommentList[i].comment_time = new Date(diaryCommentList[i].comment_time).toLocaleDateString();
                    diaryCommentList[i].user_info = JSON.parse(diaryCommentList[i].user_info);
                    
                    for (var j = 0; j < diaryCommentList.length; j++){
                        if (diaryCommentList[i].comment_father_id == diaryCommentList[j].comment_id){
                            diaryCommentList[i].comment_father_id = j;
                            break;
                        }
                    }
                }

                that.setData({
                    commentList:res.data.diaryCommentList
                })
            }
        })

    },

    /**
     * 发表评论事件
     */
    insertText: function (options) {
        var comment_content = options.detail.value.textarea;

        var that = this;

        //发表评论
        wx.request({
            url: config.service.addDiaryCommentUrl,
            data: {
                comment_content: comment_content,
                diary_id: this.data.diary_id,
                open_id: app.globalData.userInfo.openId
            },
            header: { 'content-type': 'application/json' },
            success: function (res) {
                console.log(res.data);
                
                that.data.comment_content = '';

                //更新游记评论数和热度
                wx.request({
                    url: config.service.updateDiary_commentUrl,
                    data: {
                        diary_id: that.data.diary_id
                    },
                    header: { 'content-type': 'application/json' },
                    success: function (res) {
                        console.log(res.data);
                    }
                })
            }
        })

        this.getDiaryComment();
    },

    /**
     * 显示发表子评论事件
     */
    childrenComment: function (e) {
        console.log(e);
        
        this.setData({
            fatherComment: e.target.dataset.item,
            is_childen_comment : true
        })
    },

    /**
     * 子评论内容获取事件
     */
    setComment: function (e) {
        this.data.childenComment_Content = e.detail.value
    },

    /**
     * 取消发送子评论事件
     */
    cancelComment: function (options) {
        this.setData({
            is_childen_comment: false
        })
    },

    /**
     * 发表子评论事件
     */
    sendChildrenComment: function (options) {
        var that = this;

        //发表子评论
        wx.request({
            url: config.service.addDiaryComment_childUrl,
            data: {
                comment_content: this.data.childenComment_Content,
                comment_father_id: this.data.fatherComment.comment_id,
                diary_id: this.data.diary_id,
                open_id: app.globalData.userInfo.openId
            },
            header: { 'content-type': 'application/json' },
            success: function (res) {
                console.log(res.data);

                //更新游记评论数和热度
                wx.request({
                    url: config.service.updateDiary_commentUrl,
                    data: {
                        diary_id: that.data.diary_id
                    },
                    header: { 'content-type': 'application/json' },
                    success: function (res) {
                        console.log(res.data);
                    }
                })
            }
        })

        this.getDiaryComment();

        this.setData({
            is_childen_comment: false
        })
    },
    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //获取游记并显示
        this.data.diary_id = options.diary_id
        console.log(this.data.diary_id)
        console.log(this.data.commentList)

        var that = this;

        wx.request({
            url: config.service.getDiaryDetailUrl,
            data: {
                diary_id: this.data.diary_id
            },
            header: { 'content-type': 'application/json' },
            success: function (res) {
                console.log(res.data);
                that.data.diary = res.data.diary;
                that.data.diaryNodeList = res.data.diaryNodeList;

                that.renderDiary();
            }
        })

        //获取点赞信息
        wx.request({
            url: config.service.getDiaryVoteUrl,
            data: {
                diary_id: this.data.diary_id,
                open_id: app.globalData.userInfo.openId
            },
            header: { 'content-type': 'application/json' },
            success: function (res) {
                console.log(res.data);
                if(res.data.diaryvote.length > 0){
                    that.data.is_voted = true;
                }
                else{
                    that.data.is_voted = false;
                }
                that.setData({
                    is_voted: that.data.is_voted
                })
            }
        })

        //浏览量加1
        wx.request({
            url: config.service.updateDiary_browseUrl,
            data: {
                diary_id: this.data.diary_id
            },
            header: { 'content-type': 'application/json' },
            success: function (res) {
                console.log(res.data);
            }
        })

        this.getDiaryComment();
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