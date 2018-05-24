/* pages/map_edit_select/map_edit_select.js
** Author: Tanhao(541025737@qq.com)
** Function: 选择附近POI
*/
var qqmap = require('../../qqmap/qqmap.js')
var amap = require('../../utils/amap.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    namemap:{
      'feeling':'地点',
      'restaurant':'餐厅',
      'hotel':'宾馆',
      'entertainment':'娱乐',
      'scenery':'景点'
    },
    poicodemap:{
      'feeling':'050000|060000|070000|080000|100000|110000|140000|150000|190000|990000',
      'restaurant': '050000',
      'hotel': '100000',
      'entertainment': '080000',
      'scenery': '110000'
    },
    poi_list:[],
    cur_page:1,
    page_size:20,
    //地点搜索输入框内容，是否有内容
    inputvalue:"",
    isinput:false
  },

  //带关键字的分类搜索，点评用
  searchgeo_keyword(la, lo, t, k, r, rule, off, p){
    var that = this
    var parm = {
      key: 'bbc7b4d77017a776555e3ca28b78b880',
      location: la + "," + lo,
      types: t,
      keywords:k,
      radius: r,
      sortrule: rule,
      offset: off,
      page: p
    }
    wx.request({
      url: 'https://restapi.amap.com/v3/place/around',
      data: parm,
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)

        //第一页则会清空poi_list,否则concat一下
        if(p==1){
          that.setData({
            poi_list: res.data.pois
          })
        }
        else{
          that.setData({
            poi_list: that.data.poi_list.concat(res.data.pois)
          })
        }
        //翻页
        that.data.cur_page += 1
      }
    })
  }
  ,
  // 分类搜索,点评用
  searchgeo: function(la,lo,t,r,rule,off,p){
    var that = this
    var parm = {
      key: 'bbc7b4d77017a776555e3ca28b78b880',
      location:la + "," + lo,
      types: t,
      radius: r,
      sortrule: rule,
      offset: off,
      page:p
    }
    wx.request({
      url: 'https://restapi.amap.com/v3/place/around',
      data: parm,
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        if(p==1){
          that.setData({
            poi_list: res.data.pois
          })
        }
        else{
          that.setData({
            poi_list: that.data.poi_list.concat(res.data.pois)
          })
        }
        
        //翻页
        that.data.cur_page += 1
      }
    })
  },

  cleartap:function(){
    var that = this
    //隐藏clear icon并清除文本文字
    that.setData({
      isinput: false,
      inputvalue:"",
    })
    //置为第一页
    that.data.cur_page = 1;
    //重新搜索（不带关键字）
    that.searchgeo(
      this.data.params.latitude, 
      this.data.params.longitude,
      that.data.poicodemap[this.data.params.keyword],
      2000,
      'distance',
      20,
      that.data.cur_page
    )
  },

  bindInput:function(e){
    var that = this
    //之前有内容，e发生时输入框为空
    if(that.data.isinput==true && e.detail.value == ""){
      ////隐藏clear icon
      this.setData({
        isinput:false
      })
      that.data.cur_page = 1;
      //重新搜索（不带关键字）
      that.searchgeo(
        this.data.params.latitude,
        this.data.params.longitude,
        that.data.poicodemap[this.data.params.keyword],
        2000,
        'distance',
        20,
        that.data.cur_page
      )
    }
    //之前没内容，e发生时有内容。这时显示clear icon
    if (that.data.isinput == false && e.detail.value != ""){
      this.setData({
        isinput: true,
      })
    }
  },

  //触发搜索，将清空之前的poi_list。
  bindInputConfirm:function(e){ 
    var that = this

    that.data.inputvalue=e.detail.value
    //将页面置为1,开始关键字搜索
    that.data.cur_page=1
    that.searchgeo_keyword(
      this.data.params.latitude,
      this.data.params.longitude,
      that.data.poicodemap[this.data.params.keyword],
      e.detail.value,
      2000,
      'distance',
      20,
      that.data.cur_page
    )
  },


  //点击一个poi后的事件
  itemtap:function(e){
    console.log(e)
    //设置缓存
    wx.setStorageSync('selected_poi', this.data.poi_list[e.currentTarget.id])
    //返回上级页面
    wx.navigateBack({
      delta:1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      params:options
    });

    that.data.cur_page = 1;
    that.searchgeo(
      that.data.params.latitude,
      that.data.params.longitude,
      that.data.poicodemap[that.data.params.keyword],
      2000,
      'distance',
      20,
      that.data.cur_page
    )
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
    //目前有几种翻页的情况，有带关键字的，有不带的，还有之后的逆地址转换
    //cur_page是在第一次触发时初始化，在函数里自增的，所以不用管
    //同样,poi_list也是根据页号判断是否重置或拼接
    

    //根据输入框来判断调用不同接口
    var that = this
    if (that.data.inputvalue==""){
      that.searchgeo(
        that.data.params.latitude,
        that.data.params.longitude,
        that.data.poicodemap[this.data.params.keyword],
        2000,
        'distance',
        20,
        that.data.cur_page
      )
    }
    else{
      that.searchgeo_keyword(
        that.data.params.latitude,
        that.data.params.longitude,
        that.data.poicodemap[this.data.params.keyword],
        that.data.inputvalue,
        2000,
        'distance',
        20,
        that.data.cur_page
      )
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})