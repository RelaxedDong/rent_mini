// pages/mycollects/mycollects.js
// 我的收藏
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        color_list: app.globalData.color_list,
        houses: [],
        has_next: true,
        page: 0,
        x: 0,
        currentX: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        app.wxshowloading('');
        this.setData({
            houses: []
        })
        wx.setNavigationBarTitle({title: app.globalData.my_page_title})
        app.WxHttpRequestGet('account/get_collects',
            {op_type: app.globalData.my_page_type, page: this.data.page},
            this.GetPublishesDone,
            app.InterError);
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
    GetPublishesDone(res) {
        var resp = res.data;
        if (resp.code === 200) {
            var page = this.data.page + 1;
            var houses = resp.data;
            let old_houses = this.data.houses;
            if (houses.length > 0) {
                for(let i =0;i<houses.length;i++){
                    var title = houses[i]['title'];
                    houses[i]['title'] = title.length > 10?title.substr(0,13)+'...':title
                }
                old_houses = old_houses.concat(houses)
                this.setData({
                    houses: old_houses,
                    page: page,
                    has_next: true
                })
            } else {
                this.setData({has_next: false})
            }
        }
        wx.hideLoading()
    },
    handleClick(res) {
        var houseid = res.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/pages/detail/detail?house=" + houseid
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
        var has_next = this.data.has_next;
        if(!has_next){
            app.ShowToast('没有更多了...')
        }
        app.WxHttpRequestGet('account/get_collects',
            {op_type: app.globalData.my_page_type, page: this.data.page},
            this.GetPublishesDone, app.InterError);
    },
  showDeleteButton: function (e) {
    let houseIndex = e.currentTarget.dataset.houseindex
    this.setXmove(houseIndex, -65)
  },
  hideDeleteButton: function (e) {
    let houseIndex = e.currentTarget.dataset.houseindex
    this.setXmove(houseIndex, 0)
  },
  handleMovableChange: function (e) {
    if (e.detail.source === 'friction') {
      if (e.detail.x < -30) {
        this.showDeleteButton(e)
      } else {
        this.hideDeleteButton(e)
      }
    } else if (e.detail.source === 'out-of-bounds' && e.detail.x === 0) {
      this.hideDeleteButton(e)
    }
  },
  /**
   * 删除产品
   */
  handleDeleteProduct: function ({ currentTarget: { dataset: { id } } }) {
      let that = this;
      wx.showModal({
          title: '提示！',
          content: '确认删除吗？',
          success: function (res) {
              if (res.confirm) {
                  app.WxHttpRequestPOST('account/collects_delete',{op_type: app.globalData.my_page_type, house_id: id},
                    function (res) {
                      let houses = that.data.houses
                      let houseIndex = houses.findIndex(item => item.id === id)
                      houses.splice(houseIndex, 1)
                      that.setData({houses})
                    }, app.InterError);
              }
          }
      })
  },
  setXmove: function (houseIndex, xmove) {
    let houses = this.data.houses
    houses[houseIndex].xmove = xmove
    this.setData({
      houses: houses
    })
  },
  /**
   * 处理touchstart事件
   */
  handleTouchStart(e) {
    this.startX = e.touches[0].pageX
  },

  /**
   * 处理touchend事件
   */
  handleTouchEnd(e) {
      console.log(e)
    if(e.changedTouches[0].pageX < this.startX && e.changedTouches[0].pageX - this.startX <= -30) {
      this.showDeleteButton(e)
    } else if(e.changedTouches[0].pageX > this.startX && e.changedTouches[0].pageX - this.startX < 30) {
      this.showDeleteButton(e)
    } else {
      this.hideDeleteButton(e)
    }
  },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
