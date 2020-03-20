const app = getApp();
Page({
    data: {
        discuss: {},
    },
    ToIndexClick(){
        wx.switchTab({
            url:'/pages/index/index'
        })
    },
    click_check(){
        let now = new Date();
        let hour = now.getHours();
        return !(hour < 8 || hour > 22);
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
    Wechat(e){
        let can_operation = this.click_check()
        if(!can_operation){
            app.ShowToast('8点后才能进行操作哦~')
            return
        }
        if(!app.globalData.user_id){
            this.ShowToast("请先完成授权");
            return
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
    onLoad: function (options) {
        var that = this;
        const discussid = options.discuss_id;
        app.wxshowloading('拼命加载中...');
        app.WxHttpRequestGet('house/douban_discuss_detail', {discuss_id:discussid}, that.HandleGetDone, app.Error)
    },
    HandleGetDone(res) {
        console.log(res)
        var data = res.data;
        if (data.code === 200) {
            var discuss = data.data;
            this.setData({
                discuss:discuss,
            })
        } else {
            app.ShowModel('错误', data.msg);
            setTimeout(function () {
                wx.navigateBack();
            },1500)
        }
        wx.hideLoading()
    },
    onShareAppMessage: function (res) {
        var path ='/pages/discuss-detail/discuss-detail?discuss_id=' + this.data.discuss.id;
        var arr = app.globalData.share_img_list;
        var imageurl = arr[Math.floor((Math.random()*arr.length))];
        return {
            title: this.data.discuss.title,
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
})
