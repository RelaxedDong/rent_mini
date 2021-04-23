//index.js
//获取应用实例
const app = getApp();
Page({
    data: {},
    Copy(e){
        wx.setClipboardData({
            data: e.currentTarget.dataset.number,
            success: function (res) {
                wx.getClipboardData({
                    success: function (res) {
                        wx.showToast({
                            title: '复制成功'
                        })
                    }
                })
            }
        })
    },
    onLoad: function () {
    },
})
