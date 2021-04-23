const app = getApp();
const CHINA = require('../../utils/china_city');
Page({
  data: {
    // StatusBar: app.globalData.StatusBar,
    // CustomBar: app.globalData.CustomBar,
    // Custom: app.globalData.Custom,
    // TabCur: 0,
    // MainCur: 0,
    // VerticalNavTop: 0,
    // list: [],
    // house_count:0,
    // base:CHINA.cites,
    load: true,
  },
  NavigetClick(res){
    var navigate = res.currentTarget.dataset.navigate;
    if(!navigate){
      return
    }
    wx.navigateTo({
      url: '/pages/web/web?navigate='+navigate
    })
  },
  GetAdvertiseDone(res){
    this.setData({
      advertises: res.data.data,
    })
  },
  onLoad() {
    app.wxshowloading('加载中...');
    this.setData({
        city:app.globalData.city
    })
    let that = this;
    app.WxHttpRequestGet('house/city_conf',{from_mini: true}, function (resp) {
        let data = resp.data;
        if(data.code === 200) {
            that.setData({
                city_list: data.data.city_list
            })
        }
    }, app.InterError)
    wx.hideLoading()
  },
  onReady() {
  },
  CityClick(e){
      var cityName = e.currentTarget.dataset.cityName;
      app.globalData.province = e.currentTarget.dataset.province;
      app.globalData.city = cityName;
      app.globalData.district = "";
      app.globalData.index_new_city = true;
      app.ShowToast('城市修改成功');
      var pre = app.getPrepage();
      pre.setData({
        new_city:true,
        houses:[],
        page:0,
        activekey: 'all',
        city:cityName,
        placeholder:cityName
      });
      setTimeout(function () {
          wx.navigateBack();
      },1500)
  },

  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },
  /**
   * @return {boolean}
   */
  // VerticalMain(e) {
  //   let that = this;
  //   let list = this.data.list;
  //   let tabHeight = 0;
  //   if (this.data.load) {
  //     for (let i = 0; i < list.length; i++) {
  //       let view = wx.createSelectorQuery().select("#main-" + list[i].id);
  //       view.fields({
  //         size: true
  //       }, data => {
  //         list[i].top = tabHeight;
  //         tabHeight = tabHeight + data.height;
  //         list[i].bottom = tabHeight;
  //       }).exec();
  //     }
  //     that.setData({
  //       load: false,
  //       list: list
  //     })
  //   }
  //   let scrollTop = e.detail.scrollTop + 20;
  //   for (let i = 0; i < list.length; i++) {
  //     if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
  //       that.setData({
  //         VerticalNavTop: (list[i].id - 1) * 50,
  //         TabCur: list[i].id
  //       })
  //       return false
  //     }
  //   }
  // }
})
