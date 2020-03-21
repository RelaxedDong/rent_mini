const app = getApp();
Page({
  data: {
    formats: {},
    bottom: 0,
    add_wechat:false,
    add_phone:false,
    readOnly: false,
    placeholder: '介绍一下动态的详情吧，支持文字和图片...',
    _focus: false,
    rent_type_list:['求租', '出租', '转租']
  },
  CanAddwexin(){
    this.setData({
      add_wechat:!this.data.add_wechat
    })
  },
  CanAddmakecall(){
    this.setData({
      add_phone:!this.data.add_phone
    })
  },
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  TypeChange (e) {
    this.setData({
      rent_type:this.data.rent_type_list[e.detail.value]
    })
  },
  onLoad() {
    app.WxHttpRequestGet('house/add_check',{},this.CheckDone,app.InterError);
    this.setData({
      region:[app.globalData.province,app.globalData.city,app.globalData.district]
    })
  },
  RegionChange: function (e) {
    var region = e.detail.value;
    let raw_region = this.data.region;
    if(region[0]!==raw_region[0]||region[1]!==raw_region[1]){
      app.ShowToast('只能切换'+raw_region[1]+'区域哦~');
      return
    }
    this.setData({
      region:[app.globalData.province,app.globalData.city,region[2]]
    });
    app.globalData.district = region[2]
  },
  // 编辑器初始化完成时触发
  onEditorReady() {
    const that = this;
    wx.createSelectorQuery().select('#editor').context(function(res) {
      that.editorCtx = res.context;
    }).exec();
  },
  undo() {
    this.editorCtx.undo();
  },
  redo() {
    this.editorCtx.redo();
  },
  format(e) {
    let {
      name,
      value
    } = e.target.dataset;
    if (!name) return;
    // console.log('format', name, value)
    this.editorCtx.format(name, value);
  },
  // 通过 Context 方法改变编辑器内样式时触发，返回选区已设置的样式
  onStatusChange(e) {
    const formats = e.detail;
    this.setData({
      formats
    });
  },
  // 插入分割线
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function() {
        console.log('insert divider success')
      }
    });
  },
  // 清除
  clear() {
    this.editorCtx.clear({
      success: function(res) {
        console.log("clear success")
      }
    });
  },
  // 移除样式
  removeFormat() {
    this.editorCtx.removeFormat();
  },
  // 插入当前日期
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    });
  },
  CheckDone(res){
    var data = res.data;
    if(data.code == 400){
      app.ShowToast(data.msg);
      setTimeout(function () {
        wx.navigateBack({//返回
          delta: 1
        })
      },1500)
    }
  },
  // 插入图片
  insertImage() {
    wx.chooseImage({
      count:1,
      sizeType: ["compressed"],
      sourceType: ['album'],
      success:(res) => {
        const tempFilePath = res.tempFilePaths;
        this.editorCtx.insertImage({
          width: '100%',
          src: tempFilePath[0],
          data: {
            id: 'abcd',
            role: 'god'
          },
          success: () => {
            console.log('insert image success')
          }
        })
      }
  })
  },
  submitBtn(input){
    let value= input.detail.value.title
    if(!value){
      app.ShowToast("请输入标题");
      return
    }
    if(!this.data.rent_type){
      app.ShowToast("请选择动态类型");
      return
    }
    if(!app.globalData.district){
      app.ShowToast("请选择动态对应区域");
      return
    }
    if(!this.data.add_phone&&!this.data.add_wechat){
      app.ShowToast("联系方式至少选择一项");
      return
    }
    let self = this;
    this.editorCtx.getContents({
      success: (res) => {
        try {
          var content = res.html.match(/<p wx:nodeid="\S*">(\S*)<br wx:nodeid="\S*"><\/p>/)[1];
          if(!content){  // 为空的情况
            app.ShowToast("请输入详情～");
            return
          }
        }catch (e) {
          let imgs = app.get_html_imgs(res.html);
          if(imgs.length > 9){
            app.ShowToast('不能超过9张图片哦~');
            return
          }
          wx.navigateTo({
            url: '/pages/publish-disscuss-preview/publish-disscuss-preview',
            success: function(e) {
              // 通过eventChannel向被打开页面传送数据
              e.eventChannel.emit('acceptDataFromOpenerPage',
                { add_wechat:  self.data.add_wechat, add_phone:self.data.add_phone,
                  title:value,html:res.html,rent_type:self.data.rent_type})
            }
          })
        }
      },
      fail: (res) => {
        console.log("fail：" , res);
      }
    });
  },
  //查看详细页面
})