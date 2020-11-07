// components/swiper/swiper.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true,
  },
  externalClasses: ['col-class'],
  properties: {
    "swiper_style":{
      type:String,
      value: 'card-swiper',
    },
    "imgs_list": {
      type: Object,
      value: {}
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    cardCur: 0,
    DotStyle: 0,
    duration: 0,
    interval: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    HandleClick(res){
      wx.navigateTo({
        url: res.currentTarget.dataset.navigate
      })
    },
    intervalChange(e) {
      this.setData({
        interval: e.detail.value
      })
    },
    durationChange(e) {
      this.setData({
        duration: e.detail.value
      })
    },
      DotStyle(e) {
      this.setData({
        DotStyle: e.detail.value
      })
    },
    cardSwiper(e) {
      this.setData({
        cardCur: e.detail.current
      })
    },
  }
})
