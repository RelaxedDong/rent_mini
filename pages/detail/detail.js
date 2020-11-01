const app = getApp();
Page({
  data: {
    gridCol: 12,
    favor_counts: 0,
    collect_counts: 0,
    skin: false,
    facilities: [],
    house: [],
    is_favor: false,
    is_collect: false,
    choose_time:"",
    has_show_appoint: false,
    weekday:["星期日","星期一","星期二","星期三","星期四","星期五","星期六"]
  },
  bindinput(e){
    var content = e.detail.detail.value;
    this.setData({
      content:content
    })
  },
  radioChange(e){
    this.setData({
      choose_time:e.detail.value
    })
  },
  appointDone(res){
    app.ShowToast(res.data.msg);
    this.hideModal()
  },
  makePhoneCall(e){
    app.makePhoneCall(e.currentTarget.dataset.phone);
  },
  ShureAppointment(e){
    var that = this;
    var choose = this.data.choose_time;
    var house_user_id = e.currentTarget.dataset.houseUserId;
    wx.showModal({
          title: '预约确认',
          content: '确认在'+ choose +'预约看房吗 ？',
          success: function(res) {
            if(res.confirm){
              app.WxHttpRequestPOST('house/appoint',{house_user_id:house_user_id,desc:choose},that.appointDone,
                  app.InterError)
            }
          }
        }
    )
  },
  click_check(){
    let now = new Date();
    let hour = now.getHours();
    return !(hour < 8 || hour > 22);
  },
  /**
   * @return {boolean}
   */
  Wechat(e){
    let can_operation = this.click_check();
    if(!can_operation){
      app.ShowToast('8点后才能进行操作哦~');
      return
    }
    if(!app.globalData.user_id){
      this.ShowToast("请先完成授权");
      return false
    }
    wx.setClipboardData({
      data: e.currentTarget.dataset.wechat,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            app.ShowModel('可自行联系啦～（^ - ^）',
              '好友添加请注明：乐直租～'
              );
          }
        })
      }
    })
  },
  Showmap(e){
    console.log(e)
    var dataset = e.currentTarget.dataset;
    var latitude = dataset.houseLatitude;
    var longitude = dataset.houseLongitude;
    wx.openLocation({
      longitude: Number(longitude),
      latitude: Number(latitude),
      scale: 15, // 缩放比例
      fail(res) {
        console.log(res)
      }
    })
  },
  OperationClick (e){
    var dataset = e.currentTarget.dataset;
    var houseId = dataset.houseId;
    if(!houseId){
      app.ShowToast('房源不存在')
    }
    var type = dataset.type;
    if(type === 'favor') {
      this.setData({
        is_favor:!this.data.is_favor
      })
    }else{
      this.setData({
        is_collect:!this.data.is_collect
      });
    }
    var request_data = {houseId:parseInt(houseId),operation_type:type}
    app.WxHttpRequestPOST('account/operation',request_data,this.HandleOperationDone)
  },
  HandleOperationDone(res){
    var type = res.data.data;
    var favor_counts = this.data.favor_counts;
    var collect_counts = this.data.collect_counts;
    if(type === 'favor'){
      favor_counts += 1
    }
    if(type === 'unfavor'){
      favor_counts -= 1
    }
    if(type === 'collect'){
      collect_counts +=1
    }
    if(type === 'uncollect'){
      collect_counts -=1
    }
    this.setData({
      favor_counts:favor_counts,
      collect_counts:collect_counts,
    })
  },
  make_call(e){
    let can_operation = this.click_check();
    if(!can_operation){
      app.ShowToast('8点后才能进行操作哦~');
      return
    }
    if(!app.globalData.user_id){
      this.ShowToast("请先完成授权");
      return false
    }
    app.makePhoneCall(e.currentTarget.dataset.phone);
  },
  HandleImgClick (e) {
    var dataset = e.target.dataset;
    var urls = dataset['urls'];
    var current = dataset['currenturl'];
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  swiperchange: function (detail) {
    if (detail.detail.source == "touch") {
      //当页面卡死的时候，current的值会变成0
      if(detail.detail.current == 0){
        //有时候这算是正常情况，所以暂定连续出现3次就是卡了
        let swiperError = this.data.swiperError;
        swiperError += 1;
        this.setData({swiperError: swiperError });
        if (swiperError >= 3) { //在开关被触发3次以上
          this.setData({ currentIndex: this.data.preIndex });//，重置current为正确索引
          this.setData({swiperError: 0})
        }
      }else {//正常轮播时，记录正确页码索引
        this.setData({ preIndex: detail.detail.current });
        //将开关重置为0
        this.setData({swiperError: 0})
      }
    }
  },
  showModal(e) {
    if(!app.globalData.finish_user_info){
      app.ShowToast("请先完成资料后预约");
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/userinfo/userinfo'
        });
      },1500);
      return
    }
    if (!this.data.has_show_appoint) {
      var dates = [];
      var datestr;
      var myDate = new Date();
      var weekday = this.data.weekday;
      myDate.setTime(myDate.getTime() + 1000 * 60 * 60 * 24);
      for (var i = 0; i < 6; i++) {
        var myddy = myDate.getDay();
        datestr = Number(myDate.getMonth()) + 1 + "-" + myDate.getDate();
        dates.push({day: datestr, myddy: weekday[myddy]});
        myDate.setTime(myDate.getTime() + 1000 * 60 * 60 * 24);
      }
      this.setData({
        modalName: e.currentTarget.dataset.target,
        appointment_time: dates,
        has_show_appoint:true
      })
    }else{
      this.setData({
        modalName: e.currentTarget.dataset.target,
      })
    }
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  HandleGetDone(res){
    const that = this;
    var resp = res.data;
    if (resp.code === 200 ){
      var house_data = resp.data;
      var house = house_data.house
      var facilities_conf = house_data.facilities_list;
      for(let i=0;i< house.facilities.length;i++){
          facilities_conf[house.facilities[i]].is_active = true
      }
      console.log(facilities_conf)
      that.setData({
        house_id:house.id,
        house: house,
        user_id: app.globalData.user_id,
        markers: [{
          iconPath: "/image/icon/location.png",
          latitude: house.latitude,
          longitude: house.longitude,
        }],
        imglist:house.imgs,
        user_favors:house.user_favors,
        user_collects_avatar:house.user_collects_avatar,
        facilities: facilities_conf,
        is_favor: house_data.is_favor,
        collect_counts: house_data.collect_counts,
        favor_counts: house_data.favor_counts,
        is_collect: house_data.is_collect
      });
    }else{
      app.InterError('网络错误，请稍后再试')
    }
    wx.hideLoading()
  },
  onShareAppMessage: function (res) {
    var path ='/pages/detail/detail?house=' + this.data.house_id;
    var arr = app.globalData.share_img_list;
    var imageurl = arr[Math.floor((Math.random()*arr.length))];
    return {
      title: this.data.house.title,
      path: path,
      imageUrl:imageurl, // 分享的封面图
      success: function(res) {
        app.ShowModel('恭喜', '转发成功~');
        // 转发成功
      },
      fail: function(res) {
        app.ShowModel('网络错误', '转发失败~');
        // 转发失败
      }
    }
  },
  ToIndexClick(){
    wx.switchTab({
      url:'/pages/index/index'
    })
  },
  onUserOpStatistic: function(e) {
    if(e.op == 'share') {
      var path = e.path;
      app.ShowToast('转发成功...')
    }
  },
  ReturnClick(){
    wx.navigateBack({//返回
      delta: 1
    })
  },
  onShow:function(e){
  },
  handleClick: function (e) {
    wx.navigateBack({//返回
      delta: 1
    });
    var houseid = e.currentTarget.dataset.id;
    app.handlehouseClick(houseid)
  },
  DetailOnload(options){
    const house_id = options.house;
    app.WxHttpRequestGet('house/detail/'+ house_id,{},this.HandleGetDone)
  },
  onLoad: function (options) {
    app.wxshowloading('拼命加载中...');
    var that = this;
    var user_id = app.globalData.user_id;
    if(!user_id || typeof(user_id) == "undefined"){
      app.MinaLogin().then(function (res) {
        app.globalData.jwt_token = res.data.token;
        app.globalData.user_id = res.data.user_id;
        if(!res.data.user_id){
          wx.hideLoading()
          app.ShowToast("请先完成授权")
          setTimeout(function () {
            app.globalData.login_redirect = '/pages/detail/detail?house='+ options.house;
            wx.switchTab({
              url: '/pages/my/my'
            })
          },1500)
        }else{
          that.DetailOnload(options)
        }
      })
    }else{
      that.DetailOnload(options)
    }
  }
});
