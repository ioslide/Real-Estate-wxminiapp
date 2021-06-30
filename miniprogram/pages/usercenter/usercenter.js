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
  use: [
    'userInfo'
  ],
  data: {

  },
  onLoad: function (options) {
    // log()
    // const t = this
    // wx.showLoading({
    //   title: 'Loading',
    // })
    // let _key = t.store.data.curCity
    // let temp = _key + 'userInfo'
    // let database = pinyin.getPinyin(temp).replace(/\s+/g, "");
    // db.collection(database).where({
    //   openid: globalData.openid
    // }).get()
    //   .then(res => {
    //     wx.hideLoading()
    //     console.log(res.data[0])
    //     t.store.data.userInfo = res.data[0]
    //   })
    //   .catch(console.error)
  },
  onReady: function () {

  },
  onShow: function () {
    const t = this
    let cc = t.store.data.userInfo
    log(t.store.data.userInfo,cc.hasOwnProperty('nickName'))
    if(cc.hasOwnProperty('nickName')){
      t.setData({
        hasUserInfo : true
      })
      wx.showLoading({
        title: 'Loading',
      })
      let _key = t.store.data.curCity
      let temp = _key + 'userInfo'
      let database = pinyin.getPinyin(temp).replace(/\s+/g, "");
      db.collection(database).where({
        openid: globalData.openid
      }).get()
        .then(res => {
          wx.hideLoading()
          console.log(res.data[0])
          t.store.data.userInfo = res.data[0]
        })
        .catch(console.error)
    }else{
      t.setData({
        hasUserInfo : false
      })
    }
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  navorderdaili(){
    wx.navigateTo({
      url: './orderDaili',
    })
  },
  navUsersetting(){
    wx.navigateTo({
      url: './userSetting',
    })
  },
  navguanzhuHouse(){
    wx.navigateTo({
      url: './guanzhuHouse',
    })
  },
  navRuzhu(){
    wx.navigateTo({
      url: '../ruzhu/ruzhu'
    })
  },
  navzuji(){
    wx.navigateTo({
      url: './houseZuji',
    })
  },
  navUserMoney(){
    wx.navigateTo({
      url: '../userMoney/userMoney',
    })
  },
  navMykabao(){
    const t = this
    wx.openCard({
      cardList:t.store.data.userInfo.card,
      success (res) {
        log(res)
       },
       fail (err){
         log(err)
       }
    })
  },
  getcoupon(e){
    log(e)
  },
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})