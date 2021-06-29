const app = getApp()
const globalData = getApp().globalData
const log = console.log.bind(console)
const group = console.group.bind(console)
const groupEnd = console.groupEnd.bind(console)
const error = console.error.bind(console)
const db = wx.cloud.database()
const _ = db.command
import create from '../../util/create'
import store from '../../store/index'
const dayjs = require('../../util/day/day.js')
import pinyin from "wl-pinyin"
const form = require("../../util/formValidation.js")

create(store, {
  data: {
    code : '1949',
    phone : '',
    switchRent:false
  },
  onLoad: function (options) {

  },
  switchRent(e){
    log(e)
    this.setData({
      switchRent : e.detail.value
    })
  },
  verifySmsCode(e){
    log(e)
    this.setData({
      code : e.detail.code,
      phone: e.detail.phone
    })
  },
  submitForm(e) {
    log(e)
    const t = this
    let rules = [{
        name: "nameInput",
        rule: ["required", "isChinese", "minLength:2", "maxLength:30"],
        msg: ["请输入姓名", "姓名必须是中文", "必须2个或以上字符", "姓名不能超过20个字符"]
      },
      {
        name: "codeInput",
        rule: ["required"],
        msg: ["请输入验证码"]
      },
      {
        name: "houseIdInput",
        rule: ["required"],
        msg: ["请输入楼栋房号"]
      },
      {
        name: "dreamSalePriceInput",
        rule: ["required","isNum"],
        msg: ["请输入期望售价"]
      },
      {
        name: "houseNameInput",
        rule: ["required"],
        msg: ["请输入小区名称"]
      },
      {
        name: "dreamRentPriceInput",
        rule: [t.data.switchRent == true ? "required": ''],
        msg: ["请输入期望租价数字"]
      }
    ];
    let formData = e.detail.value;
    let checkRes = form.validation(formData, rules);
    log(checkRes,formData.codeInput,t.data.code)
    if(formData.codeInput !== t.data.code && formData.codeInput !== ""){
      wx.showToast({
        title: '手机号或验证码不正确',
        icon:'none'
      })
      return false
    }
    if(t.data.phone == ''){
      wx.showToast({
        title: '请获取验证码',
        icon:'none'
      })
      return false
    }
    if (!checkRes) {
      log('验证通过')
      wx.pro.showLoading({
        title: '提交中',
      })
      let _key = t.store.data.curCity
      let temp = _key + 'helpSaleHouseUserLists'
      let database = pinyin.getPinyin(temp).replace(/\s+/g, "");
      db.collection(database).add({
        data: {
          username: formData.nameInput,
          phone: t.data.phone,
          xiaoqumingcheng:formData.houseNameInput,
          loudongfanghao:formData.houseIdInput,
          qiwangshoujia:formData.dreamSalePriceInput,
          qiwangzujia:formData.dreamRentPriceInput || '',
          createTime: app.getCurrentTime(),
          shifouchuli:false
        }
      })
      .then(res => {
        console.log(res)
        wx.pro.hideLoading()
        wx.showToast({
          title: '提交成功',
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1,
          })
        }, 1000);
      })
      .catch(console.error)

    } else {
      wx.showToast({
        title: checkRes,
        icon: "none"
      });
    }

  },
  onReady: function () {

  },
  onShow: function () {

  },
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