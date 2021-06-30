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
const form = require("../../util/formValidation.js")
import pinyin from "wl-pinyin"
import {
  promisifyAll
} from 'wx-promise-pro'
promisifyAll()
create(store, {

  /**
   * 页面的初始数据
   */
  data: {

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
  getUserProfile() {
    const t = this
    wx.getUserProfile({
      desc: '用于完善个人资料',
      success: function (res) {
        var userInfo = res.userInfo
        console.log('userInfo==>', userInfo)

        t.store.data.userInfo = {
          realName: "",
          shenfengzhen: "",
          nickName: userInfo.nickName,
          city: userInfo.city,
          province: userInfo.province,
          country: userInfo.country,
          gender: userInfo.gender,
          avatarUrl: userInfo.avatarUrl,
          phone: '',
          kabao: [],
          tuiguangshouyi: 0,
          youxiaoyaoqingrenshu: 0,
          ishehuoren: false,
          isdaili: false,
          openid: globalData.openid,
          unionid: globalData.unionid || "",
          userMoney: 0,
          guanliankaquankabao: []
        }
        let temp = t.store.data.curCity + 'userInfo'
        let database = pinyin.getPinyin(temp).replace(/\s+/g, "");
        db.collection(database).add({
            data: {
              realName: "",
              shenfengzhen: "",
              nickName: userInfo.nickName,
              city: userInfo.city,
              province: userInfo.province,
              country: userInfo.country,
              gender: userInfo.gender,
              avatarUrl: userInfo.avatarUrl,
              phone: '',
              kabao: [],
              tuiguangshouyi: 0,
              youxiaoyaoqingrenshu: 0,
              ishehuoren: false,
              isdaili: false,
              openid: globalData.openid,
              unionid: globalData.unionid || "",
              userMoney: 0,
              guanliankaquankabao: []
            }
          })
          .then(res => {
            console.log(res)
          })
          .catch(console.error)
        wx.navigateBack({
          delta: 1,
        })
      },
      fail: function (err) {
        wx.showToast({
          icon: 'error',
          title: '请授权',
        })
      }
    })
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