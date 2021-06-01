const app = getApp()
const globalData = getApp().globalData
const log = console.log.bind(console)
const group = console.group.bind(console)
const groupEnd = console.groupEnd.bind(console)
const error = console.error.bind(console)
const db = wx.cloud.database()
const _ = db.command
import create from '../../../util/create'
import store from '../../../store/index'
import pinyin from "wl-pinyin"
create(store, {
  use: [
    'adSwiperList',
    'swiperList',
    'dailiren',
    'allHouseList',
    'maifangliucheng',
    'goufangzhengce',
    'curCity'
  ],
  data: {
    detailNews: []
  },
  onLoad: function (options) {
    const t = this
    log(options)
    wx.showLoading({
      title: 'Loading',
    })
    let _key = t.store.data.curCity
    let temp = _key + 'zixunxinxi'
    let database = pinyin.getPinyin(temp).replace(/\s+/g, "");
    db.collection(database).doc(options.detailid).get().then(res => {
      log(res.data)
      wx.hideLoading({
        success: (res) => {},
      })
      t.setData({
        detailNews: res.data
      })
    })
  },
  navApp(e) {
    log(e)
    wx.navigateToMiniProgram({
      appId: e.currentTarget.dataset.appid,
      path: e.currentTarget.dataset.route,
      success(res) {
        log(res)
      }
    })
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})