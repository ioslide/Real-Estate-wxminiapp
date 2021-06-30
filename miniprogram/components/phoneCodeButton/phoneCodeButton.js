const app = getApp()
const globalData = getApp().globalData
const log = console.log.bind(console)
const group = console.group.bind(console)
const groupEnd = console.groupEnd.bind(console)
const error = console.error.bind(console)
const form = require("../../util/formValidation.js")
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    phone: '', //手机号
    code: '', //验证码
    iscode: null, //用于存放验证码接口里获取到的code
    codeName: '获取验证码'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //获取input输入框的值
    getNameValue: function (e) {
      this.setData({
        name: e.detail.value
      })
    },
    getPhoneValue: function (e) {
      this.setData({
        phone: e.detail.value
      })
    },
    getCodeValue: function (e) {
      this.setData({
        code: e.detail.value
      })
    },
    getVerificationCode(){

    },
    generateMixed(n) {
      var code = "";
      for (var i = 1; i <= 4; i++) {
          code += (parseInt(Math.random() * 10));
      }
      this.setData({
        code : code
      })
      log('code',code)
      return code;
    },
    phoneInputCheck: function () {
      var t = this;
      let rules = [{
        name: "phoneInput",
        rule: ["required", "isMobile"],
        msg: ["请输入手机号", "请输入正确的手机号"]
      }];
      let formData = {
        'phoneInput' :t.data.phone
      }
      let checkRes = form.validation(formData, rules);
      log(checkRes)
      wx.showLoading({
        title: '发送中',
      })
      if (!checkRes) {
        wx.cloud.callFunction({
          name : 'verifySms',
          data:{
            phone : t.data.phone,
            code : t.generateMixed(4)
          }
        }).then( res => {
          wx.hideLoading()
          log(t.data.code)
          var myEventDetail = {
            code : t.data.code,
            phone:t.data.phone
          } // detail对象，提供给事件监听函数
          t.triggerEvent('verifySmsCode', myEventDetail)
          log(res)
          t.setData({
            disabled:true
          })
          var num = 61;
          var timer = setInterval(function () {
            num--;
            if (num <= 0) {
              clearInterval(timer);
              t.setData({
                codeName: '重新发送',
                disabled: false
              })
            } else {
              t.setData({
                codeName: num + "s"
              })
            }
          }, 1000)
        }).catch( err =>{
          log(err)
        })

      }else {
        wx.showToast({
          title: checkRes,
          icon: "none"
        });
      }

    },
    checkcodeInput(e){
      log(e)
    }
  }
})