// pages/mypublish/mypublish.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  HandleClick(res){
    var houseid = res.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/detail/detail?house="+houseid
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.wxshowloading('数据加载中');
    app.WxHttpRequestGet('account/get_publish', {},this.GetPublishesDone, app.InterError);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  DeleteHouse(e){
    var that = this;
    var houseid = e.currentTarget.dataset.houseId;
    wx.showModal({
      title: '提示！',
      content: '确认删除房源吗？',
      success: function(res) {
        if (res.confirm) {
          app.WxHttpRequestPOST('house/house_delete', {houseid:houseid},function (res) {
            var data = res.data;
            if(data.code == 200){
              const index = e.currentTarget.dataset.index;
              that.data.houses[index].status = '2';
              that.setData({
                houses:that.data.houses
              })
              app.ShowToast('房源删除成功～')
            }else{
              app.ShowModel('错误', data.msg);
            }
          },app.InterError)
        }
      }
    })
  },
  RefrshHouse(e){
    var that = this;
    const houseid = e.currentTarget.dataset.houseId;
    wx.showModal({
      title: '使用确认',
      content: '顶帖消耗刷新次数 x1',
      success: function(res) {
        if (res.confirm) {
          app.WxHttpRequestPOST('house/house_refresh', {houseid:houseid},function (res) {
            var data = res.data;
            console.log(data)
            if(data.code === 200){
              const index = e.currentTarget.dataset.index;
              that.data.houses[index].create_time = '刚刚刷新';
              that.setData({
                houses:that.data.houses
              })
              app.ShowToast('顶帖成功');
            }else{
              app.ShowToast(data.msg);
              if(data.msg === '没有刷新次数了') {
                  that.showModal("DialogModal1")
              }
            }
          }, app.InterError);
        }
      }
    })
  },
  showModal(name) {
    this.setData({
      modalName: name
    })
  },
  hideModal(name){
    this.setData({
      modalName: ""
    })
  },
  EditHouse(e){
    wx.navigateTo({
      url: '/pages/edit-house/edit-house?id='+e.currentTarget.dataset.id,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },
  GetPublishesDone(res){
    this.setData({
      houses:res.data.data
    })
    wx.hideLoading()
  },
  toShare(e){
    this.onShareAppMessage(e)
  },
  onShareAppMessage: function (ops) {
    if(!ops.target){
      return
    }
    var dataset = ops.target.dataset;
    var title = dataset.title;
    var house_id = dataset.houseId;
      if (ops.from === 'button') {
      // 来自页面内转发按钮
        app.WxHttpRequestPOST('house/house_refresh_add', {},function (res) {
          app.ShowToast(res.data.msg)
        });
        this.hideModal();
        var arr = app.globalData.share_img_list;
        var imageurl = arr[Math.floor((Math.random()*arr.length))];
        return {
          title: title,
          path: '/pages/detail/detail?house='+house_id,
          imageUrl: imageurl, // 分享的封面图
        }
    }
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
})
