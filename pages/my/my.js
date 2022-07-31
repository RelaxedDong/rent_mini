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
        is_auth: true,
        grid_list: [
            {name: '意见反馈', icon: 'question',  url: "/pages/feedback/feedback"},
        ],
        avatarUrl: "",
        nickname: "",
    },
    Navigator_to(e) {
        if(e.currentTarget.dataset.type && !this.data.is_auth){
            app.ShowToast('请先完成授权绑定~');
            return
        }
        app.globalData.my_page_type = e.currentTarget.dataset.type
        app.globalData.my_page_title = e.currentTarget.dataset.title
        wx.navigateTo({
            url: e.currentTarget.dataset.url
        })
    },
    Desktop() {
      app.ShowModel('提示', '请点击右上角胶囊 "添加到桌面" ');
    },
    getUserProfile(e) {
        app.user_info_bind(this, e)
    },
    BindUserInfoDone(res) {
        var data = res.data;
        if (data.code === 200) {
            app.globalData.user_id = data.data.user_id;
            this.setData({
                is_auth: true
            });
            this.onLoad()
        } else {
            app.ShowModel('网络错误', '绑定注册用户失败，请检查网络后再试~');
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (e) {
        this.setData({
            is_superuser: app.globalData.is_superuser
        })
        if (!app.globalData.user_id) {
            this.setData({is_auth: false})
        } else {
            app.WxHttpRequestGet('account/edit_info',{},this.GetUesrInfoDone, app.InterError);
        }
    },
    GetUesrInfoDone: function (res) {
        var data = res.data.data;
        this.setData({
            avatarUrl: data.avatarUrl,
            nickname: data.nickname,
        })
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
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },
    VersionClick() {
        wx.getUpdateManager().onCheckForUpdate(function (res) {
            // 请求完新版本信息的回调
            if (res.hasUpdate) {//如果有新版本
                // 小程序有新版本，会主动触发下载操作（无需开发者触发）
                wx.getUpdateManager().onUpdateReady(function () {//当新版本下载完成，会进行回调
                    wx.showModal({
                        title: '更新提示',
                        content: '新版本已经准备好，单击确定重启应用',
                        showCancel: false,
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
            } else {
                app.ShowToast('小程序已是最新版本')
            }
        });
    },
    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function () {
    //
    // }
})
