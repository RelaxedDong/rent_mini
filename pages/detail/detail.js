const app = getApp();
var log = require('../../utils/log.js') // 引用上面的log.js文件
Page({
    data: {
        api_host: app.globalData.api_host,
        color_list: app.globalData.color_list,
        facilities: [],
        house: [],
        is_favor: false,
        is_collect: false,
        authModal: false,
        is_loading: true,
        in_scene: false,
        house_not_exist: false,
    },
    bindinput(e) {
        var content = e.detail.detail.value;
        this.setData({
            content: content
        });
    },
    bindImageLoadError(e) {
        let index = e.currentTarget.dataset.index;
        let imglist = this.data.imglist;
        imglist[index] = app.globalData.error_image;
        this.setData({imglist: imglist});
    },
    appointDone(res) {
        app.ShowToast(res.data.msg);
        this.hideModal();
    },
    click_check() {
        let now = new Date();
        let hour = now.getHours();
        return !(hour < 7 || hour > 23);
    },
    hideModal(e) {
        this.setData({
            authModal: false
        });
    },
    /**
     * @return {boolean}
     */
    Mycopy(e) {
        wx.setClipboardData({
            data: e.currentTarget.dataset.value,
            success: function (res) {
                wx.getClipboardData({
                    success: function (res) {
                        app.ShowModel('操作成功',
                            '链接复制成功'
                        );
                    }
                });
            }
        });
    },
    WechatCopyClick(e) {
        if (!app.globalData.user_id) {
            this.setData({
                authModal: true
            });
            return false;
        }
        let can_operation = this.click_check();
        if (!can_operation) {
            app.ShowToast('8点后才能进行操作哦~');
            return;
        }
        if (!e.currentTarget.dataset.wechat) {
            app.ShowToast('用户未公开哦~');
            return;
        }
        wx.setClipboardData({
            data: e.currentTarget.dataset.wechat,
            success: function (res) {
                wx.getClipboardData({
                    success: function (res) {
                        app.ShowModel('操作成功',
                            '微信复制成功'
                        );
                    }
                });
            }
        });
    },
    Showmap(e) {
        var dataset = e.currentTarget.dataset;
        var latitude = dataset.houseLatitude;
        var longitude = dataset.houseLongitude;
        wx.openLocation({
            longitude: Number(longitude),
            latitude: Number(latitude),
            scale: 15, // 缩放比例
            fail(res) {
                console.log(res)
            }
        });
    },
    login(e) {
        app.user_info_bind(this, e, this.data.house.publisher.phone)
    },
    OperationClick(e) {
        if (!app.globalData.user_id) {
            this.setData({
                authModal: true
            });
            return;
        }
        var dataset = e.currentTarget.dataset;
        var houseId = dataset.houseId;
        if (!houseId) {
            app.ShowToast('房源不存在了')
        }
        var type = dataset.type;
        if (type === 'favor') {
            this.setData({
                is_favor: !this.data.is_favor
            })
        } else {
            this.setData({
                is_collect: !this.data.is_collect
            });
        }
        var request_data = {houseId: houseId, operation_type: type}
        app.WxHttpRequestPOST('account/operation', request_data, this.HandleOperationDone)
    },
    HandleOperationDone(res) {
        if (!app.globalData.user_id) {
            this.setData({
                authModal: true
            })
            return false
        }
        var type = res.data.data;
        var favor_counts = this.data.favor_counts;
        var collect_counts = this.data.collect_counts;
        if (type === 'favor') {
            favor_counts += 1
        }
        if (type === 'unfavor') {
            favor_counts -= 1
        }
        if (type === 'collect') {
            collect_counts += 1
        }
        if (type === 'uncollect') {
            collect_counts -= 1
        }
        this.setData({
            favor_counts: favor_counts,
            collect_counts: collect_counts,
        })
    },
    BindUserInfoDone(res) {
        var data = res.data;
        if (data.code === 200) {
            app.ShowModel('恭喜授权成功', '房源曝光展示中，可在个人中心里进行房源~');
            app.globalData.user_id = data.data.user_id;
            this.setData({
                authModal: false,
                in_scene: false,
            })
            this.onLoad({
                house: this.data.house_id,
            })
            setTimeout(function () {
                wx.switchTab({
                    url: '/pages/index/index'
                });
            }, 5000)
        } else {
            app.ShowToast(data.msg)
        }
    },
    make_call(e) {
        if (!app.globalData.user_id) {
            this.setData({
                authModal: true
            })
            return false
        }
        if (!e.currentTarget.dataset.phone) {
            app.ShowToast('用户未公开哦~');
            return
        }
        let can_operation = this.click_check();
        if (!can_operation) {
            app.ShowToast('8点后才能进行操作哦~');
            return
        }
        wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.phone
        })
    },
    HandleImgClick(e) {
        var dataset = e.target.dataset;
        var urls = dataset['urls'];
        var current = dataset['currenturl'];
        wx.previewImage({
            current: current, // 当前显示图片的http链接
            urls: urls // 需要预览的图片http链接列表
        })
    },
    swiperchange: function (detail) {
        if (detail.detail.source == "touch") {
            //当页面卡死的时候，current的值会变成0
            if (detail.detail.current == 0) {
                //有时候这算是正常情况，所以暂定连续出现3次就是卡了
                let swiperError = this.data.swiperError;
                swiperError += 1;
                this.setData({swiperError: swiperError});
                if (swiperError >= 3) { //在开关被触发3次以上
                    this.setData({currentIndex: this.data.preIndex});//，重置current为正确索引
                    this.setData({swiperError: 0})
                }
            } else {//正常轮播时，记录正确页码索引
                this.setData({preIndex: detail.detail.current});
                //将开关重置为0
                this.setData({swiperError: 0})
            }
        }
    },
    searchbtnclick: function (e) {
        wx.navigateTo({
            url: '/pages/list/list'
        })
    },
    HandleGetDone(res) {
        const that = this;
        var resp = res.data;
        console.log(resp.code)
        if (resp.code === 200) {
            var house_data = resp.data;
            var house = house_data.house
            var facilities_conf = house_data.facilities_list;
            for (let i = 0; i < house.facilities.length; i++) {
                facilities_conf[house.facilities[i]].is_active = true
            }
            that.setData({
                house_id: house.id,
                house: house,
                markers: [{
                    iconPath: "/image/icon/location.png",
                    latitude: house.latitude,
                    longitude: house.longitude,
                    id: 1
                }],
                imglist: house.imgs,
                user_favors: house.user_favors,
                user_collects_avatar: house.user_collects_avatar,
                facilities: facilities_conf,
                is_favor: house_data.is_favor,
                is_collect: house_data.is_collect,
                is_loading: false,
            });
            wx.setNavigationBarTitle({
                title: house.title
            })
        } else if (resp.code === 404) {
            app.ShowToast('房源已经删除~');
            that.setData({
                is_loading: false,
                house_not_exist: true,
            })
        } else {
            app.ShowModel('错误', resp.msg)
        }
    },
    toIndex() {
        wx.switchTab({
            url: '/pages/index/index'
        });
    },
    onShareAppMessage: function (res) {
        var path = '/pages/detail/detail?house=' + this.data.house_id;
        return {
            title: this.data.house.title,
            path: path,
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
    onShow: function (e) {
    },
    DetailOnload(options) {
        var house_id = options.house;
        app.WxHttpRequestGet('house/detail/' + house_id, {}, this.HandleGetDone)
    },
    onLoad: function (options) {
        log.info(options)
        var that = this;
        var user_id = app.globalData.user_id;
        if (!user_id) {
            app.MinaLogin().then(function (res) {
                app.globalData.jwt_token = res.data.data.token;
                app.globalData.user_id = res.data.data.user_id;
                that.DetailOnload(options)
            })
        } else {
            that.DetailOnload(options)
        }
    }
});
