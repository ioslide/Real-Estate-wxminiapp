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
import pinyin from "wl-pinyin"
import {
  promisifyAll
} from 'wx-promise-pro'
promisifyAll()
create(store, {
  use: [
    'adSwiperList',
    'swiperList',
    'dailiren',
    'allHouseList',
    'maifangliucheng',
    'goufangzhengce',
    'curCity',
    'allRentHouseList',
    'rentHouseMarkersData',
  ],
  data: {
    allHouseList: [],
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
  onLoad: function (options) {
    log(options)
    const t = this
    this.setData({
      keyword: wx.getStorageSync('curCity'),
      housetag:options.housetag
    })
    wx.pro.showLoading({
      title: 'Loading'
    })
    let key = t.store.data.curCity
    let temp = key + 'zufangxiangqing'
    let database = pinyin.getPinyin(temp).replace(/\s+/g, "");
    log('全部楼盘数据库', database)

    if(options.housetag == "xuequfang"){
      db.collection(database).where({
        isxuequfang: true
      }).orderBy('_createTime', 'desc').get().then(res => {
        log(res.data)
        wx.pro.hideLoading()
        t.setData({
          allHouseList: res.data
        })
      })
    }if(options.housetag == "didanjia"){
      db.collection(database).orderBy('zuidijiage', 'asc').get().then(res => {
        log(res.data)
        wx.pro.hideLoading()
        t.setData({
          allHouseList: res.data
        })
      })
    }else{
      db.collection(database).orderBy('_createTime', 'desc').get().then(res => {
        log(res.data)
        wx.pro.hideLoading()
        t.setData({
          allHouseList: res.data
        })
      })
    }

  },
  navHome() {
    wx.navigateBack({
      delta: 9,
    })
  },
  navQiyefuwu() {
    wx.navigateTo({
      url: '../qiyefuwuhuodong/qiyefuwuhuodong',
    })
  },
  markertap(e) {
    let houseId = e.detail.markerId
    wx.navigateTo({
      url: './detail/detail?houseId=' + houseId,
    })
  },
  navHuodong(e) {
    wx.navigateTo({
      url: '../huodong/huodong'
    })
  },
  submitSearch(e) {
    wx.pro.showLoading({
      title: '提交中',
    })
    log(e)
    const t = this
    let key = e.detail.value
    if (key == "") {
      return wx.showToast({
        title: '请输入内容',
        icon: 'error',
        duration: 2000
      })
    }
    let _key = t.store.data.curCity
    let temp = _key + 'zufangxiangqing'
    let database = pinyin.getPinyin(temp).replace(/\s+/g, "");
    db.collection(database).where(_.or([{
      loupanmingcheng: db.RegExp({
        regexp: '.*' + key + '.*',
        options: 'i',
      })
    },
    {
      chengshi: db.RegExp({
        regexp: '.*' + key + '.*',
        options: 'i',
      })
    },
    {
      jutidizhi: db.RegExp({
        regexp: '.*' + key + '.*',
        options: 'i',
      })
    }
  ])).orderBy('_createTime', 'desc').get().then(res => {
      t.setData({
        allHouseList: res.data
      })
      wx.pro.hideLoading()
      log(res.data)
      if (res.data.length == 0) {
        wx.showToast({
          title: '暂无信息',
          icon: 'error',
          duration: 2000
        })
      }
    })
  },
  navDetail(e) {
    log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: './detail/detail?houseId=' + e.currentTarget.dataset.id,
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