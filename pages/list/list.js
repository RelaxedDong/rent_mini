// pages/list/list.js
const app = getApp();
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
        //是否悬停
    },
    GoToTop(e) {
        this.setData({
            topNum: 0
        })
    },
    SearchCallback(res) {
        let resp = res.data;
        if (resp.code === 200) {
            var page = this.data.page;
            var houses = resp.data.houses;
            var houes_length = houses.length;
            if (houes_length > 0) {
                let setData = {
                    page: page + 1,
                    [`houses[${page}]`]: houses
                }
                if (houes_length === 10) {
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
    matchClick(e) {
        this.setData({
            searchinput: e.currentTarget.dataset.value
        });
        var conditions = this.get_conditions()
        this.setData({
            page: 0,
            conditions: conditions,
            houses: [],
            search_list: [],
        });
        this.GoToTop()
        this.get_house_list(conditions, 0)
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
    initSearchComponent() {
        var filter_conf = app.globalData.filter_conf
        var region_key = 'dropDownMenuRegion[0].components'
        var subway_key = 'dropDownMenuRegion[1].components'
        this.setData({
            [region_key]: filter_conf['regions'],
            [subway_key]: filter_conf['subway_list'],
            dropDownMenuFourthData: filter_conf['dropDownMenuFourthData'],
            dropDownMenuThirdData: filter_conf['dropDownMenuThirdData'],
            dropDownMenuFirstData: filter_conf['dropDownMenuFirstData'],
            dropDownMenuTitle: filter_conf['dropDownMenuTitle'],
            apartment_list: filter_conf['apartment_list'],
            house_type_list: filter_conf['house_type_list'],
        })
        console.log(filter_conf)
    },
    get_conditions() {
        let conditions = this.data.conditions;
        conditions['city'] = app.globalData.city
        conditions['title'] = this.data.searchinput
        return conditions
    },
    get_house_list(conditions, page = 0) {
        // 统一获取房源列表接口
        // app.wxshowloading('');
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
            search_list: [],
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
        wx.setNavigationBarTitle({title: app.globalData.city + "房源搜索"})
        // 拼接从首页跳转过来的card参数，直接合并
        let result_conditions = Object.assign(conditions, options)
        this.setData({conditions: result_conditions})
        this.get_house_list(result_conditions)
        query.select('#filter_bar').boundingClientRect()
        query.exec(function (res) {
            var height = res[0].height;
            that.setData({
                placeholder: result_conditions.title||'输入关键字，搜索'+app.globalData.city+' 房源...',
                searchinput: result_conditions.title,
                fiexed_top: height + 10,
                scrollHeight: app.globalData.windowHeight + 30
            });
        });
        this.initSearchComponent()

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
    onShareAppMessage: function (res) {
        var path = '/pages/index/index'
        return {
            title: "蚁租房|快速的找房租房平台",
            path: path,
            imageUrl: "", // 分享的封面图
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
