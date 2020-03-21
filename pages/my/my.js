// pages/my/my.js
const app = getApp();
Page({
    options: {
        addGlobalClass: true,
    },
    /**
     * 页面的初始数据
     */
    data: {
        hasUserInfo: false,
        collect_count: 0,
        is_auth: true,
        grid_list: [
            {name: '编辑信息',icon:'profile',color:'blue',url:"/pages/userinfo/userinfo"},
            {name: '我的房源',icon:'write',color:'green', url:"/pages/mypublish/mypublish"},
            {name: '我的动态',icon:'edit',color:'yellow', url:"/pages/my-discuss/my"},
            {name: '我的收藏',icon:'favor',color:'pink', url:"/pages/mycollects/mycollects"},
            {name: '收到预约',icon:'time',color:'red', url:"/pages/appoint/appoint"},
            {name: '意见反馈',icon:'service',color:'olive', url:"/pages/feedback/feedback"},
        ],
        msg_len: 0,
        houses_count: 0,
        system:app.globalData.system,
        version:app.globalData.version,
        favors: 0,
    },
    coutNum(e) {
        if (e > 1000 && e < 10000) {
            e = (e / 1000).toFixed(1) + 'k'
        }
        if (e > 10000) {
            e = (e / 10000).toFixed(1) + 'W'
        }
        return e
    },
    login: function (e) {
        if(e.detail.formId){
            this.setData({
                formId:e.detail.formId
            });
            return
        }
        var that = this;
        var userinfo =  e.detail.userInfo;
        if (!userinfo) {
            app.ShowToast('信息获取失败，请重新点击')
            return
        }
        var new_house = app.globalData.new_house;
        if(new_house){
            // 该用户授权绑定信息，含一个房源
            userinfo['new_house'] = new_house;
            app.globalData.new_house = false
        }
        userinfo['formId'] = that.data.formId;
        app.globalData.userInfo = userinfo;
        app.WxHttpRequestPOST('account/user_info', userinfo, that.BindUserInfoDone, app.InterError);
    },
    Navigator_to(e){
        if(!this.data.is_auth){
            app.ShowToast("请先完成授权")
        }else{
            wx.navigateTo({
                url: e.currentTarget.dataset.url
            })
        }
    },
    BindUserInfoDone(res){
        var that = this;
        var data = res.data;
        app.globalData.user_id = data.data.user_id;
        if(data.code == 200) {
            this.setData({
                is_auth: true
            });
            var redirect = app.globalData.login_redirect;
                if(redirect){
                    app.globalData.redirect = false;
                    app.WxHttpRequestGet('account/item_list', {},that.HanleAjaxItemDone, that.HanleAjaxItemFail);
                    wx.navigateTo({
                        url: redirect
                    })
                }else{
                    this.onLoad()
                }
        }else{
            app.ShowModel('网络错误','绑定注册用户失败，请检查网络后再试~');
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (e) {
        var that = this;
        wx.getSetting({
            success: function (res) {
                var statu = res.authSetting;
                if (!statu['scope.userInfo']) {
                    that.setData({is_auth: false})
                }else{
                    wx.showLoading({
                        title: '数据加载中',
                        mask: true,
                    });
                    app.WxHttpRequestGet('account/item_list', {},that.HanleAjaxItemDone, that.HanleAjaxItemFail);
                }
            }
        })
    },
    HanleAjaxItemFail(res){
        app.ShowModel('网络错误','请刷新后再试');
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
        if(this.data.change_user_info){
            this.setData({
                change_user_info: false
            });
            this.onLoad()
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
        // 显示顶部刷新图标
        wx.showNavigationBarLoading();
        this.onLoad()
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
    },
    ShowAccount(data){
        var that = this;
        that.setData({
            gender: data.gender
        })
        let i = 0;
        numDH();
        function numDH() {
            if (i < 20) {
                setTimeout(function () {
                    that.setData({
                        collect_count: i,
                        msg_len: i,
                        houses_count: i,
                        favors: i
                    });
                    i++;
                    numDH();
                }, 20)
            } else {
                that.setData({
                    collect_count: that.coutNum(data.collects | 0),
                    msg_len: that.coutNum(data.msgs| 0),
                    houses_count: that.coutNum(data.houses_count| 0),
                    favors: that.coutNum(data.favorites| 0)
                })
            }
        }
        wx.hideLoading()
    },
    HanleAjaxItemDone(res){
        var data = res.data.data;
        this.ShowAccount(data)
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },
    VersionClick(){
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
            }else{
                app.ShowToast('小程序已是最新版本')
            }
        });
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
