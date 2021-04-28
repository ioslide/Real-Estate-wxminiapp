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

  },
  onLoad: function (options) {
    log(options)
    const t = this
    let key = options.dailirenId
    log('key', key)
    let allHouseList = this.store.data.allHouseList
    var dailirenHouseGroup = []
    allHouseList.find((item) => {
      for (let i = 0; i < item.dailiguwen.length; i++) {
        if (item.dailiguwen[i] == key) {
          dailirenHouseGroup.push(item)
        }
      }
    });
    log('[dailirenHouseGroup]', dailirenHouseGroup)
    var detailDailiren = t.store.data.dailiren.find((v) => {
      return v._id == key;
    });
    console.log('[detailDailiren]',detailDailiren);
    this.setData({
      detailDailiren: detailDailiren,
      dailirenHouseGroup: dailirenHouseGroup
    })
  },
  handleChat(e) {
    log(e)
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  handlePhone(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  getCurrentTime () {
    let date = new Date()
    let Y = date.getFullYear()
    let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
    let D = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()
    let hours = date.getHours()
    let minutes = date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()
    let seconds = date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds()
    date = Y + '-' + M + '-' + D + ' ' + hours + ':' + minutes + ':' + seconds
     console.log(date)  							// 2019-10-12 15:19:28
    return date
  },
  submitForm(e) {
    log(e)
    const t = this
    wx.pro.showLoading({
      title: '提交中',
    })
    db.collection('gukeyuyue').add({
        data: {
          username: e.detail.value.nameInput,
          yixiangfangyuan: e.detail.value.houseInput,
          userphone: e.detail.value.phoneInput,
          jiedaidailixingming: t.data.detailDailiren.mingcheng,
          jiedaidailidianhua: t.data.detailDailiren.dianhua,
          dailiid: t.data.detailDailiren._id,
          tijiaoshijian:t.getCurrentTime()
        }
      })
      .then(res => {
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
  onShareAppMessage() {
    const t = this
    const promise = new Promise(resolve => {
      setTimeout(() => {
        resolve({
          title: '搜房客-' + t.data.detailDailiren.mingcheng,
        })
      }, 2000)
    })
    return {
      title: '搜房客-' + t.data.detailDailiren.mingcheng,
      path: '/pages/detailDailiren/detailDailiren?dailirenId=' + t.data.detailDailiren._id,
      promise
    }
  },
})