// pages/my-discuss/my.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    discusses: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.wxshowloading('数据加载中');
    app.WxHttpRequestGet('account/my_discuss', {},this.GetDiscussesDone, app.InterError);
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
  GetDiscussesDone(res){
    var discusses = res.data.data;
    var curTime = new Date()
    this.setData({
      discusses:discusses
    })
    wx.hideLoading()
  },
  ToDiscussDetail(res){
    wx.navigateTo({
      url:"/pages/discuss-detail/discuss-detail?discuss_id="+res.currentTarget.dataset.discussid
    })
  },
  DeleteDone(res){
    var data = res.data
    if(data.code == 200){
      app.globalData.discuss_new_city = true;
      this.onLoad()
    }else{
      app.ShowToast(data.msg)
    }
  },
  DeleteClick(e){
    var that = this;
    wx.showModal({
      title: '确认提示',
      content: '确实删除该动态？',
      success: function(res) {
        if (res.confirm) {
          var discussid = e.currentTarget.dataset.discussId;
          var request_data = {discussid:parseInt(discussid)};
          app.WxHttpRequestPOST('account/my_discuss',request_data,that.DeleteDone,app.InterError)
        }
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
