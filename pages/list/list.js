// pages/list/list.js
const app = getApp();
const CHINA = require('../../utils/china_city');
const house_type = {'0': '不限', '1': '整租', '2': '合租'};
const apartment = {
  '0': "不限",
  '1': "单间",
  '2': "一室一厅",
  '3': "两室一厅",
  '4': "三室一厅",
  '5': "四室一厅",
  '6': "五室一厅",
  '7': "其它",
};
Page({
  /**
   * 页面的初始数据
   */
  data: {
    type:'regions',
    last_type:'regions',
    // "SelectFormHeight":'100rpx',
    SelectForm:false,
    show_empty:false,
    selects:{},
    scrollHeight:0,
    animation:'',
    page: 1,
    topNum: 0,
    fiexed_top: 0,
    conditions:{},
    searchinput:"",
    houses:[],
    args:{},
    has_next: true,
    clear:false,
      //是否悬停
    region:{'text':'区域','active':false},
    subway:{'text':'地铁','active':false},
    choose_type:{'text':'整租 / 合租','active':false},
    money:{'text':'价格','active':false},
    house_type:{'text':'户型','active':false}
  },
  touchStart:function(){
    this.setData({
      SelectForm:false,
      search_list:[]
    })
  },
  RegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  ClearFilters(e){
    app.wxshowloading('拼命加载中...');
    this.setData({
      conditions:{},
      region:{'text':'区域','active':false},
      subway:{'text':'地铁','active':false},
      choose_type:{'text':'整租 / 合租','active':false},
      money:{'text':'价格','active':false},
      house_type:{'text':'户型','active':false},
      clear:!this.data.clear
    });
    var city = app.globalData.city
    var input = this.data.searchinput;
    this.setData({
      page:1,
      houses:[]
    });
    this.GoToTop()
    if(input){
      app.WxHttpRequestGet('house/search',{'title':input,
      'city':city},this.SearchCallback);
    }else{
      app.WxHttpRequestGet('house/search',{'city':city},this.SearchCallback, app.InterError);
    }
  },
  HandleSelectEvent: function(e) {
    app.wxshowloading('拼命加载中...');
    var data = e.detail;
    var conditions = this.data.conditions;
    conditions[data.key] = data.value;
    var value = {'text':data.value,'active':true};
    if (data.key === 'region'){
      conditions['region'] = value.text;
      this.setData({region : value , conditions:conditions})
    } else if(data.key === 'price'){
      var text = value.text;
      value.text = text[0]+ '-'+ text[1];
      conditions['price'] = text[0];
      conditions['end_price'] = text[1];
      this.setData({money :value,conditions:conditions })
    } else if(data.key === 'subway'){
        this.setData({subway :value,conditions:conditions })
    }
    else if(data.key === 'house_type'){
      value['text'] = house_type[value['text']];
      this.setData({choose_type : value,conditions:conditions })
    }else{
      value['text'] = apartment[value['text']];
      this.setData({house_type :value,conditions:conditions }) // aprtment
    }
    var input = this.data.searchinput;
    if(input){
      conditions['title'] = input;
    }
      conditions['city'] = app.globalData.city;
      this.setData({
        page:1,
        has_next:true,
        search_list:[],
        SelectForm:false,
        houses:[]
      });
    this.GoToTop()
    app.WxHttpRequestGet('house/search',conditions,this.SearchCallback, app.InterError);
  },
  GoToTop(e){
    this.setData({
      topNum: 0
    })
  },
  SearchCallback(res){
    var page = this.data.page + 1;
    var houses = res.data.houses;
    var houes_length = houses.length;
    var search_count = res.data.count;
    if(houes_length>0){
      this.setData({
        has_next:true,
        house_count: search_count,
        page: page,
        SelectForm:false,
        search_list:[],
        [`houses[${this.data.page}]`]: houses
      })
    }else{
        this.setData({
          has_next: false,
          show_empty:true,
          house_count: search_count
        })
    }
    wx.hideLoading()
  },
  handleClick: function(e){
    app.handlehouseClick(e.currentTarget.dataset.id)
  },
  SelectBtnClick: function (e){
    var that = this;
    var type = e.currentTarget.dataset['type'];
    var is_show = true;
    if(type === that.data.last_type){
      is_show = !that.data.SelectForm
    }
    that.setData({
      SelectForm: is_show, type: type, last_type:type
    })
  },
  AddressClick(e){
    var address = e.currentTarget.dataset.address;
    this.setData({
      searchinput: address
    })
    this.ChildInputValueHanle({'detail':address})
  },
  SearchList: function(e){
    var search_list = e.detail;
    this.setData({
      search_list:search_list
    })
  },
  ChildInputValueHanle:function(e) {
    var data = e.detail;
    app.wxshowloading('拼命加载中...');
    this.setData({
      searchinput:data
    });
    var conditions = this.data.conditions;
    conditions['city'] = app.globalData.city;
    conditions['title'] = data;
    this.setData({
      page:1,
      conditions:conditions,
      houses:[]
    });
    this.GoToTop()
    app.WxHttpRequestGet('house/search',conditions,this.SearchCallback, app.InterError);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  ParamsDone(res){
    var province = app.globalData.province;
    var city = app.globalData.city;
    var that = this;
    this.getcities(province,city).then(function (regions) {
      res.data['regions'] = regions;
      that.setData({
        regions: regions,
        selects: res.data
      })
    })
  },
  onLoad: function (options) {
    var that = this;
    let query = wx.createSelectorQuery();
    query.select('#filter_bar').boundingClientRect()
      query.exec(function (res) {
          var city = app.globalData.city;
          var height =  res[0].height;
          var condition = {'city':city};
          if(options.type){
            condition['house_type'] = options.type
          }
          that.setData({
            placeholder:city,
            fiexed_top:height + 10,
            scrollHeight: app.globalData.windowHeight+30,
            conditions:condition
          });
          app.wxshowloading('拼命加载中...');
          app.WxHttpRequestGet('house/search',condition,that.SearchCallback);
          app.WxHttpRequestGet('house/selects',{'city':city},that.ParamsDone, app.InterError)
      });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  getcities(pro,city){
    var cities = CHINA.cites;
    var province = cities[0];
    return new Promise(function (resolve, reject) {
      for(var k in province){
        if(province[k] === pro){
          var p = '0,'+ k;
          for(var i in cities[p]){
            if(cities[p][i] === city){
              var rcode = p + ',' + i;
              resolve(cities[rcode])
            }
          }
        }
      }
    })
  },
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
  bindscrolltolower:function(){
    var has_next = this.data.has_next;
    if (has_next) {
      app.wxshowloading('房源加载中');
      var page = this.data.page;
      var condition = this.data.conditions
      app.WxHttpRequestGet('house/search?page='+page, condition, this.SearchCallback, app.InterError)
    }else{
      app.ShowToast('没有更多了...')
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
