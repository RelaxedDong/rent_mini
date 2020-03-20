import WxValidate from '../../utils/WxValidate.js'
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    form: {
      title: "",
      price: "",
      area: "",
      desc: "",
    },
  },
  initValidate(){
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
      area: {
        number: true,
        min: 1,
        max: 500
      },
      desc: {
        required: true,
        maxlength: 400,
        minlength: 20
      },
    }
    const messages = {
      title: {
        required: '标题必须要填写',
        maxlength: '标题最多20个字符',
        minlength:'标题至少5个字符'
      },
      price: {
        required: '请输入房租',
        number: '租金格式错误',
        max:"房源价格错误",
        min:'房源价格错误'
      },
      area: {
        required: '请输入房源面积',
        number: '面积请输入整数',
        min: '面积输入错误，请重试~',
        max: '面积输入错误，请重试~'
      },
      desc: {
        required: '请简要描述下你的房源',
        maxlength: '简介过长',
        minlength:'简介太短啦'
      }
    }
    this.WxValidate = new WxValidate(rules, messages)
  },
  submitBtn(e){
    const params = e.detail.value;
    var that = this;
    if (!that.WxValidate.checkForm(params)) {
      const error = that.WxValidate.errorList[0];
      app.ShowModel('错误', error.msg);
      return false
    }
    params['houseid'] = this.data.house.id;
    app.WxHttpRequestPOST('house/house_edit', params, this.EditDone, app.InterError);
  },
  EditDone(res){
    var data = res.data;
    app.ShowToast(data.msg);
    if(data.code == 200){
      this.setData({
        title:data.data
      })
    }
  },
  ToDetail(res){
    app.handlehouseClick(this.data.house.id)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.initValidate();
    const eventChannel = that.getOpenerEventChannel();
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      var house = data.data;
      var form = that.data.form;
      form['desc'] = house.desc;
      form['title'] = house.title;
      form['price'] = house.price;
      form['area'] = house.area;
      that.setData({
        house: house,
        form: form,
        title: house.title,
      })
    })
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
