// components/select-form/select-form.js
const app = getApp();
Component({

  /**
   * 页面的初始数据
   */
  properties:{
    selectType:{
      type: String,
      value: 'regions',
    },
    formselects:{
      type:JSON,
      value:{},
      observer: function (newVal, oldVal, changedPath) {
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
        this.setData({
          formselects:newVal
        })
      },
    },
    clearfilters: {
      type:Boolean,
      value:false,
      observer: function (newVal, oldVal, changedPath) {
          this.setData({
            filters:{},
          })
      },
    },
    lastConditions:{
      type:Object,
      value: {},
    }
  },
  data: {
    show_regions:true,
    ActiveColor:true,
    price:0,
    start: 0,
    end: 1000,
    filters:{}
  },
  methods:{
    RigionsClick(e){
      this.setData({
        show_regions:true,
        ActiveColor:true
      })
    },
    SubwayClick(e){
      this.setData({
        show_regions:false,
        ActiveColor:false
      })
    },
    RigionsselectClick(e){
      console.log(e)
      var dataset = e.currentTarget.dataset;
      var value = dataset['value'];
      var key = dataset['key'];
      var filters = this.data.filters;
      filters[key] = value;
      this.setData({
        filters:filters
      });
      this.triggerEvent('SelectEvent',{'key':key,
      'value':value});
    },
    slider2change(e){
      var money = e.detail.value * 20;
      var start = (money - 1000>0)?money-1000:0;
      var end = (money + 1000 >= 7000) ? "不限" : money + 1000;
      this.setData({
        price:  money,
        start:start ,
        end: end
      });
      this.setData({
          ['filters.price']:money
      });
      this.triggerEvent('SelectEvent', {'key':'price','value':[start,end]});
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
});
