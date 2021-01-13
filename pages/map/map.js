// pages/sxauguide/nyistguide.js
const app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        ishow: true,
        markers: [],
        latitude: 39.913164,
        longitude: 116.405706,
        showDialog: false,
        scale: 10,
        active_house: {},
        house_map: {}
    },
    GetHousesDone(res) {

    },
    onShow: function () {

    },
    toggleDialog: function () {
        this.setData({
            showDialog: false,
        })
    },
    onLoad: function (options) {
        let self = this;
        app.wxshowloading('房源准备中...');
        wx.request({
            url: app.globalData.api_host+'/house_map/?is_json=1&city=' + app.globalData.city,
            success: function (res) {
                let result = res.data;
                let houses = result.data.houses;
                let lng_lat = result.data.lng_lat;
                let markers = [];
                let house_map = {}
                for (let i = 0; i < houses.length; i++) {
                    house_map[houses[i].id] = houses[i]
                    markers.push({
                        iconPath: '/image/icon/map.png',
                        latitude: houses[i].latitude,
                        longitude: houses[i].longitude,
                        width: 30,
                        id: houses[i].id,
                        height: 30,
                        // label: {
                        //   content: houses[i].title,
                        //   color: '#22ac38',
                        //   fontSize: 14,
                        //   bgColor: "#fff",
                        //   borderRadius: 30,
                        //   borderColor: "#22ac38",
                        //   borderWidth: 1,
                        //   padding: 3
                        // },
                        callout: {
                            content: houses[i].title,
                            fontSize: 0,
                        }
                    })
                }
                self.setData({
                    scale: 10,
                    markers: markers,
                    house_map: house_map,
                    longitude: lng_lat['lng'],
                    latitude: lng_lat['lat'],
                })
                wx.hideLoading()
            }

        })
    },
    markertap(e) {
        let house = this.data.house_map[e.markerId]
        this.setData({
            showDialog: true,
            active_house: house,
        })
    },
    DetailShow(e) {

    },
    ToBuilding(e) {

    },
    // 校门
})