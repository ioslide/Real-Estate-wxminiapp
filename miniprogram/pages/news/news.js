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
create(store, {
  use: [
    'adSwiperList',
    'swiperList',
    'dailiren',
    'allHouseList',
    'maifangliucheng',
    'goufangzhengce',
    'zixunxinxi',
    'curCity'
  ],
  data: {
    zixunxinxi:[]
  },
  onLoad: function (options) {
    const t = this  
    wx.pro.showLoading({
      title: 'Loading'
    })
    let _key = t.store.data.curCity
    let temp = _key + 'zixunxinxi'
    let database = pinyin.getPinyin(temp).replace(/\s+/g, "");
    db.collection(database).orderBy('_createTime', 'desc').get().then(res => {
      t.setData({
        zixunxinxi:res.data
      })
      wx.pro.hideLoading()
      if(res.data.length == 0){
        wx.showToast({
          title: '暂无信息',
          icon: 'error',
          duration: 2000
        })
      }
    })
  },
  navHome(){
    wx.navigateBack({
      delta: 9,
    })
  },
  navHuodong(e) {
    wx.navigateTo({
      url: '../huodong/huodong'
    })
  },
  inputfocus(){
    this.setData({
      showClear : true
    })
  },
  inputblur(){
    this.setData({
      showClear : false
    })
  },
  clearKeyword(){
    this.setData({
      keyword: ''
    })
  },
  navMap(){
    wx.navigateTo({
      url: '../index/mapDetail/mapDetail',
    })
  },
  submitSearch(e) {
    wx.pro.showLoading({
      title: '提交中',
    })
    log(e)
    const t = this
    let key = e.detail.value
    let _key = t.store.data.curCity
    let temp = _key + 'zixunxinxi'
    let database = pinyin.getPinyin(temp).replace(/\s+/g, "");
    db.collection(database).where(_.or([{
      zixunbiaoti: db.RegExp({
        regexp: '.*' + key + '.*',
        options: 'i',
      })
    },
    {
      zixunneirong: db.RegExp({
        regexp: '.*' + key + '.*',
        options: 'i',
      })
    }
  ])).orderBy('_createTime', 'desc').get().then(res => {
      t.setData({
        zixunxinxi:res.data
      })
      wx.pro.hideLoading()
      log(res.data)
      if(res.data.length == 0){
        wx.showToast({
          title: '暂无信息',
          icon: 'error',
          duration: 2000
        })
      }
    })
  },
  navDetail(e){
    log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: './detail/detail?detailid=' + e.currentTarget.dataset.id
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