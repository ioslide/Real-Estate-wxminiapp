const app = getApp()
const globalData = getApp().globalData
const log = console.log.bind(console)
const group = console.group.bind(console)
const groupEnd = console.groupEnd.bind(console)
const error = console.error.bind(console)
const db = wx.cloud.database()
const _ = db.command
import pinyin from "wl-pinyin"
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
    'goufangzhengce',
    'curCity'
  ],
  data: {

  },
  onLoad: function (options) {
    log(options)
    const t = this
    let key = options.dailirenId
    log('key', key)
    // let allHouseList = this.store.data.allHouseList
    var detailDailiren = t.store.data.dailiren.find((v) => {
      return v._id == key;
    });
    console.log('[detailDailiren]', detailDailiren);
    // allHouseList.find((item) => {
    //   for (let i = 0; i < item.dailiguwen.length; i++) {
    //     log(item)
    //     if (item.dailiguwen[i] == key) {
    //       dailirenHouseGroup.push(item)
    //     }
    //   }
    // });

    let dailirenHouseGroup = []
    let dailirenRentHouseGroup = []

    let _key = t.store.data.curCity
    let temp = _key + 'dangeloupanxiangqing'
    let database = pinyin.getPinyin(temp).replace(/\s+/g, "");
    let temp2 = _key + 'zufangxiangqing'
    let rentHousedatabase = pinyin.getPinyin(temp2).replace(/\s+/g, "");

    log('楼盘详情数据库', database)
    log('租房详情数据库', rentHousedatabase)

    if (detailDailiren.dailizufangliebiao) {
      for (let i = 0; i < detailDailiren.dailizufangliebiao.length; i++) {
        log(detailDailiren.dailizufangliebiao[i])
        db.collection(rentHousedatabase).doc(detailDailiren.dailizufangliebiao[i]).get().then(res => {
          dailirenRentHouseGroup.push(res.data)
          log(dailirenRentHouseGroup, detailDailiren.dailizufangliebiao.length)
          if (dailirenRentHouseGroup.length == detailDailiren.dailizufangliebiao.length) {
            t.setData({
              dailirenRentHouseGroup: dailirenRentHouseGroup
            })
          }
        })
      }
    }

    for (let i = 0; i < detailDailiren.daililoupanliebiao.length; i++) {
      log(detailDailiren.daililoupanliebiao[i])
      db.collection(database).doc(detailDailiren.daililoupanliebiao[i]).get().then(res => {
        dailirenHouseGroup.push(res.data)
        log(dailirenHouseGroup, detailDailiren.daililoupanliebiao.length)
        if (dailirenHouseGroup.length == detailDailiren.daililoupanliebiao.length) {
          t.setData({
            dailirenHouseGroup: dailirenHouseGroup
          })
        }
      })
    }

    this.setData({
      detailDailiren: detailDailiren
    })
  },
  navHousedetail(e) {
    log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../housedetail/housedetail?houseId=' + e.currentTarget.dataset.id,
    })
  },
  navRentHousedetail(e) {
    log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../allRentHouseList/detail/detail?houseId=' + e.currentTarget.dataset.id,
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
    let submitData = {
      username: e.detail.value.nameInput,
      yixiangfangyuan: e.detail.value.houseInput,
      userphone: e.detail.value.phoneInput,
      jiedaidailixingming: t.data.detailDailiren.mingcheng,
      jiedaidailidianhua: t.data.detailDailiren.dianhua,
      dailiid: t.data.detailDailiren._id,
      tijiaoshijian: t.getCurrentTime()
    }
    let dailirenOrderLists = wx.getStorageSync('dailirenOrderLists') || []
    dailirenOrderLists.push(submitData)
    wx.setStorageSync('dailirenOrderLists', dailirenOrderLists)
    let _key = t.store.data.curCity
    let temp = _key + 'gukeyuyue'
    let database = pinyin.getPinyin(temp).replace(/\s+/g, "");
    db.collection(database).add({
        data: {
          username: e.detail.value.nameInput,
          yixiangfangyuan: e.detail.value.houseInput,
          userphone: e.detail.value.phoneInput,
          jiedaidailixingming: t.data.detailDailiren.mingcheng,
          jiedaidailidianhua: t.data.detailDailiren.dianhua,
          dailiid: t.data.detailDailiren._id,
          tijiaoshijian: t.getCurrentTime()
        }
      })
      .then(res => {
        console.log(res)
        wx.pro.hideLoading()
        wx.showToast({
          title: '提交成功',
        })
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
          title: '论方略-' + t.data.detailDailiren.mingcheng,
        })
      }, 2000)
    })
    return {
      title: '论方略-' + t.data.detailDailiren.mingcheng,
      path: '/pages/detailDailiren/detailDailiren?dailirenId=' + t.data.detailDailiren._id,
      promise
    }
  },
})