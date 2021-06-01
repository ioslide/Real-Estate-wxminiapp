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
    'curCity'
  ],
  data: {},
  onLoad: function (options) {
    const t = this
    let key = t.store.data.curCity
    let temp = key + 'dailiren'
    let database = pinyin.getPinyin(temp).replace(/\s+/g, "");
    log('代理人数据库', database)

    db.collection(database).orderBy('paimingshunxu', 'desc').get().then(res => {
      t.setData({
        dailiren: res.data
      })
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
  handleChat(e) {
    log(e)
    this.setData({
      'curDaili.name': e.currentTarget.dataset.name,
      'curDaili.level': e.currentTarget.dataset.level,
      'curDaili.phone': e.currentTarget.dataset.phone,
      'curDaili.id': e.currentTarget.dataset.id,
      modalName: e.currentTarget.dataset.target
    })
  },
  handlePhone(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
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
    log(key)
    let _key = t.store.data.curCity
    let temp = _key + 'dailiren'
    let database = pinyin.getPinyin(temp).replace(/\s+/g, "");
    db.collection(database).where(_.or([{
      mingcheng: db.RegExp({
        regexp: '.*' + key + '.*',
        options: 'i',
      }),
    }])).orderBy('paimingshunxu', 'desc').get().then(res => {
      t.setData({
        dailiren: res.data
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
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  navDetailDailiren(e) {
    log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../detailDailiren/detailDailiren?dailirenId=' + e.currentTarget.dataset.id,
    })
  },
  getCurrentTime() {
    let date = new Date()
    let Y = date.getFullYear()
    let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
    let D = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()
    let hours = date.getHours()
    let minutes = date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()
    let seconds = date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds()
    date = Y + '-' + M + '-' + D + ' ' + hours + ':' + minutes + ':' + seconds
    console.log(date) // 2019-10-12 15:19:28
    return date
  },
  submitForm(e) {
    log(e)
    const t = this
    wx.pro.showLoading({
      title: '提交中',
    })
    let _key = t.store.data.curCity
    let temp = _key + 'gukeyuyue'
    let database = pinyin.getPinyin(temp).replace(/\s+/g, "");
    db.collection(database).add({
        data: {
          username: e.detail.value.nameInput,
          yixiangfangyuan: e.detail.value.houseInput,
          userphone: e.detail.value.phoneInput,
          jiedaidailixingming: t.data.curDaili.name,
          jiedaidailidianhua: t.data.curDaili.phone,
          dailiid: t.data.curDaili.id,
          tijiaoshijian: t.getCurrentTime(),
          guketijiaolaiyuan: '所有代理人页面提交'
        }
      })
      .then(res => {
        wx.showToast({
          title: '提交成功',
        })
        console.log(res)
        wx.pro.hideLoading()
        t.hideModal()
      })
      .catch(console.error)
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