//index.js
//获取应用实例
const app = getApp();
Page({
    data: {
        page:0,
        search_txt:"",
        discusses:[]
    },
    getSearch_txt:function(e) {
        this.setData({
            search_txt: e.detail.value
        })
    },
    searchSubmit:function () {
        this.get_discuss_data({
            city: app.globalData.city,
            province:app.globalData.province,
            region:app.globalData.district,
            search_txt:this.data.search_txt,
        })
    },
    toDetail(e){
        var disscuss_id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url:"/pages/discuss-detail/discuss-detail?discuss_id="+disscuss_id
        })
    },
    get_discuss_data(params) {
        this.setData({
            discusses:[]
        });
        let self = this;
        app.WxHttpRequestGet('house/douban_discuss_list', params, function (res) {
            var data = res.data;
            if(data.code === 200){
                self.setData({
                    discusses: data.data
                });
            }else{
                app.ShowModel( '错误',data.msg)
            }
            wx.hideLoading()
        }, app.InterError)
    },
    RegionChange: function (e) {
        var region = e.detail.value;
        let raw_region = this.data.region;
        if(region[0]!==raw_region[0]||region[1]!==raw_region[1]){
            app.ShowToast('只能切换'+raw_region[1]+'区域哦~');
            return
        }
        app.globalData.district = region[2];
        this.onLoad()
    },
    onLoad: function () {
        app.wxshowloading('拼命加载中...');
        this.setData({
            city: app.globalData.city,
            region:[app.globalData.province,app.globalData.city,app.globalData.district]
        });
        let params = {
            city: app.globalData.city,
            province:app.globalData.province,
            page: this.data.page,
            search_txt:this.data.search_txt,
        };
        if(app.globalData.district){
            params['region'] = app.globalData.district
        }
        this.get_discuss_data(params)
    },
})
