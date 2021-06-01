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
    'markersData',
    'latitude',
    'longitude'
  ],
  data: {
    currentTag:'zhaofang',
    mapsetting: {
      skew: 0,
      rotate: 0,
      showLocation: false,
      showScale: false,
      subKey: 'NILBZ-E3U3F-V2WJ5-NS7HA-BH5CH-GOBR7',
      layerStyle: 1,
      enableZoom: true,
      enableScroll: true,
      enableRotate: false,
      showCompass: false,
      enable3D: false,
      enableOverlooking: false,
      enableSatellite: false,
      enableTraffic: false,
    },
    windowWidth: wx.getSystemInfoSync().windowWidth,
    windowHeight: wx.getSystemInfoSync().windowHeight
  },
  onLoad: function (options) {

  },
  
  inputfocus() {
    this.setData({
      showClear: true
    })
  },
  inputblur() {
    this.setData({
      showClear: false
    })
  },
  clearKeyword() {
    this.setData({
      keyword: ''
    })
  },
  submitSearch(e) {
    wx.pro.showLoading({
      title: '提交中',
    })
    log(e)
    const t = this
    log('[searchWord]', e.detail.value)
    let searchWord = e.detail.value
    if (searchWord == "") {
      return wx.showToast({
        title: '请输入内容',
        icon: 'error',
        duration: 2000
      })
    }
    wx.navigateTo({
      url: '../../searchPage/searchPage?searchWord=' + searchWord,
    })
  },
  markertap(e){
    log(e.detail.markerId,e)
    wx.navigateTo({
      url: '../../housedetail/housedetail?houseId=' + e.detail.markerId,
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