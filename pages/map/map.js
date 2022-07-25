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
        location_auth: false,
        scale: 14,
        active_house: {},
        house_map: {}
    },
    openLocation() {
        let self = this;
        wx.openSetting({
            success: function (data) {
                if (data.authSetting["scope.userLocation"] === true) {
                    app.ShowToast("位置授权成功")
                    self.setData({location_auth: true})
                    self.get_map_houses()
                } else {
                    app.ShowToast("授权失败，请重新点击")
                }
            }
        })
    },
    GetHousesDone(res) {

    },
    onShow: function () {
        var new_city = app.globalData.index_new_city;
        if (new_city) {
            this.onLoad()
        }
    },
    toggleDialog: function () {
        this.setData({
            showDialog: false,
        })
    },
    onLoad: function (options) {
        if(!app.globalData.index_new_city) {
            wx.showModal({
              title: '当前选择城市',
              content: app.globalData.city,
              confirmText: '知道了',
              cancelText: '切换城市',
              success: function (res) {
                  if (!res.confirm) {
                      wx.navigateTo({
                        url: '/pages/city/city'
                    })
                  }
              }
          })
        }
        let self = this;
        wx.getSetting({
            success: function (res) {
                var status = res.authSetting;
                self.setData({location_auth: status['scope.userLocation']})
                if (status['scope.userLocation']) {
                    // app.wxshowloading('');
                    self.get_map_houses()
                }
        }})
    },
    regionchange (e) {
        if (e.causedBy === 'drag') {
            app.wxshowloading('')
            var that = this;
            this.mapCtx = wx.createMapContext("map");
            this.mapCtx.getCenterLocation({
                type: 'gcj02',
                success: function (res) {
                    that.get_map_houses(res.latitude, res.longitude)
                }
            })

        }
    },
    get_map_houses(lat="", lng="") {
        let self = this;
        wx.getLocation({
            type: 'wgs84',
            success: function (res) {
            console.log(res)
            var latitude = lat?lat:res.latitude;
            var longitude = lng?lng:res.longitude;
            app.WxHttpRequestGet('house/nearby_houses',
            {
                city: app.globalData.city,
                from_map: true,
                location_conf: JSON.stringify({'longitude': longitude, 'latitude': latitude})
            }
            , function (resp) {
                let result = resp.data;
                let houses = result.data.houses;
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
                        callout: {
                            content: houses[i].title,
                            fontSize: 0,
                        }
                    })
                }
                self.setData({
                    scale: 14,
                    markers: markers,
                    house_map: house_map,
                    longitude: longitude,
                    latitude: latitude,
                })
                wx.hideLoading()
            })
        },
            fail: function (res) {
                console.log(res)
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