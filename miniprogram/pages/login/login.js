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
  getUserProfile (e) {
    const t = this
    wx.getUserProfile({
      desc: '用于完善会员资料', 
      success: (res) => {
        if (!wx.getStorageSync('userInfo')) {
          var userInfo = res.userInfo
          let _key = t.store.data.curCity
          let temp = _key + 'userInfo'
          let database = pinyin.getPinyin(temp).replace(/\s+/g, "");
          db.collection(database).add({
              data: {
                openid: globalData.openid,
                unionid: globalData.unionid,
                nickName: userInfo.nickName,
                avatarUrl: userInfo.avatarUrl,
                gender: userInfo.gender,
                language: userInfo.language,
                country: userInfo.country,
                city: userInfo.city,
                province: userInfo.province,
                phone:'',
                ishehuoren:false,
                isdaili:false,
                youxiaoyaoqingrenshu:0,
                tuiguangshouyi:0,
                kabao:[]
              }
            })
            .then(res => {
              console.log(res)
            })
            .catch(console.error)
        }
        console.log(res.userInfo)
        wx.setStorageSync('userInfo', res.userInfo)
        this.store.data.userInfo = res.userInfo
        wx.navigateBack({
          delta: 1,
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