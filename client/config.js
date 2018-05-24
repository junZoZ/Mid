/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://dusso03g.qcloud.la';

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 登录地址，用于建立会话
        loginUrl: `${host}/weapp/login`,

        // 测试的请求地址，用于测试会话
        requestUrl: `${host}/weapp/user`,

        // 测试的信道服务地址
        tunnelUrl: `${host}/weapp/tunnel`,

        // 上传图片接口
        uploadUrl: `${host}/weapp/upload`,

        //获取感想接口
        getthoughtUrl: `${host}/weapp/getthought`,

        //一个更高级的获取感想接口
        getthought_advUrl: `${host}/weapp/getthought_adv`,

        //获取附近的感想
        getthought_aroundUrl: `${host}/weapp/getthought_around`,

        getthought_timeUrl: `${host}/weapp/getthought_time`,

        //发布感想接口
        addthoughtUrl: `${host}/weapp/addthought`,

        //点赞感想接口
        votethoughtUrl: `${host}/weapp/votethought`,

        //获取poi详细信息接口
        getpoidetailUrl: `${host}/weapp/getpoidetail`,

        //新建游记接口
        addDiaryUrl: `${host}/weapp/addDiary`,

        //新建游记内容接口
        addDiaryNodeListUrl: `${host}/weapp/addDiaryNodeList`,

		//获取云厅消息接口
        getmessageUrl: `${host}/weapp/getmessage`,

        //发送云厅消息接口
        addmessageUrl: `${host}/weapp/addmessage`,

        //获取游记列表接口
        getDiaryListUrl: `${host}/weapp/getDiaryList`,

        //获取热门游记列表接口
        getDiaryList_hotUrl: `${host}/weapp/getDiaryList_hot`,

        //获取游记内容详情接口
        getDiaryDetailUrl: `${host}/weapp/getDiaryDetail`,

        //增加浏览量接口
        updateDiary_browseUrl: `${host}/weapp/updateDiary_browse`,

        //增加评论量接口
        updateDiary_commentUrl: `${host}/weapp/updateDiary_comment`,

        //增加点赞量接口
        updateDiary_voteUrl: `${host}/weapp/updateDiary_vote`,

        //获取点赞信息接口
        getDiaryVoteUrl: `${host}/weapp/getDiaryVote`,
        
        //发送评论接口
        addDiaryCommentUrl: `${host}/weapp/addDiaryComment`,

        //发送子评论接口
        addDiaryComment_childUrl: `${host}/weapp/addDiaryComment_child`,

        //获取评论接口
        getDiaryCommentListUrl: `${host}/weapp/getDiaryCommentList`
        
    }
};

module.exports = config;
