// components/tabs/index.js
// pages/test/test.js
// 设置函数防抖
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
const app = getApp();
Page({
    relations: {
        '../tabpanel/index': {
            type: 'child',
            linked(target) {
                this.initTabs();
            },
            unlinked(target) {
                this.initTabs();
            }
        },
    },
    /**
     * 组件的属性列表
     */
    data: {
        recommend: [
            {
                id: 1,
                face: 'https://szs-renting.oss-cn-shenzhen.aliyuncs.com/house/20201112193613671tp5hFDMKi7p6bT7PhCcXC8HXE3xeFENm.jpg',
                name: '老君山',
                address: '岸新四季御园',
            },
            {
                id: 1,
                face: "https://szs-renting.oss-cn-shenzhen.aliyuncs.com/house/2020083143610153GT65TXdCJBRWRkF7z7apHiHraaG4fSB5.jpg",
                name: '西峡老界岭',
                address: '莲塘口岸新四季御园',
            },
            {
                id: 1,
                name: '宝天曼',
                face: "https://szs-renting.oss-cn-shenzhen.aliyuncs.com/house/20201112193613655WWffFjaPeDDPEtHteHjD4mTNzETceGFz.jpg",
                address: '莲塘口岸新四季御园',
            }],
        banners: [],
        color_list: app.globalData.color_list,
        icon_list: [],
        cards: [],
        show_empty:false,
        houses: [],
        publish_discuss:"right: 110rpx",
        activekey: 'all',
        page: 0,
        offset: 10,
        Loading: false,//加载动画的显示
        count: 0,
        has_next: true,
        last_active_key: 'all'
    },
    ImageClick:function(e){
        wx.navigateTo({
            url: e.currentTarget.dataset.path
        })
    },
    changeTabs(e) {
        var activekey = e.currentTarget.dataset.activekey;
        if (activekey !== this.data.last_active_key) {
            this.setData({
                page: 0,
                houses: [],
                last_active_key: activekey,
                activekey: activekey
            });
            this.getHouseList(0);
        }
    },
    CitySelect(res) {
        // 城市选择
        wx.navigateTo({
            url: '/pages/city/city'
        })
    },
    onReachBottom: function () {
        var has_next = this.data.has_next;
        var activekey = this.data.activekey;
        if (has_next) {
            var page = this.data.page + 1;
            app.WxHttpRequestGet('house/index', {
                'city': app.globalData.city, 'page': page, activekey: activekey
            }, this.LoadMoreDone, app.InterError)
        } else {
            app.ShowToast('没有更多了...')
        }
    },
    HandleIndexGetDone(res) {
        var resp = res.data;
        if(resp.code === 200){
            var houses_result = resp.data.house;
            var length = houses_result.length
            if(length > 0){
                this.setData({
                    has_next: length > 0,
                    [`houses[${this.data.page}]`]: houses_result
                });
            }else{
                this.setData({
                    show_empty: true
                })
            }
        } else {
            app.ShowToast(resp.msg);
        }
        wx.hideLoading()
    },
    LoadMoreDone(res) {
        var resp = res.data;
        if(resp.code === 200){
            var page = this.data.page + 1;
            var houses = resp.data.house;
            if (houses.length > 0) {
                this.setData({
                    [`houses[${page}]`]: houses,
                    page: page,
                    Loading: false
                })
            } else {
                this.setData({
                    has_next: false
                })
            }
        }
        wx.hideLoading()
    },
    onPageScroll: function (e) {  // 调用showImg函数
    },
    onReady: function () {
    },
    getHouseList: function (page) {
        app.WxHttpRequestGet('house/index', {
            'city': app.globalData.city, 'page': page, 'activekey': this.data.activekey
        }, this.HandleIndexGetDone, app.InterError)
    },
    GetIndexConfigDone(res) {
        // 获取首页banner、icon、feed配置列表
        let configs = res.data.data
        this.setData({
            banners: configs.banners,
            cards: configs.cards,
            icon_list: configs.icons,
        })
    },
    onPullDownRefresh: function () {
        // 显示顶部刷新图标
        wx.showNavigationBarLoading();
        this.onLoad()
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
    },
    onLoad: function (options) {
        var that = this;
        var city = app.globalData.city;
        wx.setNavigationBarTitle({title: "蚁租房"})
        app.initSearchComponent(city);
        that.setData({
            city: city,
            placeholder: city,
        });
        this.getHouseList(0);
        app.WxHttpRequestGet('house/banners', {city: city}, this.GetIndexConfigDone, app.InterError);
        wx.getSetting({
            success: function (res) {
                var statu = res.authSetting;
                if (!statu['scope.userLocation']) {
                    that.getPermission()
                }
            }
        })
    },
    getPermission:function(){
        var that = this;
        return new Promise((resolve, reject) => {
            wx.getLocation({
                type: 'wgs84',
                success: function (res) {
                    var latitude = res.latitude;
                    var longitude = res.longitude;
                    app.globalData.qqmapsdk.reverseGeocoder({
                        location: {
                            latitude: latitude,
                            longitude: longitude
                        },
                        success: function (res) {
                            var ad_info = res.result.ad_info;
                            let province = ad_info.province;
                            let city = ad_info.city;
                            let district = ad_info.district;
                            app.SetProvinceCity(province, city, district);
                            that.setData({
                                pla:city,
                                placeholder: city
                            })
                            app.WxHttpRequestGet('house/banners', {city: that.data.city}, app.GetIndexConfigDone, app.InterError);
                            that.getHouseList(0);
                            app.initSearchComponent(city);
                            app.ShowToast('定位城市：' + city)
                        },
                        fail:function (res) {
                            wx.showModal({
                                title: res,
                            });
                        }
                    });
                },
            })
        })
    },
    onShareAppMessage: function (res) {
        var path ='/pages/index/index'
        return {
          title: "蚁租房|快速的找房租房平台",
          path: path,
          imageUrl:app.globalData.share_img, // 分享的封面图
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
    onShow: function () {
        var new_city = app.globalData.index_new_city;
        if (new_city) {
            this.onLoad()
            app.globalData.index_new_city = false
        }
    },
    searchbtnclick: function (e) {
        wx.navigateTo({
            url: '/pages/list/list'
        })
    },
});
