var app = getApp();
Page({
  data: {
    textareaVal: '',
    inputVal: '',
  },
  onLoad: function (options) {
  },
  //添加图片
  textareaVal: function (event) {
    this.setData({
      textareaVal: event.detail.value
    })
  },
  //联系电话
  inputVal: function (event) {
    this.setData({
      inputVal: event.detail.value
    })
  },
  //提交
  confirm: function () {
    var textareaVal = this.data.textareaVal;
    var inputVal = this.data.inputVal;
    if (!textareaVal) {
      app.ShowModel('提示', '请输入完整反馈信息');
      return false;
    }
    if (!inputVal) {
      app.ShowModel('提示', '请输入微信号码');
      return false;
    }
    app.WxHttpRequestPOST('account/user_feedback', {content:textareaVal,wechat:inputVal}, this.FeedDone, app.InterError);
  },
  FeedDone(res){
    var data = res.data;
    if(data.code == 200){
      app.ShowToast('提交成功，我们将尽快处理！...');
      setTimeout(function () {
        wx.navigateBack();
      },1500)
    }else{

    }
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})