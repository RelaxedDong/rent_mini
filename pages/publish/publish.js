// pages/publish/publish.js
import WxValidate from '../../utils/WxValidate.js'

const app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        form: {
            title: "",
            price: "",
            storey: "",
            area: "",
            desc: "",
        },
        short_rent: false,
        show_phone: false,
        address: "", // 详细地址
        resident: "", // 小区名
        index: "",
        select_origin: false,
        subway: '',
        urls: [],
        have_subway: false,
        // 返回的可选择数据
        subway_list: [],
        house_types: [],
        apartments: [],
        // 表单选择 name
        choose_house_type: "",
        choose_apartment: "",
        // 表单选择的值 value
        apartment: "",
        house_type: "",
    },
    ShortRentClick(e) {
        this.setData({
            short_rent: e.detail.value
        })
    },
    ShowPhoneClick(e) {
        this.setData({
            show_phone: e.detail.value
        })
    },
    AddressInput(e) {
        wx.getSetting({
            success: function (res) {
                var statu = res.authSetting;
                if (!statu['scope.userLocation']) {
                    wx.showModal({
                        title: '发布需要授权定位功能',
                        content: '请确认授权，否则地图功能将无法使用',
                        success: function (tip) {
                            if (tip.confirm) {
                                console.log(tip.confirm)
                                wx.openSetting({
                                    success: function (data) {
                                        if (data.authSetting["scope.userLocation"] === true) {
                                            app.ShowToast("授权成功")
                                        } else {
                                            app.ShowToast("授权失败，请重新点击")
                                        }
                                    },
                                    fail: function (data) {
                                        console.log(data)

                                    }
                                })
                            } else {
                                app.ShowToast("授权失败，请重新点击")
                            }
                        },
                    })
                }
            }
        });
        var that = this;
        wx.chooseLocation({
            success: function (res) {
                console.log(res)
                that.setData({
                    address: res.address,      //调用成功直接设置地址
                    resident: res.name,
                    longitude: res.longitude,
                    latitude: res.latitude
                })
            }
        })
    },
    HouseTypeChange(e) {
        let choose = this.data.house_types[e.detail.value]
        console.log(choose)
        this.setData({
            choose_house_type: choose.name,
            house_type: choose.value,
        })
    },
    ApartmentChange(e) {
        let choose = this.data.apartments[e.detail.value]
        this.setData({
            choose_apartment: choose.name,
            apartment: choose.value,
        })
    },
    SubwayChange(e) {
        this.setData({
            subway: this.data.subway_list[e.detail.value].name
        })
    },
    TagChoose(e) {
        var key = e.currentTarget.dataset.key;
        var facility_list = this.data.facility_list;
        facility_list[key].is_active = !facility_list[key].is_active;
        this.setData({
            facility_list: facility_list
        })
    },
    RegionChange: function (e) {
        var region = e.detail.value;
        this.setData({
            region: region,
            subway: "",
            select_origin: true
        });
        this.initChooseComponent(region[1])
    },
    OssSign: function (e) {
        let that = this;
        app.WxHttpRequestGet('house/oss_sigin', {}, function (res) {
            that.setData({
                oss: res.data.data
            })
        })
    },
    fileupload: function (oss, filename, url) {
        return new Promise((resolve, reject) => {
            wx.uploadFile({
                url: oss.upload_path,
                filePath: url,
                name: 'file',
                header: {
                    "Content-Type": "multipart/form-data",
                },
                method: 'post',
                formData: {
                    key: filename,
                    policy: oss.policy,
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
        var that = this;
        return new Promise(function (resolve, reject) {
            var filenames = [];
            for (var i = 0; i < urls.length; i++) {
                var filename = app.create_file_name(dir);
                that.fileupload(oss, filename, urls[i]).then(function (res) {
                    filenames.push(res);
                    if (urls.length === filenames.length) {
                        resolve(filenames);
                    }
                })
            }
        })
    },
    submitBtn: function (e) {
        var that = this;
        var wxdata = that.data;
        const params = e.detail.value;
        params['house_type'] = wxdata.house_type;
        params['apartment'] = wxdata.apartment;
        params['subway'] = wxdata.subway;
        params['region'] = wxdata.region;
        params['imgs'] = wxdata.urls;
        params['latitude'] = wxdata.latitude;
        params['longitude'] = wxdata.longitude;
        params['address'] = wxdata.address;
        params['resident'] = wxdata.resident;
        if (!that.WxValidate.checkForm(params)) {
            const error = that.WxValidate.errorList[0];
            that.showModal(error);
            return false
        }
        var region_place = params['region'][2];
        if (!region_place) {
            app.ShowModel('操作错误', '请选择房源具体区域');
            return false
        }
        app.requestMsg();
        wx.showModal({
            title: '确认提示',
            content: '确认发布吗房源',
            success: function (res) {
                if (res.confirm) {
                    // app.wxshowloading('房源发布中...');
                    var facility_list = [];
                    var facility_list_active = wxdata.facility_list;
                    for (var tag in facility_list_active) {
                        if (facility_list_active[tag].is_active) {
                            facility_list.push(tag)
                        }
                    }
                    params['facility_list'] = facility_list;
                    params['short_rent'] = wxdata.short_rent;
                    params['show_phone'] = wxdata.show_phone;
                    var temprory = wxdata.temporary_imgs;
                    if (temprory) {
                        params['img'] = temprory
                        app.WxHttpRequestPOST('house/house_add', params, that.AjaxDone, that.AjaxError)
                    } else {
                        that.OssUpload('house_img/', wxdata.urls).then(function (urls) {
                            that.setData({
                                temporary_imgs: urls
                            });
                            params['img'] = urls;
                            app.WxHttpRequestPOST('house/house_add', params, that.AjaxDone, that.AjaxError)
                        })
                    }
                }
            }
        })
    },

    AjaxDone(res) {
        var that = this;
        var data = res.data;
        wx.hideLoading()
        if (data.code === 200) {
            that.setData({
                form: {},
                cur_house_type: "",
                cur_rent_type: "",
                address: "",
                subway: "",
                urls: [],
            });
            app.ShowModel('恭喜！房源发布成功!', '快马加鞭审核中...')
            setTimeout(function () {
                wx.switchTab({
                    url: '/pages/index/index'
                })
            }, 2000)
        } else {
            app.ShowModel('错误', data.msg)
        }
        wx.hideLoading()
    },
    AjaxError(res) {
        app.ShowModel('网络错误', '请检查你的网络，请稍后再试~')
    },
    linchangeListen: function (e) {
        this.setData({
            urls: e.detail.all
        })
    },
    linremoveListem: function (e) {
        this.setData({
            urls: e.detail.all
        })
    },
    showModal(error) {
        wx.showModal({
            content: error.msg,
            showCancel: false,
        })
    },
    initValidate() {
        const rules = {
            title: {
                required: true,
                maxlength: 20,
                minlength: 2
            },
            price: {
                required: true,
                number: true,
                max: 100000,
                min: 1
            },
            storey: {
                required: true,
                number: true,
                min: 1,
                max: 100
            },
            area: {
                required: true,
                number: true,
                min: 1,
                max: 500
            },
            house_type: {
                required: true
            },
            apartment: {
                required: true
            },
            address: {
                required: true,
            },
            desc: {
                required: true,
                maxlength: 300,
                minlength: 5
            },
            imgs: {
                required: true,
            }
        }
        const messages = {
            title: {
                required: '标题必须要填写',
                maxlength: '标题最多20个字符',
                minlength: '标题至少2个字符'
            },
            price: {
                required: '请输入房租',
                number: '租金格式错误',
                max: "不支持太高价格房源",
                min: '房源价格错误'
            },
            storey: {
                required: '请输入楼层',
                number: '楼层请输入整数',
                max: '房高得离谱，换个试试吧！',
                min: '楼层错误'
            },
            area: {
                required: '请输入房源面积',
                number: '面积请输入整数',
                min: '面积输入错误，请重试~',
                max: '暂不支持>500平房源'
            },
            house_type: {
                required: '请选择租房类型'
            },
            apartment: {
                required: '请选择户型'
            },
            address: {
                required: '请选择详细地址'
            },
            desc: {
                required: '请简要描述下你的房源',
                maxlength: '简介过长',
                minlength: '简介太短啦'
            },
            imgs: {
                required: '请选择房源图片'
            },
        }
        this.WxValidate = new WxValidate(rules, messages)
    },
    initChooseComponent(city) {
        let that = this;
        app.WxHttpRequestGet('house/selects', {"city": city}, function (res) {
            let resp = res.data;
            if (resp.code === 200) {
                that.setData({
                    subway_list: resp.data.subway,
                    apartments: resp.data.apartment,
                    house_types: resp.data.house_type,
                    facility_list: resp.data.facility_list,
                    have_subway: resp.data.subway.length > 0
                });
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            region: [app.globalData.province, app.globalData.city, app.globalData.district]
        })
        this.initValidate();
        this.OssSign();
        wx.setNavigationBarTitle({title: app.globalData.city + "房源发布"})
        this.initChooseComponent(app.globalData.city)
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
