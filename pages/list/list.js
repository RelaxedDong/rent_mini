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
        page: 1,
        topNum: 0,
        fiexed_top: 0,
        conditions: {},
        searchinput: "",
        houses: [],
        has_next: true,
        clear: false,
        //是否悬停
    },
    RegionChange: function (e) {
        this.setData({
            region: e.detail.value
        })
    },
    ClearFilters(e) {
        app.wxshowloading('拼命加载中...');
        var city = app.globalData.city
        var input = this.data.searchinput;
        this.setData({
            page: 1,
            houses: []
        });
        this.GoToTop()
        if (input) {
            app.WxHttpRequestGet('house/search', {
                'title': input,
                'city': city
            }, this.SearchCallback);
        } else {
            app.WxHttpRequestGet('house/search', {'city': city}, this.SearchCallback, app.InterError);
        }
    },
    GoToTop(e) {
        this.setData({
            topNum: 0
        })
    },
    SearchCallback(res) {
        var page = this.data.page + 1;
        var houses = res.data.houses;
        var houes_length = houses.length;
        var search_count = res.data.count;
        if (houes_length > 0) {
            this.setData({
                has_next: true,
                house_count: search_count,
                page: page,
                [`houses[${this.data.page}]`]: houses
            })
        } else {
            this.setData({
                has_next: false,
                show_empty: true,
                house_count: search_count
            })
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
        var data = e.detail;
        app.wxshowloading('拼命加载中...');
        this.setData({
            searchinput: data
        });
        var conditions = this.data.conditions;
        conditions['city'] = app.globalData.city;
        conditions['title'] = data;
        this.setData({
            page: 1,
            conditions: conditions,
            houses: []
        });
        this.GoToTop()
        app.WxHttpRequestGet('house/search', conditions, this.SearchCallback, app.InterError);
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
                console.log(that.data.dropDownMenuRegion)
            })
        }
    },
    onLoad: function (options) {
        var that = this;
        let query = wx.createSelectorQuery();
        app.wxshowloading('拼命加载中...');
        var city = app.globalData.city;
        var condition = {'city': city};
        if (options.type) {
            condition['house_type'] = options.type
        }
        app.WxHttpRequestGet('house/search', condition, that.SearchCallback);
        app.WxHttpRequestGet('house/selects', {'city': city}, that.ParamsDone, app.InterError)
        query.select('#filter_bar').boundingClientRect()
        query.exec(function (res) {
            var height = res[0].height;
            that.setData({
                placeholder: city,
                fiexed_top: height + 10,
                scrollHeight: app.globalData.windowHeight + 30,
                conditions: condition
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
            app.wxshowloading('房源加载中');
            var page = this.data.page;
            var condition = this.data.conditions
            app.WxHttpRequestGet('house/search?page=' + page, condition, this.SearchCallback, app.InterError)
        } else {
            app.ShowToast('没有更多了...')
        }
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    selectedFourth: function (e) {
        console.log("选中第" + e.detail.index + "个标签，选中的id：" + e.detail.selectedId + "；选中的内容：" + e.detail.selectedTitle);
    },
    showDialog: function (e) {

    },
    //取消事件
    _cancelEvent: function (e) {
        console.log('你点击了取消');
        this.dialog.hideDialog();
    },
    //确认事件
    _confirmEvent: function (e) {
        console.log('你点击了确定');
        this.dialog.hideDialog();
    }
})
