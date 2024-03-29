//app.js
var QQMapWX = require('/utils/qqmap-wx-jssdk.min.js');
const CHINA = require('/utils/china_city');

App({
    onLaunch: function () {
        //检查是否存在新版本
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
            }
        });
        this.WxUserLaunch();
        var that = this;
        // 初始化地图sdk
        that.globalData.qqmapsdk = new QQMapWX({
            key: 'GAIBZ-I55CU-KCJVD-BKZJX-5ARDF-3GBRU'
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
    WxUserLaunch() {
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
    user_info_bind: function (page_this, e) {
        // 微信授权绑定
        let that = this;
        wx.getUserProfile({
            desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
                var userinfo = res.userInfo;
                if (!userinfo) {
                    that.ShowToast('信息获取失败，请重新点击')
                } else {
                    that.globalData.userInfo = userinfo;
                    that.WxHttpRequestPOST('account/user_info', userinfo, page_this.BindUserInfoDone, that.InterError);
                }
            },
            fail: function () {
                that.ShowToast('信息获取失败，请重新点击')
            }
        })

    },
    /**
     * @return {boolean}
     */
    BinUserInfoCheck() {
        if (!this.globalData.user_id) {
            this.ShowToast("请先完成授权");
            setTimeout(function () {
                wx.switchTab({
                    url: '/pages/my/my'
                });
            }, 1500)
            return false
        }
        if (!this.globalData.finish_user_info) {
            this.ShowToast("请先完善资料后发布");
            setTimeout(function () {
                wx.navigateTo({
                    url: '/pages/userinfo/userinfo'
                });
            }, 1500)
            return false
        }
        return true
    },
    GetUserInfo(res) {
        var that = this;
        return new Promise((resolve, reject) => {
            let resp = res.data.data;
            that.globalData.jwt_token = resp.token;
            that.globalData.user_id = resp.user_id;
            that.globalData.is_superuser = resp.is_superuser;
            that.globalData.finish_user_info = resp.finish_user_info == 1 ? true : false;
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
    MinaLogin() {
        var that = this;
        return new Promise((resolve, reject) => {
            wx.login({
                success(res) {
                    if (!res.code) {
                        this.ShowModel('网络错误', '登陆失败~~');
                        return
                    }
                    wx.request({
                        url: that.globalData.api_host + '/api/' + 'account/login',
                        data: {code: res.code},
                        header: {
                            "content-type": "application/json"		//使用POST方法要带上这个header
                        },
                        method: "POST",
                        success: function (res) {
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
    parseQueryString(url) {
        if (!url || url === 'undefined') {
            return {}
        }
        var obj = {};
        var keyvalue = [];
        var key = "",
            value = "";
        var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
        for (var i in paraString) {
            keyvalue = paraString[i].split("=");
            key = keyvalue[0];
            value = keyvalue[1];
            obj[key] = value;
        }
        return obj;
    },
    /**
     * @return {string}
     */
    Generat_Random_string(count = 10) {
        // 生成随机字符串函数
        var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        var maxPos = chars.length;
        var pwd = '';
        for (var i = 0; i < count; i++) {
            pwd += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd
    },
    create_file_name(dir) {
        // 上传房源生成的文件名
        var date = new Date();
        var Y = date.getFullYear();
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        var D = date.getDate();
        var h = date.getHours();
        var m = date.getMinutes();
        var s = date.getSeconds();
        var S = date.getMilliseconds();
        return dir + Y + M + D + h + m + s + S + this.Generat_Random_string() + '.jpg'
    },
    /**
     * 当小程序启动，或从后台进入前台显示，会触发 onShow
     */
    onShow: function (options) {
    },
    SetProvinceCity(province, city, district) {
        this.globalData.province = province;
        this.globalData.city = city;
        this.globalData.district = district;
        this.globalData.raw_city = false;
    },
    wxshowloading(title) {
        wx.showLoading({
            title: title,
            mask: true
        });
    },
    getPrepage() {
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
    WxHttpRequestGet(url, data, successback, failback) {
        // 封装get请求
        let that = this;
        wx.request({
            url: this.globalData.api_host + '/api/' + url,
            method: 'GET',
            data: data,
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'token': that.globalData.jwt_token,
            },
            success: function (res) {
                successback(res)
            },
            fail(res) {
                failback(res)
            }
        })
    },
    WxHttpRequestPOST(url, data, successback, failback) {
        // 封装post请求
        let that = this;
        wx.request({
            url: this.globalData.api_host + '/api/' + url,
            data: data,
            header: {
                "content-type": "application/json",		//使用POST方法要带上这个header
                'token': that.globalData.jwt_token
            },
            method: "POST",
            success: function (res) {
                successback(res)
            },
            fail(res) {
                failback(res)
            }
        })
    },
    ShowToast(title) {
        // Toast提示封装 app.showToast('')
        wx.showToast({
            title: title,
            icon: 'none',
            duration: 2000,
        })
    },

    ShowModel(title, content) {
        // Model 封装 app.ShowModel('')
        wx.showModal({
            title: title,
            content: content,
            showCancel: false,
        });
    },
    Getstorage(key, successfunc, failfunc) {
        wx.getStorage({
            key: key,
            success: function (res) {
                successfunc(res);
            },
            fail(res) {
                if (failfunc) {
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
        wx.createSelectorQuery().select('#' + selector).boundingClientRect(function (rect) {
            // 使页面滚动到底部
            wx.pageScrollTo({
                scrollTop: rect.height
            })
        }).exec()
    },
    GetCities(pro, city) {
        var cities = CHINA.cites;
        var province = cities[0];
        return new Promise(function (resolve, reject) {
            for (var k in province) {
                if (province[k] === pro) {
                    var p = '0,' + k;
                    for (var i in cities[p]) {
                        if (cities[p][i] === city) {
                            var rcode = p + ',' + i;
                            resolve(cities[rcode])
                        }
                    }
                }
            }
        })
    },
    initSearchComponent() {
        let that = this;
        this.WxHttpRequestGet('house/selects',
            {city: this.globalData.city},
            that.getSearchComponentDone,
            that.InterError)
    },
    getSearchComponentDone(res) {
        let that = this;
        let resp = res.data;
        if (resp.code === 200) {
            var province = that.globalData.province;
            var city = that.globalData.city;
            that.GetCities(province, city).then(function (regions) {
                var filter_conf = resp.data.filter_conf;
                var facility_list = resp.data.facility_list;
                that.globalData.filter_conf = {
                    regions: regions,
                    facility_list: facility_list,
                    subway_list: resp.data.subway,
                    apartment_list: resp.data.apartment,
                    house_type_list: resp.data.house_type,
                    dropDownMenuFourthData: filter_conf['dropDownMenuFourthData'],
                    dropDownMenuThirdData: filter_conf['dropDownMenuThirdData'],
                    dropDownMenuFirstData: filter_conf['dropDownMenuFirstData'],
                    dropDownMenuTitle: filter_conf['dropDownMenuTitle'],
                }
            })
        }

    },
    requestMsg() {
        // 订阅消息
        return new Promise((resolve, reject) => {
            wx.requestSubscribeMessage({
                tmplIds: ["pgPr22zr2nBHa1hwWaMXA4ZA9AxQ7P2dBbcF3M1QIVA"],
                success: (res) => {
                    if (res['pgPr22zr2nBHa1hwWaMXA4ZA9AxQ7P2dBbcF3M1QIVA'] === 'accept') {
                        wx.showToast({
                            title: '订阅OK！',
                            duration: 1000,
                            success(data) {
                                //成功
                                resolve()
                            }
                        })
                    }
                },
                fail(err) {
                    //失败
                    console.error(err);
                    reject()
                }
            })
        })
    },
    GetUserLocation(page_this) {
        let that = this;
        return new Promise((resolve, reject) => {
            wx.getLocation({
                type: 'wgs84',
                success: function (res) {
                    that.globalData.location_conf = {'longitude': res.longitude, 'latitude': res.latitude}
                    page_this.setData({location_auth: true})
                    resolve(true)
                },
                fail: function (res) {
                    page_this.setData({location_auth: false})
                }
            })
        })
    },
    globalData: {
        api_host: 'https://v.kc8013.cn',
        error_image: 'https://img.donghao.club/web/01bc0f59c9a9b0a8012053f85f066c.jpg%40260w_195h_1c_1e_1o_100sh.jpg?versionId=null',
        index_new_city: false,
        is_superuser: false,
        page_refresh: false,
        color_list: ['#66CC66', '#99CCFF', '#FF9900', '#FF6666',
            '#CCCCFF', '#CCCC33', '#009966', '#FF99CC',
            '#99CC00', '#66CCCC', '#CCCC99', '#CC6600'],
        raw_city: true,
        // 用户当前的定位, 授权定位了为{}形式
        location_conf: {},
        // 进入场景
        in_scene: "",
        // 过滤条件
        filter_conf: {},
        home_conf: {},
        share_img: "",
        city: '北京市', // 默认进入首页的地址
        province: '北京市',
        district: '',
        last_page: '',
        toast_new_profile: true,
        toast_new_publish: true,
        my_page_type: 'collect', // 操作类型：收藏&点赞&浏览，默认是collect
        my_page_title: '我的收藏' // 操作类型：收藏&点赞&浏览，默认是collect
    }
});
