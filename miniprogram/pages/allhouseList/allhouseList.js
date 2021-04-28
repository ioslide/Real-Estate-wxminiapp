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
    'goufangzhengce'
  ],
  data: {
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
    t.setData({
      allHouseList: t.store.data.allHouseList
    })
    //   let key = wx.getStorageSync('curCity')
    //   db.collection('dangeloupanxiangqing').orderBy('_createTime', 'desc').where(_.or([{
    //     loupanmingcheng: db.RegExp({
    //       regexp: '.*' + key,
    //       options: 'i',
    //     })
    //   },
    //   {
    //     chengshi: db.RegExp({
    //       regexp: '.*' + key,
    //       options: 'i',
    //     })
    //   },
    //   {
    //     jutidizhi: db.RegExp({
    //       regexp: '.*' + key,
    //       options: 'i',
    //     })
    //   }
    // ])).get().then(res => {
    //     log(res.data)
    //     t.setData({
    //       allhouseList : res.data
    //     })
    //   })
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
  markertap(e){
    let houseId = this.store.data.allHouseList[e.detail.markerId - 900000000]
    wx.navigateTo({
      url: '../housedetail/housedetail?houseId=' + houseId._id,
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
    let key = e.detail.value.nameInput
    db.collection('dangeloupanxiangqing').where(_.or([{
        loupanmingcheng: db.RegExp({
          regexp: '.*' + key + '.*',
          options: 'i',
        })
      },
      {
        chengshi: db.RegExp({
          regexp: '.*' + key,
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
      url: '../housedetail/housedetail?houseId=' + e.currentTarget.dataset.id,
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