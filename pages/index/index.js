// components/tabs/index.js
// pages/test/test.js
// 设置函数防抖

const app = getApp();
Page({
    /**
     * 组件的属性列表
     */
    data: {
        navbarInitTop: 0, //导航栏初始化距顶部的距离
        animationData: "",
        isFixedTop: false, //是否固定顶部
        navTab: ['热门推荐', '附近好房'],
        currentTab: 0,
        banners: [],
        color_list: app.globalData.color_list,
        icon_list: [],
        cards: [],
        show_empty: false,
        houses: [],
        page: 0,
        offset: 10,
        Loading: false,//加载动画的显示
        has_next: true,
        tab_api_conf: ['house/index', 'house/nearby_houses'],
        api_url: "house/index",
        location_auth: false,
    },
    currentTab(e) {
        let that = this;
        let idx = e.currentTarget.dataset.idx
        if (this.data.currentTab === idx) {
            return
        }
        let url = this.data.tab_api_conf[idx]
        this.setData({
            api_url: url,
            currentTab: idx,
            page: 0,
            houses: []
        })
        if (idx === 1 && !this.data.location_auth) {
            return
        }
        that.getHouseList(url, 0)
    },
    ImageClick: function (e) {
        wx.navigateTo({
            url: e.currentTarget.dataset.path
        })
    },
    CitySelect(res) {
        // 城市选择
        wx.navigateTo({
            url: '/pages/city/city'
        })
    },
    onReachBottom: function () {
        var has_next = this.data.has_next;
        if (has_next) {
            var page = this.data.page + 1;
            app.WxHttpRequestGet(this.data.api_url, {
                'city': app.globalData.city, 'page': page, lng: this.data.lng, lat: this.data.lat
            }, this.LoadMoreDone, app.InterError)
        } else {
            app.ShowToast('没有更多了...')
        }
    },
    HandleIndexGetDone(res) {
        var resp = res.data;
        if (resp.code === 200) {
            var houses_result = resp.data.house;
            var length = houses_result.length
            if (length > 0) {
                this.setData({
                    has_next: length > 0,
                    [`houses[${this.data.page}]`]: houses_result
                });
            } else {
                this.setData({
                    show_empty: true
                })
            }
        } else {
            app.ShowToast(resp.msg);
        }
    },
    LoadMoreDone(res) {
        var resp = res.data;
        if (resp.code === 200) {
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
    },
    onPageScroll: function (e) {
        var that = this;
        var scrollTop = parseInt(e.scrollTop); //滚动条距离顶部高度
        //判断'滚动条'滚动的距离 和 '元素在初始时'距顶部的距离进行判断
        var isSatisfy = scrollTop >= that.data.navbarInitTop ? true : false;
        //为了防止不停的setData, 这儿做了一个等式判断。 只有处于吸顶的临界值才会不相等
        if (that.data.isFixedTop === isSatisfy) {
            return false;
        }
        that.setData({
            isFixedTop: isSatisfy
        });
    },
    onReady: function () {
    },
    getHouseList: function (url, page) {
        app.WxHttpRequestGet(url, {
            city: app.globalData.city, page: page, location_conf: JSON.stringify(app.globalData.location_conf)
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
    openLocation() {
        let that = this;
        wx.openSetting({
            success: function (data) {
                if (data.authSetting["scope.userLocation"] === true) {
                    app.ShowToast("位置授权成功")
                    app.GetUserLocation(that).then(function (location_auth) {
                        that.getHouseList(that.data.api_url, 0)
                        // 定位后重新配置组件
                        page_that.setData({location_auth: location_auth})
                    })
                } else {
                    app.ShowToast("授权失败，请重新点击")
                }
            }
        })
    },
    initCity(latitude, longitude) {
        let that =this;
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
                that.setData({placeholder: city, houses: []});
                app.WxHttpRequestGet('house/banners', {city: city}, that.GetIndexConfigDone, app.InterError);
                that.getHouseList(that.data.api_url, 0);
                app.ShowToast('定位城市：' + city)
            },
            fail: function (res) {
                console.log(res);
                wx.showModal({
                    title: res,
                });
            }
        });
    },
    initLocation() {
        let that = this;
        wx.getLocation({
            type: 'wgs84',
            success: function (r) {
                var latitude = r.latitude;
                var longitude = r.longitude;
                app.globalData.location_conf = {'longitude': longitude, 'latitude': latitude}
                that.initCity(latitude, longitude);
            }
        })
    },
    onLoad: function (options) {
        var that = this;
        var city = app.globalData.city;
        wx.setNavigationBarTitle({title: "直租拼室友"})
        app.initSearchComponent();
        that.setData({city: city, placeholder: city});
        this.getHouseList(this.data.api_url, 0);
        app.WxHttpRequestGet('house/banners', {city: city}, this.GetIndexConfigDone, app.InterError);
        wx.getSetting({
            success: function (res) {
                var status = res.authSetting;
                if (!status['scope.userLocation']) {
                    that.getPermission()
                } else {
                    that.initLocation()
                }
            }
        })
        app.GetUserLocation(that)
    },
    getPermission: function () {
        var that = this;
        return new Promise((resolve, reject) => {
            wx.getLocation({
                type: 'wgs84',
                success: function (res) {
                    var latitude = res.latitude;
                    var longitude = res.longitude;
                    app.globalData.location_conf = {'longitude': longitude, 'latitude': latitude}
                    that.initCity(latitude, longitude);
                },
            })
        })
    },
    onShareAppMessage: function (res) {
        var path = '/pages/index/index'
        return {
            title: "直租拼室友",
            path: path,
            imageUrl: app.globalData.share_img, // 分享的封面图
            success: function (res) {
                app.ShowModel('恭喜', '转发成功~');
                // 转发成功
            },
            fail: function (res) {
                app.ShowModel('网络错误', '转发失败~');
                // 转发失败
            }
        }
    },
    onShow: function () {
        var that = this;
        if (that.data.navbarInitTop === 0) {
            //获取节点距离顶部的距离
            wx.createSelectorQuery().select('#navbar').boundingClientRect(function (rect) {
                if (rect && rect.top > 0) {
                    that.setData({
                        navbarInitTop: parseInt(rect.top) + 180
                    });
                }
            }).exec();
        }
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
