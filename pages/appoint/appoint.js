// pages/appoint/appoint.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  make_call(e){
    app.makePhoneCall(e.currentTarget.dataset.phone);
  },
  Delete_appoint(e){
    var that = this;
    var id = e.currentTarget.dataset.appointId;
    if(!id){
      app.InterError();
      return
    }
    wx.showModal({
      title: '确认提示',
      content: '确认删除预约吗？',
      success: function(res) {
        if (res.confirm) {
          app.WxHttpRequestPOST('house/delete_appoint',{id:id}, that.DeleteAppoint, app.InterError)
        }
        }
      })
  },
  DeleteAppoint(res){
    app.ShowToast( res.data.msg);
    this.onShow()
  },
  GetAppointDone(res){
    var data = res.data
    if(data.code == 200){
      var appoints = data.data;
      var curTime = new Date();
      for(var i =0;i<appoints.length;i++){
        appoints[i].create_time = app.handlePublishTimeDesc(curTime, app.get_show_time(appoints[i].create_time))
      }
      this.setData({
        appoints: appoints
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
    app.WxHttpRequestGet('house/appoint',{}, this.GetAppointDone, app.InterError)
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