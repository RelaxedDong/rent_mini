// pages/details/details.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let self = this;
        const eventChannel = self.getOpenerEventChannel();
        eventChannel.on('acceptDataFromOpenerPage', function(data) {
            self.setData({
                html: data.html,
                title: data.title,
                rent_type: data.rent_type,
                city: app.globalData.city,
                region: app.globalData.district,
                add_wechat: data.add_wechat,
                add_phone: data.add_phone,
            })
        })
        this.OssSign();

    },
    OssSign: function (e) {
        let self = this;
        // 获取oss接口，不公布
            self.setData({
                oss: res.data.data
            })
        })
    },
    fileupload: function (oss, filename, url) {
        return new Promise((resolve, reject) => {
            wx.uploadFile({
                url: oss.region_host,
                filePath: url,
                name: 'file',
                header: {
                    "Content-Type": "multipart/form-data",
                },
                method: 'post',
                formData: {
                    key: filename,
                    policy: oss.pocicy,
                    OSSAccessKeyId: oss.accessKeyId,
                    success_action_status: "200",
                    signature: oss.sign,
                },
                success(res) {
                    resolve(oss.region_host + '/' + filename);
                },
                fail(error) {
                    console.log(error)
                }
            })
        })
    },
    OssUpload: function (dir, urls) {
        var oss = this.data.oss;
        if(!oss){
            app.ShowToast('网络错误，请稍后再试一下~');
            return
        }
        var that = this;
        return new Promise(function (resolve, reject) {
            var filenames = [];
            for (var i = 0; i < urls.length; i++) {
                var filename = app.create_file_name(dir);
                that.fileupload(oss, filename, urls[i]).then(function (res) {
                    filenames.push(res);
                    if(urls.length === filenames.length){
                        resolve(filenames);
                    }
                })
            }
        })
    },
    Publish () {
        let self = this;
        let params = {
            title: this.data.title,
            desc: this.data.html,
            rent_type: this.data.rent_type,
            region: app.globalData.district,
            province: app.globalData.province,
            city: app.globalData.city,
        };
        if(this.data.add_wechat){
            params['add_wechat'] = 1
        }
        if(this.data.add_phone){
            params['add_phone'] = 1
        }
        app.wxshowloading('发布中, 请稍后...');
        let imgs = app.get_html_imgs(params['desc']);
        if(imgs.length > 0){
            self.OssUpload('discusses/', imgs).then(function (urls) {
                params['desc'] = self.updateHtmlImgs(params['desc'], imgs, urls);
                app.WxHttpRequestPOST('house/douban_discuss_add',params,self.AjaxDone,app.InterError)
            })
        } else {
            app.WxHttpRequestPOST('house/douban_discuss_add',params,self.AjaxDone,app.InterError)
        }
    },
    updateHtmlImgs(html,old_imgs, new_imgs) {
      for(let i=0;i<new_imgs.length;i++){
          html = html.replace(old_imgs[i],new_imgs[i])
      }
      return html
    },
    AjaxDone(res){
        var data = res.data;
        if (data.code === 200) {
            app.ShowModel( '恭喜！', '动态发布成功！');
            setTimeout(function () {
                wx.switchTab({
                    url:"/pages/index/index"
                })
                wx.navigateTo({
                    url: '/pages/discuss/discuss'
                })
            },1500)
        } else {
            app.ShowModel( '错误', data.msg)
        }
        wx.hideLoading()
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

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})