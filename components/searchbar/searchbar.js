// components/searchbar.js
const app = getApp();
Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    paramAtoB: {
      type: String,//类型
      value: 'default value'//默认值
    },
    currentvalue: {
      type: String,//类型
      value: '',//默认值
      observer: function(newVal, oldVal) {
        // 属性被改变时执行的函数（可选）
        this.setData({
          inputVal:newVal
        })
      }
    },
    disabled: {
      type: Boolean,
      value: false
    },
    placeholder: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    inputShowed: false,
    timer: null,
    inputVal: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    backfill: function (e) {
      var id = e.currentTarget.id;
      for (var i = 0; i < this.data.suggestion.length;i++){
        if(i == id){
          this.setData({
            backfill: this.data.suggestion[i].title
          });
        }
      }
    },
    //触发关键词输入提示事件
    getsuggest: function(e) {
      var _this = this;
      var old_timer = this.data.timer;
      if (old_timer) {
        clearTimeout(old_timer)
      }
      this.setData({
        timer:setTimeout(() => {
          if(e.detail.value){
            app.globalData.qqmapsdk.getSuggestion({
              //获取输入框值并设置keyword参数
              keyword: e.detail.value, //用户输入的关键词，可设置固定值,如keyword:'KFC'
              region:app.globalData.city, //设置城市名，限制关键词所示的地域范围，非必填参数
              success: function(res) {//搜索成功后的回调
                var sug = [];
                for (var i = 0; i < res.data.length; i++) {
                  sug.push(
                      res.data[i].title,
                  )
                }
                _this.triggerEvent('SearchList',sug);
              },
            });
          }else{ _this.triggerEvent('SearchList',[]);}
          // 调用关键词提示接口
        }, 700),
        inputVal:e.detail.value,
      })
    },
    toSearch:function(e){
      var value = this.data.inputVal;
      this.triggerEvent('ChildInputValue',value);
      },
   }
})
