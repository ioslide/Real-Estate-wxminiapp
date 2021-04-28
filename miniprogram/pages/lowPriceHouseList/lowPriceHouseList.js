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

  },
  onLoad: function (options) {
    const t = this
    db.collection('dangeloupanxiangqing').orderBy('zuididanjia', 'asc').get().then(res => {
      t.setData({
        allHouseList: res.data
      })
    })
  },
  navQiyefuwu(){
    wx.navigateTo({
      url: '../qiyefuwuhuodong/qiyefuwuhuodong',
    })
  }, 
   navHome(){
    wx.navigateBack({
      delta: 9,
    })
  },
  navMap(){
    wx.navigateTo({
      url: '../index/mapDetail/mapDetail',
    })
  },
  navHuodong(e) {
    wx.navigateTo({
      url: '../huodong/huodong'
    })
  },
  navZixun(e){
    wx.navigateTo({
      url: '../news/news'
    })
  },
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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