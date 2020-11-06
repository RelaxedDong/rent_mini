// pages/list/list.js
const app = getApp();
const CHINA = require('../../utils/china_city');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        dropDownMenuTitle: [],
        dropDownMenuFirstData: [],
        dropDownMenuRegion: [
            {"name": "区域", title: 'region', components: []},
            {"name": "地铁", title: 'subway', components: []},
        ],
        dropDownMenuThirdData: [],
        dropDownMenuFourthData: [],//排序数据
        subway: [],
        apartment_list: [],
        house_type_list: [],
        /* 筛选条件 end */
        show_empty: false,
        scrollHeight: 0,
        animation: '',
        page: 0,
        topNum: 0,
        fiexed_top: 0,
        conditions: {},
        filter_conf: {},
        searchinput: "",
        houses: [],
        has_next: true,
        clear: false,
        //是否悬停
    },
    GoToTop(e) {
        this.setData({
            topNum: 0
        })
    },
    SearchCallback(res) {
        let resp = res.data;
        if(resp.code === 200){
            var page = this.data.page;
            var houses = resp.data.houses;
            var houes_length = houses.length;
            if (houes_length > 0) {
                let setData = {
                    page: page+1,
                    [`houses[${page}]`]: houses
                }
                if(houes_length === 10) {
                    setData['has_next'] = true
                }
                this.setData(setData)
            } else {
                this.setData({
                    has_next: false,
                    show_empty: true,
                })
                app.ShowToast('没有更多了...');
            }
        } else {
            app.ShowToast(resp.msg);
        }
    wx.hideLoading()
    },
    handleClick: function (e) {
        app.handlehouseClick(e.currentTarget.dataset.id)
    },
    AddressClick(e) {
        var address = e.currentTarget.dataset.address;
        this.setData({
            searchinput: address
        })
        this.ChildInputValueHanle({'detail': address})
    },
    SearchList: function (e) {
        var search_list = e.detail;
        this.setData({
            search_list: search_list
        })
    },
    ChildInputValueHanle: function (e) {
        this.setData({
            searchinput: e.detail
        });
        var conditions = this.get_conditions()
        this.setData({
            page: 0,
            conditions: conditions,
            houses: []
        });
        this.GoToTop()
        this.get_house_list(conditions, 0)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    ParamsDone(res) {
        let resp = res.data;
        if (resp.code === 200) {
            var province = app.globalData.province;
            var city = app.globalData.city;
            var that = this;
            this.getcities(province, city).then(function (regions) {
                var region_key = 'dropDownMenuRegion[0].components'
                var subway_key = 'dropDownMenuRegion[1].components'
                var filter_conf = resp.data.filter_conf;
                that.setData({
                    [region_key]: regions,
                    [subway_key]: resp.data.subway,
                    dropDownMenuFourthData: filter_conf['dropDownMenuFourthData'],
                    dropDownMenuThirdData: filter_conf['dropDownMenuThirdData'],
                    dropDownMenuFirstData: filter_conf['dropDownMenuFirstData'],
                    dropDownMenuTitle: filter_conf['dropDownMenuTitle'],
                    apartment_list: resp.data.apartment,
                    house_type_list: resp.data.house_type,
                })
            })
        }
    },
    get_conditions(){
        let conditions = this.data.conditions;
        conditions['city'] = app.globalData.city
        conditions['title'] = this.data.searchinput
        return conditions
    },
    get_house_list(conditions, page=0) {
        // 统一获取房源列表接口
        app.wxshowloading('');
        app.WxHttpRequestGet('house/search?page=' + page, conditions, this.SearchCallback, app.InterError);
    },
    selectedFourth: function (e) {
        var filter_conf = this.data.filter_conf;
        let conditions = this.get_conditions()
        filter_conf[e.detail.index] = e.detail.selectedValue
        conditions['filter_conf'] = filter_conf
        this.setData({
            filter_conf: filter_conf,
            conditions: conditions,
            houses: [],
            page: 0,
        })
        this.GoToTop()
        this.get_house_list(conditions, 0)
    },
    onLoad: function (options) {
        // todo: 基础card跳转
        var that = this;
        let query = wx.createSelectorQuery();
        let conditions = this.data.conditions;
        conditions['city'] = app.globalData.city
        conditions['title'] = this.data.searchinput
        // 拼接从首页跳转过来的card参数，直接合并
        let result_conditions = Object.assign(conditions, options)
        this.setData({
            conditions: result_conditions
        })
        this.get_house_list(result_conditions)
        let city = app.globalData.city
        app.WxHttpRequestGet('house/selects', {'city': city}, that.ParamsDone, app.InterError)
        query.select('#filter_bar').boundingClientRect()
        query.exec(function (res) {
            var height = res[0].height;
            that.setData({
                placeholder: city,
                fiexed_top: height + 10,
                scrollHeight: app.globalData.windowHeight + 30
            });
        });
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    getcities(pro, city) {
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
    bindscrolltolower: function () {
        var has_next = this.data.has_next;
        if (has_next) {
            var page = this.data.page;
            var conditions = this.get_conditions()
            this.get_house_list(conditions, page)
        }
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    showDialog: function (e) {

    },
    //取消事件
    _cancelEvent: function (e) {
        this.dialog.hideDialog();
    },
    //确认事件
    _confirmEvent: function (e) {
        this.dialog.hideDialog();
    }
})
