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
    db.collection(database).doc(options.detailid).get().then(res => {
      log(res.data)
      let jingweidu = res.data.jingweidu.split(',')
      let latitude = jingweidu[0]
      let longitude = jingweidu[1]
      log('jingweidu', jingweidu)
      t.setData({
        longitude: Number(longitude),
        latitude: Number(latitude)
      })
      wx.hideLoading({
        success: (res) => {},
      })
      t.setData({
        detailhuodong: res.data
      })
    })
  },
  handlePhone(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  showModal(e) {
    var t = this
    t.setData({
      currDay:e.currentTarget.dataset.index,
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  guideTo() {
    const t = this
    let plugin = requirePlugin('routePlan');
    let endPoint = JSON.stringify({
      'name': t.data.detailhuodong.jutidizhi,
      'latitude': Number(t.data.latitude),
      'longitude': Number(t.data.longitude),
    });
    let key = 'NILBZ-E3U3F-V2WJ5-NS7HA-BH5CH-GOBR7'
    let referer = '论方略';
    wx.navigateTo({
      url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
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