/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/weapp'
})
const controllers = require('../controllers')

// 从 sdk 中取出中间件
// 这里展示如何使用 Koa 中间件完成登录态的颁发与验证
const { auth: { authorizationMiddleware, validationMiddleware } } = require('../qcloud')

// --- 登录与授权 Demo --- //
// 登录接口
router.get('/login', authorizationMiddleware, controllers.login)
// 用户信息接口（可以用来验证登录态）
router.get('/user', validationMiddleware, controllers.user)

// --- 图片上传 Demo --- //
// 图片上传接口，小程序端可以直接将 url 填入 wx.uploadFile 中
router.post('/upload', controllers.upload)

// --- 信道服务接口 Demo --- //
// GET  用来响应请求信道地址的
router.get('/tunnel', controllers.tunnel.get)
// POST 用来处理信道传递过来的消息
router.post('/tunnel', controllers.tunnel.post)

// --- 客服消息接口 Demo --- //
// GET  用来响应小程序后台配置时发送的验证请求
router.get('/message', controllers.message.get)
// POST 用来处理微信转发过来的客服消息
router.post('/message', controllers.message.post)

router.get('/locate', controllers.locate)

router.get('/getthought', controllers.getthought)

router.get('/getthought_adv', controllers.getthought_adv)

router.get('/getthought_around', controllers.getthought_around)

router.get('/addthought', controllers.addthought)

router.get('/votethought', controllers.votethought)

router.get('/getpoidetail', controllers.getpoidetail)

router.get('/addDiary', controllers.addDiary)

router.get('/getmessage', controllers.getmessage)

router.get('/addmessage', controllers.addmessage)

router.get('/addvoiceMessage', controllers.addvoiceMessage)

router.get('/addDiaryNodeList', controllers.addDiaryNodeList)

router.get('/getDiaryList', controllers.getDiaryList)

router.get('/getDiaryList_hot', controllers.getDiaryList_hot)

router.get('/getDiaryDetail', controllers.getDiaryDetail)

router.get('/getthought_time', controllers.getthought_time)

router.get('/updateDiary_browse', controllers.updateDiary_browse)

router.get('/updateDiary_comment', controllers.updateDiary_comment)

router.get('/Dynamic', controllers.Dynamic)

router.get('/updateDiary_vote', controllers.updateDiary_vote)

router.get('/getDiaryVote', controllers.getDiaryVote)

router.get('/addDiaryComment', controllers.addDiaryComment)

router.get('/addDiaryComment_child', controllers.addDiaryComment_child)

router.get('/getDiaryCommentList', controllers.getDiaryCommentList)

module.exports = router
