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
    'qiyefuwuList',
    'maifangliucheng',
    'goufangzhengce',
    'curCity'
  ],
  data: {
    qiyefuwuList:[],
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
  onLoad: function (options) {
    const t = this
      let _key = t.store.data.curCity
      let temp = _key + 'qiyefuwuhuodong'
      let database = pinyin.getPinyin(temp).replace(/\s+/g, "");
      db.collection(database).orderBy('_createTime', 'desc').get().then(res => {
        log(res.data)
        t.setData({
          qiyefuwuList : res.data
        })
      })
  },
  navHome() {
    wx.navigateBack({
      delta: 9,
    })
  },
  navQiyefuwu(){
    wx.navigateTo({
      url: '../qiyefuwuhuodong/qiyefuwuhuodong',
    })
  },

  navMap() {
    wx.navigateTo({
      url: '../index/mapDetail/mapDetail',
    })
  },
  navHuodong(e) {
    wx.navigateTo({
      url: '../huodong/huodong'
    })
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
    let key = e.detail.value
    if(key == ""){
      return wx.showToast({
        title: '请输入内容',
        icon: 'error',
        duration: 2000
      })
    }
    let _key = t.store.data.curCity
    let temp = _key + 'qiyefuwuhuodong'
    let database = pinyin.getPinyin(temp).replace(/\s+/g, "");
    db.collection(database).where(_.or([{
      title: db.RegExp({
          regexp: '.*' + key + '.*',
          options: 'i',
        })
      },
      {
        huodongchengshi: db.RegExp({
          regexp: '.*' + key,
          options: 'i',
        })
      }
    ])).orderBy('shunxu', 'desc').get().then(res => {
      t.setData({
        qiyefuwuList: res.data
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
      url: './detail/detail?detailid=' + e.currentTarget.dataset.id,
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