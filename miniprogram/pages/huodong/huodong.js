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
    zuixinhuodong:[]
  },
  onLoad: function (options) {
    const t = this  
    db.collection('zuixinhuodong').orderBy('_createTime', 'desc').get().then(res => {
      log(res.data)
      t.setData({
        zuixinhuodong : res.data
      })
    })
  },
  submitSearch(e) {
    wx.pro.showLoading({
      title: '提交中',
    })
    log(e)
    const t = this
    let key = e.detail.value.nameInput
    db.collection('zuixinhuodong').where(_.or([{
      title: db.RegExp({
        regexp: '.*' + key + '.*',
        options: 'i',
      })
    }])).orderBy('_createTime', 'desc').get().then(res => {
      t.setData({
        zuixinhuodong:res.data
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
  navHome(){
    wx.navigateBack({
      delta: 9,
    })
  },
  navZixun(e){
    wx.navigateTo({
      url: '../news/news'
    })
  },
  navMap(){
    wx.navigateTo({
      url: '../index/mapDetail/mapDetail',
    })
  },
  navDetail(e){
    log(e)
    wx.navigateTo({
      url: './detail/detail?detailid=' + e.currentTarget.id
    })
  },
  navQiyefuwu(){
    wx.navigateTo({
      url: '../qiyefuwuhuodong/qiyefuwuhuodong',
    })
  },
  navHuodong(e) {
    wx.navigateTo({
      url: '../huodong/huodong'
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