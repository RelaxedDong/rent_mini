// pages/userinfo/userinfo.js
import WxValidate from "../../utils/WxValidate";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      age: "",
      wechat: "",
      phone: "",
      signature: "",
    },
    gender: '1'
  },
  initValidate() {
    const rules = {
      phone: {
        required: true,
        maxlength: 11,
        minlength: 11
      },
      wechat: {
        required: true,
        maxlength: 40,
        minlength: 5
      },
      age: {
        required: true,
      },
    };
    const messages = {
      wechat: {
        required: '请输入微信号',
        maxlength: '微信号错误，请重新输入',
        minlength:'微信号错误，请重新输入'
      },
      phone: {
        required: '请输入手机号',
        maxlength: '手机号错误，请重新输入',
        minlength:'手机号错误，请重新输入'
      },
      age: {
        required: '请输入年龄',
      },

    }
    this.WxValidate = new WxValidate(rules, messages)
  },
  GenderChange(e){
    this.setData({
      gender: e.detail.value==true?'1':'2'
    })
  },
  /**
   * @return {boolean}
   */
  EditFinish(e){
    var that = this;
    var params = e.detail.value;
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0];
      app.ShowModel('错误',error.msg);
      return false
    }
    params['gender'] = this.data.gender;
    app.wxshowloading('信息更改中...');
    app.WxHttpRequestPOST('account/edit_info',params,that.EditDone, app.InterError)
  },
  EditDone(res){
    var data = res.data;
    if(data.code == 200){
      var pre = app.getPrepage();
      pre.setData({
        change_user_info: true
      });
      app.globalData.finish_user_info = true;
      app.ShowToast("信息编辑成功！");
      setTimeout(function () {
        wx.navigateBack();
      },1500)
    }else{
      app.ShowModel( '错误',data.msg)
    }
    wx.hideLoading()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.wxshowloading('资料加载中...');
    app.WxHttpRequestGet('account/edit_info',{},that.GetUesrInfoDone, app.InterError);
    this.initValidate();
  },
  GetUesrInfoDone(res){
    var data = res.data.data;
    var form = this.data.form;
    form['phone'] = data.phone;
    form['wechat'] = data.wechat;
    form['age'] = data.age;
    form['signature'] = data.signature;
    this.setData({
      gender:data.gender,
      form: form
    })
    wx.hideLoading()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getPhoneNumber (e) {
    var iv = e.detail.iv;
    var encryptedData = e.detail.encryptedData;
    if(encryptedData && iv){
      app.WxHttpRequestPOST('account/phone', {iv:iv,encryptedData:encryptedData}, this.BindPhoneDone, app.InterError);
    }
  },
  BindPhoneDone(res){
    var data = res.data;
    if(data.code == 200){
      app.ShowToast("手机号绑定成功！");
      var form = this.data.form;
      console.log(this.data.form)
      form['phone'] = data.data;
      this.setData({
        form: form
      })
    }else{
      app.ShowModel('获取错误',data.msg);
    }
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
