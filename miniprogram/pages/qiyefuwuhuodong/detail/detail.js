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
import {
  promisifyAll
} from 'wx-promise-pro'
promisifyAll()
create(store, {
  data: {
    detailhuodong:{},
    use: [
      'curCity'
    ],
  },
  onLoad: function (options) {
    const t = this
    wx.showLoading({
      title: 'Loading',
    })
    log(options)
    let _key = t.store.data.curCity
    let temp = _key + 'qiyefuwuhuodong'
    let database = pinyin.getPinyin(temp).replace(/\s+/g, "");
    db.collection(database).where({
      _id: options.detailid
    }).get().then(res => {
      log(res.data[0])
      wx.hideLoading({
        success: (res) => {},
      })
      t.setData({
        detailhuodong: res.data[0]
      })
    })
  },
  downloadFile(){
    wx.pro.showLoading({
      title: 'Loading',
    })
    const t = this
    wx.downloadFile({
      url: t.data.detailhuodong.wendang,
      success: function (res) {
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log('打开文档成功')
            wx.pro.hideLoading()
          }
        })
      },
      fail: function (err) {
        log(err)
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