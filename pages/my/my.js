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
            {name: '我的收藏', icon: 'favor', color: 'pink', url: "/pages/mycollects/mycollects"},
            {name: '我的房源', icon: 'write', color: 'green', url: "/pages/mypublish/mypublish"},
            {name: '编辑信息', icon: 'profile', color: 'blue', url: "/pages/userinfo/userinfo"},
        ],
        msg_len: 0,
        houses_count: 0,
        system: app.globalData.system,
        version: app.globalData.version,
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
  login(e){
    app.user_info_bind(this, e)
  },
    Navigator_to(e) {
        if (!this.data.is_auth) {
            app.ShowToast("请先完成授权")
        } else {
            wx.navigateTo({
                url: e.currentTarget.dataset.url
            })
        }
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
    },
    HanleAjaxItemFail(res) {
        app.ShowModel('网络错误', '请刷新后再试');
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
        if(!app.globalData.user_id) {
            this.setData({is_auth: false})
            return
        }
        wx.showLoading({
            title: '数据加载中',
            mask: true,
        });
        app.WxHttpRequestGet('account/item_list', {}, this.ShowAccount, this.HanleAjaxItemFail);
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
    ShowAccount(res) {
        let resp = res.data;
        wx.hideLoading()
        if(resp.code !== 200){
            app.ShowToast(resp.msg);
            return
        }
        let data = resp.data;
        var that = this;
        that.setData({
            gender: data.user.gender
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
                    msg_len: that.coutNum(data.msgs | 0),
                    houses_count: that.coutNum(data.houses_count | 0),
                    favors: that.coutNum(data.favor_count | 0)
                })
            }
        }
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
    onShareAppMessage: function () {

    }
})
