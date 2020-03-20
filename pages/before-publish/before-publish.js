// pages/before-publish/before-publish.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    choose_item: [
      {name:'房源转租',src:'/image/icon/publish-zhuanzu.png',type:'zhuanzu'},
      {name:'租房动态',src:'/image/icon/hot.png',type:'discuss'}
      ]
  },
  publish(e){
    var type = e.currentTarget.dataset.type;
    if(app.BinUserInfoCheck()){
        if(type === 'zhuanzu'){
          wx.navigateTo({
            url: '/pages/publish/publish'
          })
        }else{
          // wx.navigateTo({
          //   url: '/pages/publish-discuss/publish-discuss'
          // })
          app.ShowToast('敬请期待～');
        }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.wxshowloading('加载中...');
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideLoading()
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
