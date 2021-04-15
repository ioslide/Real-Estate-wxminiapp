const app = getApp()
const globalData = getApp().globalData
const log = console.log.bind(console)
const group = console.group.bind(console)
const groupEnd = console.groupEnd.bind(console)
const error = console.error.bind(console)
const db = wx.cloud.database()
const apiLists = require('../../config/config.js').apiLists
import {promisifyAll} from 'wx-promise-pro'
promisifyAll()
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
    TabCur: 0,
    scrollLeft: 0,
    isShowLocation: true,
    cardCur: 0,
  },
  onLoad: function () {
    const t = this
  },
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  navHousedetail(e){
    log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../housedetail/housedetail?houseId='+e.currentTarget.dataset.id,
    })
  },
  getAllHouseList() {
    // wx.pro.request({
    //   url: apiLists.getAllHouseList,
    //   data: {
    //     "projectID": "BDF37BDE-1640-4DFF-A15B-D16C43087CA1",
    //     "keyword": "成都"
    //   },
    //   method: 'POST',
    //   }).then(res => {
    //     console.log("[getAllHouseList]",JSON.parse(res.data.package))
    // }).catch(err => {
    //   console.log(err)
    // }).finally(() => {
    //   wx.pro.hideLoading()
    // })
  },
  searchArean(e){
    log('[searchWord]',e.detail.value)
    let searchWord = e.detail.value
    wx.navigateTo({
      url: '../searchPage/searchPage?searchWord='+searchWord,
    })
  },
})