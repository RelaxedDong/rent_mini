// pages/mycollects/mycollects.js
// 我的收藏
const app = getApp();
const BASE = require('../../utils/basic');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    apartment: BASE.base.apartment,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.wxshowloading('');
    app.WxHttpRequestGet('account/get_collects', {},this.GetPublishesDone, app.InterError);
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
  GetPublishesDone(res){
    var curTime = new Date();
    var houses = res.data.data;
    for(var i =0;i<houses.length;i++){
      var house = houses[i];
      house.create_time = app.handlePublishTimeDesc(curTime, app.get_show_time(house.collect_time))
      house.last_user_login = app.handlePublishTimeDesc(curTime, app.get_show_time(house.last_login))
    }
    this.setData({
      houses:houses
    })
    wx.hideLoading()
  },
  HandleOperationDone(res){
    var data = res.data;
    if(data.code == 200){
      app.ShowToast('取消收藏成功');
      this.onLoad()
    }else{
      app.ShowToast('网络错误，请稍后再试～');
    }
  },
  CollectClick(e){
    var that = this;
    wx.showModal({
      title: '确认提示',
      content: '取消收藏吗？',
      success: function(res) {
        if (res.confirm) {
            var houseid = e.currentTarget.dataset.houseId;
            var request_data = {houseId:parseInt(houseid),operation_type:'collect'};
            app.WxHttpRequestPOST('account/operation',request_data,that.HandleOperationDone,app.InterError)
        }
      }
    })
  },
  HandleClick(res){
    var houseid = res.currentTarget.dataset.houseId;
    wx.navigateTo({
      url: "/pages/detail/detail?house="+houseid
    })
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
