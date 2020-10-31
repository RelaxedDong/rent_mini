// pages/mypublish/mypublish.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  HandleClick(res){
    var houseid = res.currentTarget.dataset.houseId;
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
    const index = e.currentTarget.dataset.index;
    var house = this.data.houses[index];
    wx.navigateTo({
      url: '/pages/edit-house/edit-house',
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { data:  house})
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },
  GetPublishesDone(res){
    var curTime = new Date();
    var houses = res.data.data;
    this.setData({
      houses:houses
    })
    wx.hideLoading()
  },
  onShareAppMessage: function (ops) {
    var dataset = ops.target.dataset;
    var title = dataset.title;
    var house_id = dataset.houseId;
      if (ops.from === 'button') {
      // 来自页面内转发按钮
        app.WxHttpRequestPOST('house/house_refresh_add', {},function (res) {
          app.ShowToast('获得刷新次数 x 1')
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
