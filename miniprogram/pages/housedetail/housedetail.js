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
    searchWord:"",
    hasHouseList:false,
  },
  onLoad: function (options) {
    const t = this
    let allHouseList = this.store.data.allHouseList
    var results = allHouseList.filter(function (entry) { return entry._id === options.houseId; });
    log(results[0])
    t.setData({
      houseDetail:results[0]
    })
    db.collection('huxingleixing').where({
      suoshuloupan:options.houseId
    }).get().then(res => {
      log('huxing',res.data)
      t.setData({
        huxing:res.data
      })
    })
    db.collection('dailiren').where({
      daililoupanliebiao:options.houseId
    }).get().then(res => {
      log('daliren',res.data)
      t.setData({
        dailiren:res.data
      })
    })
  },

  onReady: function () {

  },
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