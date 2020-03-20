// pages/publish/publish.js
const BASE = require('../../utils/basic');
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

        cur_house_type: "",
        address: "",
        cur_rent_type: "",
        index: "",
        select_origin:false,
        subway_list:[],
        clear: false,
        time: '12:01',
        date: app.timestampToTime(Date.now()),
        subway: '',
        apartment: BASE.base.apartment,
        facilities: BASE.base.facilities,
        house_type: BASE.base.house_type,
        urls: [],
        timer: null,
        have_subway: false
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
                                wx.openSetting({
                                    success: function (data) {
                                        if (data.authSetting["scope.userLocation"] === true) {
                                            app.ShowToast("授权成功")
                                        } else {
                                            app.ShowToast("授权失败，请重新点击")
                                        }
                                    }
                                })
                            }else{app.ShowToast("授权失败，请重新点击")}
                        },
                    })
                }
            }
        });
        var that = this;
        wx.chooseLocation({
            success: function (res) {
                that.setData({
                    address: res.name,      //调用成功直接设置地址
                    longitude:res.longitude,
                    latitude:res.latitude
                })
            }
        })
    },
    TimeChange(e) {
        this.setData({
            time: e.detail.value
        })
    },
    SubwayChange(e) {
        this.setData({
            subway: this.data.subway_list[e.detail.value]
        })
    },
    DateChange(e) {
        this.setData({
            date: e.detail.value
        })
    },
    TagChoose(e) {
        var key = e.target.dataset.key;
        var facilities = this.data.facilities;
        facilities[key].is_active = !facilities[key].is_active;
        this.setData({
            facilities: facilities
        })
    },
    houseType(e) {
        var key = e.target.dataset.key;
        this.setData({
            cur_house_type: key
        })
    },
    rentType(e) {
        var key = e.target.dataset.key;
        this.setData({
            cur_rent_type: key
        })
    },
    RegionChange: function (e) {
        var region = e.detail.value;
        this.setData({
            region: region,
            subway_list:[],
            select_origin:true
        });
        var data = {'city':region[1]};
        app.WxHttpRequestGet('house/selects',data,this.ParamsDone)
    },
    ParamsDone(res){
        var subway = res.data.subway
        var subwaylist = [];
        for(var s in subway){
            subwaylist.push(s)
        }
        if(subwaylist.length>0){
            this.setData({
                subway_list:subwaylist,
                have_subway:true
            });
        }else{
            this.setData({
                have_subway:false
            })
        }
        wx.hideLoading()
    },
    GetOssDone(res){
        this.setData({
            oss: res.data.data
        })
    },
    OssSign: function (e) {
    },
    fileupload: function (oss,filename, url) {
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
    submitBtn: function (e) {
        var that = this;
        wx.showModal({
            title: '确认提示',
            content: '确认发布吗房源',
            success: function(res) {
                if(res.confirm){
                    var  formId = e.detail.formId;
                    var wxdata = that.data;
                    const params = e.detail.value;
                    params['house_type'] = wxdata.cur_rent_type;
                    params['address'] = wxdata.address;
                    params['apartment'] = wxdata.cur_house_type;
                    params['subway'] = wxdata.subway;
                    params['checkin'] = wxdata.date;
                    params['region'] = wxdata.region;
                    params['imgs'] = wxdata.urls;
                    params['latitude'] = wxdata.latitude;
                    params['longitude'] = wxdata.longitude;
                    if (!that.WxValidate.checkForm(params)) {
                        const error = that.WxValidate.errorList[0];
                        that.showModal(error);
                        return false
                    }
                    var region_place = params['region'][2];
                    if(!region_place){
                        app.ShowModel('操作错误','请选择房源具体区域');
                        return false
                    }
                    app.wxshowloading('房源发布中...');
                    var tags = [];
                    var faci = wxdata.facilities;
                    for (var tag in faci) {
                        if (faci[tag].is_active) {
                            tags.push(tag)
                        }
                    }
                    params['tags'] = tags;
                    params['formId'] = formId;
                    var temprory = that.data.temporary_imgs;
                    if(temprory){
                        params['img'] = temprory
                        app.WxHttpRequestPOST('house/house_add',params,that.AjaxDone,that.AjaxError)
                    }else{
                        that.OssUpload('house/', wxdata.urls).then(function (urls) {
                            that.setData({
                                temporary_imgs:urls
                            });
                            params['img'] = urls;
                            app.WxHttpRequestPOST('house/house_add',params,that.AjaxDone,that.AjaxError)
                        })
                    }
                }
            }
        })
    },

    AjaxDone(res){
        var that = this;
        var data = res.data;
        wx.hideLoading()
        if (data.code === 200) {
            app.ShowModel( '恭喜！房源发布成功!', '审核过程大概2分钟!')
            that.setData({
                form:{},
                cur_house_type:"",
                cur_rent_type:"",
                address:"",
                subway:"",
                urls:[],
                apartment: BASE.base.apartment,
                facilities: BASE.base.facilities,
                house_type: BASE.base.house_type
            });
            setTimeout(function () {
                wx.redirectTo({
                    url: '/pages/index/index'
                })
            },2000)
        } else {
            app.ShowModel( '错误', data.msg)
        }
        wx.hideLoading()
    },
    AjaxError(res){
        app.ShowModel('网络错误','请检查你的网络，请稍后再试~')
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
                number: true,
                min: 1,
                max: 100
            },
            area: {
                number: true,
                min: 1,
                max: 500
            },
            desc: {
                required: true,
                maxlength: 300,
                minlength: 5
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
            imgs: {
                required: true,
            }
        }
        const messages = {
            title: {
                required: '标题必须要填写',
                maxlength: '标题最多20个字符',
                minlength:'标题至少2个字符'
            },
            price: {
                required: '请输入房租',
                number: '租金格式错误',
                max:"不支持太高价格房源",
                min:'房源价格错误'
            },
            storey: {
                required: '请输入楼层',
                number: '楼层请输入整数',
                max: '房高得离谱，换个试试吧！',
                min: '楼层错误'
            },
            imgs: {
                required: '请上传房源图片'
            },
            address: {
                required: '请选择详细地址'
            },
            area: {
                required: '请输入房源面积',
                number: '面积请输入整数',
                min: '面积输入错误，请重试~',
                max: '暂不支持>500平房源'
            },
            desc: {
                required: '请简要描述下你的房源',
                maxlength: '简介过长',
                minlength:'简介太短啦'
            },
            house_type: {
                required: '请选择户型'
            },
            apartment: {
                required: '请选择租房类型'
            }
        }
        this.WxValidate = new WxValidate(rules, messages)
    },
    CheckDone(res){
        var data = res.data;
        if(data.code == 400){
            app.ShowToast(data.msg);
            setTimeout(function () {
                wx.navigateBack({//返回
                    delta: 1
                })
            },1500)
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        app.wxshowloading('');
        this.setData({
            region:[app.globalData.province,app.globalData.city,app.globalData.district]
        })
        app.WxHttpRequestGet('house/add_check',{},this.CheckDone,app.InterError)
        this.initValidate();
        this.OssSign();
        var data = {'city': app.globalData.city};
        app.WxHttpRequestGet('house/selects',data,this.ParamsDone)
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
