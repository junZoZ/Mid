/* pages/message/message.js
** Author: Tanhao(541025737@qq.com)
** Function: 获取附近的消息，按时间先后排列
*/

var config = require('../../config')
const app = getApp()
var Distance =  require('../../utils/calcDist.js')
const mp3Recorder = wx.getRecorderManager()   
const mp3RecoderOptions = {
  duration: 50000,
  sampleRate: 44100,
  numberOfChannels: 1,
  encodeBitRate: 192000,
  format: 'mp3',
  frameSize: 50
}

//播放音频
const myaudio = wx.createInnerAudioContext(); 
// pages/chat/chat.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //消息数据
    message:{},
    reply:{},
    user_info:{},
    voiceImage:"/image/voice.png",
    //距离 km
    distance:5,

    //每次刷新获取的的条数
    item_count:7,
    //最近和最早的id，分页用
    latest_id:0,
    earliest_id:0,

    //位置信息 
    p_latitude:0,
    p_longitude:0,

    //当前消息id
    current_id:0,
    
    //窗口高度
    windowHeight:0,
    windowWidth:0,

    //用于控制输入框高度
    inputHeight:30,

    //用于保存用户编辑消息内容
    inputvalue:"",
    textvalue:"",

    isready:false,

    //语音相关
    keyboard: false,
    isSpeaking: false,
    speakerUrl: '/image/speaker0.png',
    speakerUrlPrefix: '/image/speaker',
    speakerUrlSuffix: '.png',
    timeSatrt: 0,
    timeEnd: 0,
    timeVoice: 0,
    voiceStaticImage:'/image/voice.png',
    voiceImage: '/image/voice.png',
  },
  //转换形态
  switchInputType: function () {
    this.setData({
      keyboard: !(this.data.keyboard),
    })
  },
  //语音放下和起来
  touchdown: function (e) {
    console.log("mp3Recorder.start with" + mp3RecoderOptions)
    var _this = this;
    this.speaking();
    this.setData({
      isSpeaking: true
    })
    mp3Recorder.start(mp3RecoderOptions);
  }, 
  touchup: function (e) {
    console.log("mp3Recorder.stop")
    this.setData({
      isSpeaking: false,
      speakerUrl: '/image/speaker0.png',
    })
    mp3Recorder.stop();
  },
  // 麦克风帧动画 
  speaking: function () {
    //话筒帧动画 
    var that=this;
    var i = 0;
    that.speakerInterval = setInterval(function () {
      i++;
      var s = i % 7;
      that.setData({
        speakerUrl: that.data.speakerUrlPrefix + s + that.data.speakerUrlSuffix,
      });
     // console.log("[Console log]:Speaker image changing...");
    }, 500);
  },

  //播放录音
  Sound: function (e) {
    var that = this
    myaudio.stop(); 
    var filePath = e.currentTarget.dataset.key; 
    var datatime = e.currentTarget.dataset.time; 

    //修改当前状态
    wx.request({
      url: config.service.Dynamic,
      data: {
        voiceFilePath: filePath,
        dynamic: '1',
      },
      header: { 'content-type': 'application/json' },
      success: function (result) {
        that.getInfo()
      }
    })
    wx.downloadFile({
      url: filePath, 
      success: function (res) {
        console.log('time1:  '+datatime)
        myaudio.src = res.tempFilePath
        myaudio.play(); 
        //console.log('time1:' + myaudio.duration)
        that.playing();

        setTimeout(function () {
          wx.showToast({
            title: '播放结束',
            icon: 'success',
          })
        }, datatime * 1000 ) //延迟时间
          },
        })
    //修改当前状态
    setTimeout(function () {
      wx.request({
        url: config.service.Dynamic,
        data: {
          voiceFilePath: filePath,
          dynamic: '0',
        },
        header: { 'content-type': 'application/json' },
        success: function (result) {
          that.getInfo()
        }
      })
     
    }, datatime*1000 + 100) //延迟时间

    },

  playing: function () {
    //播放帧动画 
    voiceImage: "/image/voice1"
    var that = this;
    var i = 4;
    that.speakerInterval = setInterval(function () {
      i++;
      var s = i % 3 + 1;
      that.setData({
        voiceImage: "/image/voice" + s + that.data.speakerUrlSuffix,
      });
    }, 600);
  },

  //作用：发送消息
  formSubmit:function(e){
    var that = this
    //1.先更新用户地理位置
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        //var p_latitude = res.latitude
        //var p_longitude = res.longitude
        //var speed = res.speed
        //var accuracy = res.accuracy
        //2.再发送上传消息请求
        wx.request({
          url: config.service.addmessageUrl,
          data: {
            content: e.detail.value.textarea,
            latitude: res.latitude,
            longitude: res.longitude,
            open_id: app.globalData.userInfo.openId
          },
          header: { 'content-type': 'application/json' },
          success: function (result) {
            console.log(result)
            that.setData({
              p_latitude: res.latitude,
              p_longitude: res.longitude,
              inputvalue:"",
              textvalue:"",
              inputHeight:30
            })
            that.onPullDownRefresh();
          }
        })

      }
    })
  },

  //作用:获取最新消息
  bindupper:function(e){

  },
  //作用:获取更早的消息
  bindlower:function(e){

  },


  bindFocus:function(e){
    console.log(e)
  },
  //由于按钮无法获取
  bindInput:function(e){
    this.setData({
      inputvalue:e.detail.value
    })
    //测试
    var res = wx.getSystemInfoSync()
    console.log(res)
  },

  //作用：行数变化时改变底部发送栏高度，最高不超过三行的高度
  bindLineChange:function(e){
    //console.log(e)
    if(e.detail.lineCount < 4){
      this.setData({
        inputHeight:e.detail.height
      })
    }
    //console.log(this.data.inputHeight)
  },

  //组装message,(计算一下距离、转化日期)
  createMessage: function(message,latitude,longitude){
    for (var index in message) {
      //计算距离
      var dist = Distance.calcDistance(message[index].m_latitude, message[index].m_longitude, latitude, longitude)
      if(dist < 1){
        dist*=1000;
        dist = dist+'m';
      }
      else{
        //bug处理:相同的两个点通过calcDistance计算出来的结果是NaN
        if(isNaN(dist)){
          dist = '0m'
        }
        else{
          dist = dist + 'km'
        }
      }
      message[index]['m_distant'] = dist

      //计算时间
      var time1 = new Date(message[index].m_datetime)   //曾经
      var time2 = new Date()   //当前

      var minite = (time2-time1)/1000/60 ; //分

      if(time1.getDate() == time2.getDate()){
        //日期相同
        if (minite < 1) {
          message[index].m_datetime = '刚刚'
        }
        else if (minite / 60 < 1) {
          //要注意这里取下界
          message[index].m_datetime = Math.floor(minite) + '分钟前'
        }
        else{
          //这里也取下界
          message[index].m_datetime = Math.floor(minite / 60) + '小时前'
        }
      }
      else{
        //日期不同，判断天
        if(minite/60/24<1){
          message[index].m_datetime = '昨天'
        }
        else if(minite/60/24<14){
          //两周内，要注意这里取上界
          message[index].m_datetime = Math.round(minite / 60 / 24) +'天前'
        }
        else{
          //超过两周直接显示日期(不显示时间)
          message[index].m_datetime = time1.toLocaleDateString();
        }
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //onLoad中为录音接口注册两个回调函数，主要是onStop，拿到录音mp3文件的文件名（不用在意文件后辍是.dat还是.mp3，后辍不决定音频格式）
    mp3Recorder.onStart(() => {
      this.data.timeSatrt = Date.parse(new Date()) 
      console.log('mp3Recorder.onStart()...')
    })
    mp3Recorder.onStop((res) => {
      this.data.timeEnd = Date.parse(new Date());  
      this.data.timeVoice = this.data.timeEnd - this.data.timeSatrt 
      this.data.timeVoice = this.data.timeVoice / 1000
      console.log('mp3Recorder.onStop() ' + res)
      const { tempFilePath } = res
    //  console.log('time:' + myaudio.src)
      console.log('mp3Recorder.onStop() tempFilePath:' + tempFilePath)

     var timeVoice = this.data.timeVoice
     console.log("time----" + timeVoice)
      // 1.先上传语音
      wx.uploadFile({
        url: config.service.uploadUrl,
        filePath: tempFilePath,
        name: 'file',
        success: function (res) {
          //util.showSuccess('上传语音成功')
          //2.进一步上传其他信息
          var res = JSON.parse(res.data)
          wx.getLocation({
            type: 'gcj02',
            success: function (res1) {
              console.log("ABCD " + res.data.imgUrl)
              wx.request({
                url: config.service.addvoiceMessageUrl,
                data: {
                  content: "voice",
                  voiceUrl: res.data.imgUrl,
                  latitude: res1.latitude,
                  voiceTime: timeVoice,
                  longitude: res1.longitude,
                  open_id: app.globalData.userInfo.openId
                },
                header: { 'content-type': 'application/json' },
                success: function (result) {
                  console.log(result)
                  that.setData({
                    p_latitude: res1.latitude,
                    p_longitude: res1.longitude,
                    inputvalue: "",
                    textvalue: "",
                    inputHeight: 30
                  })
                  that.onPullDownRefresh();
                } //request success
              })  //request
            }   //getlocation success
          })    //getlocation
        }    //upload success
      })     //upload
    })
    //..................

    this.getInfo()

  },

//刷新信息
  getInfo: function () {
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res_location) {
        wx.request({
          url: config.service.getmessageUrl,
          data: {
            open_id: app.globalData.userInfo.openId,
            la_low: res_location.latitude - that.data.distance / 111,
            lo_low: res_location.longitude - that.data.distance / 111,
            lo_high: res_location.longitude + that.data.distance / 111,
            la_high: res_location.latitude + that.data.distance / 111,
            item_count: that.data.item_count,
            page_type: "none"
          },
          header: { 'content-type': 'application/json' },
          success: function (res) {
            //console.log(res.data);

            var mymessage = res.data.res_message;
            that.createMessage(mymessage, res_location.latitude, res_location.longitude)

            var myreply = {};
            for (var item in res.data.res_reply) {
              if (myreply[res.data.res_reply[item].m_id] != null) {
                myreply[res.data.res_reply[item].m_id].push(res.data.res_reply[item])
              }
              else {
                myreply[res.data.res_reply[item].m_id] = [res.data.res_reply[item]]
              }
            }

            var myuser_info = {}
            for (var i in res.data.res_user_info) {
              var obj = JSON.parse(res.data.res_user_info[i].user_info)
              myuser_info[obj.openId] = obj
            }

            that.setData({
              p_latitude: res_location.latitude,
              p_longitude: res_location.longitude,
              message: mymessage,
              reply: myreply,
              user_info: myuser_info,
              latest_id: mymessage[0].m_id,
              earliest_id: mymessage[mymessage.length - 1].m_id,
            });
            console.log(that.data.message)
            console.log(that.data.reply)
            console.log(that.data.user_info)
          } //request success

        }) //wx.request

      } //getlocation success
    })  //wx.getLocation
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //测试
    var res = wx.getSystemInfoSync()
    console.log(res)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    wx.getSystemInfo({
        success:function(res){
          that.setData({
            windowHeight: res.windowHeight,
            windowWidth: res.windowWidth
          })
          console.log(res.windowHeight)
          console.log(res.windowWidth)
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
    console.log("up")
    var that = this;
    wx.request({
      url: config.service.getmessageUrl,
      data: {
        open_id: app.globalData.userInfo.openId,
la_low: that.data.p_latitude - that.data.distance / 111,
        lo_low: that.data.p_longitude - that.data.distance / 111,
        lo_high: that.data.p_longitude + that.data.distance / 111,
        la_high: that.data.p_latitude + that.data.distance / 111,
        item_count: that.data.item_count,
        page_type: "up",
        last_id: that.data.latest_id
      },
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res.data)
        //若获取消息数量小于item_count, 则将新消息与旧消息数组列表连接
        if(res.data.res_message.length < that.data.item_count){
          that.createMessage(res.data.res_message, that.data.p_latitude, that.data.p_longitude)
          that.data.message = res.data.res_message.concat(that.data.message)
          //更新评论字典
          for (var item in res.data.res_reply) {
            if (that.data.reply[res.data.res_reply[item].m_id] != null) {
              that.data.reply[res.data.res_reply[item].m_id].push(res.data.res_reply[item])
            }
            else {
              that.data.reply[res.data.res_reply[item].m_id] = [res.data.res_reply[item]]
            }
          }
          //更新用户信息字典
          for (var i in res.data.res_user_info) {
            var obj = JSON.parse(res.data.res_user_info[i].user_info)
            that.data.user_info[obj.openId] = obj
          }
          that.setData({
            message: that.data.message,
            reply: that.data.reply,
            user_info: that.data.user_info,
            latest_id: that.data.message[0].m_id
          });
        }
        else{
          //否则直接刷新
          var mymessage = res.data.res_message;
          that.createMessage(mymessage,that.data.p_latitude,that.data.p_longitude)

          var myreply = {};
          for (var item in res.data.res_reply) {
            if (myreply[res.data.res_reply[item].m_id] != null) {
              myreply[res.data.res_reply[item].m_id].push(res.data.res_reply[item])
            }
            else {
              myreply[res.data.res_reply[item].m_id] = [res.data.res_reply[item]]
            }
          }

          var myuser_info = {}
          for (var i in res.data.res_user_info) {
            var obj = JSON.parse(res.data.res_user_info[i].user_info)
            myuser_info[obj.openId] = obj
          }

          that.setData({
            message: mymessage,
            reply: myreply,
            user_info: myuser_info,
            latest_id: mymessage[0].m_id,
            earliest_id: mymessage[mymessage.length - 1].m_id
          });
        }
        wx.stopPullDownRefresh();
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("down")
    var that = this;
    wx.request({
      url: config.service.getmessageUrl,
      data: {
        open_id: app.globalData.userInfo.openId,
        la_low: that.data.p_latitude - that.data.distance / 111,
        lo_low: that.data.p_longitude - that.data.distance / 111,
        lo_high: that.data.p_longitude + that.data.distance / 111,
        la_high: that.data.p_latitude + that.data.distance / 111,
        item_count: that.data.item_count,
        page_type: "down",
        last_id:that.data.earliest_id
      },
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res.data)
        
        //将新消息与旧消息数组列表连接
        that.createMessage(res.data.res_message, that.data.p_latitude, that.data.p_longitude)
        that.data.message = that.data.message.concat(res.data.res_message);

        //将评论加入评论字典
        for (var item in res.data.res_reply) {
          if (that.data.reply[res.data.res_reply[item].m_id] != null) {
            that.data.reply[res.data.res_reply[item].m_id].push(res.data.res_reply[item])
          }
          else {
            that.data.reply[res.data.res_reply[item].m_id] = [res.data.res_reply[item]]
          }
        }
        
        //将新用户信息加入用户信息字典
        for (var i in res.data.res_user_info) {
          var obj = JSON.parse(res.data.res_user_info[i].user_info)
          that.data.user_info[obj.openId] = obj
        }

        that.setData({
          message: that.data.message,
          reply: that.data.reply,
          user_info: that.data.user_info,
          earliest_id: that.data.message[that.data.message.length - 1].m_id
        });
        
        console.log(that.data.message)
        console.log(that.data.reply)
        console.log(that.data.user_info)
        
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
