//app.js
var QQMapWX = require('/utils/qqmap-wx-jssdk.min.js');
App({
  onLaunch: function () {
    //检查是否存在新版本
    wx.getUpdateManager().onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      if(res.hasUpdate){//如果有新版本
        // 小程序有新版本，会主动触发下载操作（无需开发者触发）
        wx.getUpdateManager().onUpdateReady(function () {//当新版本下载完成，会进行回调
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，单击确定重启应用',
            showCancel:false,
            success: function (res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                wx.getUpdateManager().applyUpdate();
              }
            }
          })
        })
        // 小程序有新版本，会主动触发下载操作（无需开发者触发）
        wx.getUpdateManager().onUpdateFailed(function () {//当新版本下载失败，会进行回调
          wx.showModal({
            title: '提示',
            content: '检查到有新版本，但下载失败，请检查网络设置',
            showCancel: false,
          })
        })
      }
    });
    this.WxUserLaunch();
    var that = this;
    // 初始化地图sdk
    that.globalData.qqmapsdk  = new QQMapWX({
      key: 'RG7BZ-G2KRV-XWPP2-U5GWL-WWQPF-RIBUW'
    });
    // 初始化系统变量
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight + 46;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.system = e.system;
        this.globalData.version = e.version;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight
        this.globalData.windowWidth = wx.getSystemInfoSync().windowWidth;
        this.globalData.windowHeight = wx.getSystemInfoSync().windowHeight
      }
    });
  },
  WxUserLaunch(){
    // 用户登陆
    var that = this;
    return new Promise((resolve, reject) => {
      that.MinaLogin().then(function (res) {
        that.GetUserInfo(res).then(function () {
          resolve()
        })
      })
    })
  },
  /**
   * @return {boolean}
   */
  BinUserInfoCheck(){
    if(!this.globalData.user_id){
      this.ShowToast("请先完成授权");
      setTimeout(function () {
        wx.switchTab({
          url: '/pages/my/my'
        });
      },1500)
      return false
    }
    if(!this.globalData.finish_user_info){
      this.ShowToast("请先完善资料后发布");
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/userinfo/userinfo'
        });
      },1500)
      return false
    }
    return true
  },
  GetUserInfo(res){
    var that = this;
    return new Promise((resolve, reject) => {
      that.globalData.jwt_token = res.data.token;
      that.globalData.user_id = res.data.user_id;
      that.globalData.finish_user_info = res.data.finish_user_info=='1'?true:false;
      wx.getSetting({
        success: function (res) {
          var statu = res.authSetting;
          if (statu['scope.userInfo']) {
            wx.getUserInfo({
              success: res => {
                that.globalData.userInfo = res.userInfo;
                resolve(res)
              }
            });
          }
        },
        fail(res) {
          reject(res)
        }
      });
    })
  },
  MinaLogin(){
    var that = this;
    return new Promise((resolve, reject) =>{
      wx.login({
        success(res) {
          if( !res.code ){
            this.ShowModel('网络错误','登陆失败~~');
            return
          }
          wx.request({
            url: that.globalData.api_host +'account/login',
            data: {code:res.code},
            header:{
              "content-type": "application/json"		//使用POST方法要带上这个header
            },
            method:"POST",
            success:function(res) {
              resolve(res)
            },
            fail(res) {
              reject(res)
            }
          })
        }
      });
    })
  },
  timestampToTime(timestamp) {
    // 时间格式化
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = date.getDate();
    return Y+M+D;
  },
  /**
   * @return {string}
   */
  Generat_Random_string (){
    // 生成随机字符串函数
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = chars.length;
    var pwd = '';
    for (var i = 0; i < 32; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd
  },
  create_file_name(dir){
    // 上传房源生成的文件名
    var date = new Date();
    var Y = date.getFullYear();
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
    var D = date.getDate();
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    var S = date.getMilliseconds();
    return dir + Y+M+D+h+m+s+S + this.Generat_Random_string()  +'.jpg'
  },
  /**
 * 当小程序启动，或从后台进入前台显示，会触发 onShow
 */
  onShow: function (options) {
  },
  SetProvinceCity(province, city, district){
    this.globalData.province = province;
    this.globalData.city = city;
    this.globalData.district = district;
    this.globalData.raw_city = false;
  },
  wxshowloading(title){
    wx.showLoading({
      title: title,
      mask:true
    });
  },
  getPrepage(){
    var pages = getCurrentPages();
    return pages[pages.length - 2]
  },
  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
  },
  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    console.log("onError")
  },
  WxHttpRequestGet(url,data,successback,failback){
    // 封装get请求
    data['jwt_token'] = this.globalData.jwt_token;
    wx.request({
      url: this.globalData.api_host + url,
      method: 'GET',
      data: data,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success:function(res) {
        successback(res)
      },
      fail(res) {
        failback(res)
      }
    })
  },
  WxHttpRequestPOST(url,data,successback,failback){
    // 封装post请求
    data['jwt_token'] = this.globalData.jwt_token;
    wx.request({
      url: this.globalData.api_host + url,
      data: data,
      header:{
        "content-type": "application/json"		//使用POST方法要带上这个header
      },
      method:"POST",
      success:function(res) {
        successback(res)
      },
      fail(res) {
        failback(res)
      }
    })
  },
  ShowToast(title){
    // Toast提示封装 app.showToast('')
    wx.showToast({
      title: title,
      icon: 'none',
      duration: 2000,
    })
  },

  ShowModel(title,content){
    // Model 封装 app.ShowModel('')
    wx.showModal({
      title:title,
      content: content,
      showCancel: false,
    });
  },
  Getstorage(key, successfunc, failfunc){
    wx.getStorage({
      key: key,
      success:function(res) {
        successfunc(res);
      },
      fail(res) {
        if(failfunc){
          failfunc(res);
        }
      }
    })
  },
  InterError(res) {
    this.ShowModel('网络错误', '请稍后再试~');
    wx.hideLoading()
  },
  pageScrollToBottom: function (selector) {
    // 元素滑动底部
    wx.createSelectorQuery().select('#'+selector).boundingClientRect(function (rect) {
      // 使页面滚动到底部
      wx.pageScrollTo({
        scrollTop: rect.height
      })
    }).exec()
  },
  handlehouseClick: function(house_id){
    wx.navigateTo({
      url: '/pages/detail/detail?house='+house_id
    })
  },
  makePhoneCall(phone){
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  get_show_time(time){
    var new_time = time.split('T');
    return new_time[0] + ' ' + new_time[1].substr(0,8)
  },
  get_html_imgs(html){
    var reimg=/<img src=(.+?)>/gi;
    let arr=html.match(reimg);
    let imgs = [];
    if(arr){
      for(let i=0;i<arr.length;i++){
        imgs.push(arr[i].replace(/<img src="([^\s]+)"\s*[^>]*>/gi,"$1"))
      }
    }
    return imgs
  },
  handlePublishTimeDesc(curTime, post_modified){
        // 拿到当前时间戳和发布时的时间戳，然后得出时间戳差
        // var postTime = new Date(post_modified);
        post_modified=post_modified.replace(/-/g, '/'); // 解决ios 不识别xxxx-xx-xx格式
        var postTime = new Date(post_modified);
        var timeDiff = curTime.getTime() - postTime.getTime();
        // 单位换算
        var min = 60 * 1000;
        var hour = min * 60;
        var day = hour * 24;
        var week = day * 7;
        // 计算发布时间距离当前时间的周、天、时、分
        var exceedWeek = Math.floor(timeDiff/week);
        var exceedDay = Math.floor(timeDiff/day);
        var exceedHour = Math.floor(timeDiff/hour);
        var exceedMin = Math.floor(timeDiff/min);
        // 最后判断时间差到底是属于哪个区间，然后return
        if(exceedWeek > 0){
          return post_modified;
        }else{
          if(exceedDay < 7 && exceedDay > 0){
            return exceedDay + '天前';
          }else{
            if(exceedHour < 24 && exceedHour > 0){
              return exceedHour + '小时前';
            }else{
              if(exceedMin<=0){
                return "刚刚"
              }
              return exceedMin + '分钟前';
            }
          }
        }
      },
  globalData: {
    login_redirect:false,
    api_host:'https://api.donghao.club/api/',
    discuss_page_run:false,
    has_pre: false,
    index_new_city:false,
    discuss_new_city:false,
    raw_city:true,
    share_img_list: ['../../image/share.png', '../../image/share1.png', '../../image/share2.png'],
    city:'深圳市', // 默认进入首页的地址
    province:'广东省',
    district:'南山区',
    last_page:''
  }
});
