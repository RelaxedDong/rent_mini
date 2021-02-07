// pages/mycollects/mycollects.js
// 我的收藏
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
        color_list: app.globalData.color_list
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
    this.setData({
      houses:res.data.data
    })
    wx.hideLoading()
  },
  handleClick(res){
    var houseid = res.currentTarget.dataset.id;
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
    this.onLoad()
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
