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
const dayjs = require('../../util/day/day.js')
import pinyin from "wl-pinyin"
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
    currentTag:"huodong",
    score:0,
    visible: false,
    zuixinhuodong: []
  },
  onLoad: function (options) {
    const t = this
    let _key = t.store.data.curCity
    let temp = _key + 'zuixinhuodong'
    let database = pinyin.getPinyin(temp).replace(/\s+/g, "");
    db.collection(database).orderBy('_createTime', 'desc').get().then(res => {
      t.setData({
        zuixinhuodong: res.data
      })
    })
    if(dayjs().minute() > 0 && dayjs().minute()<60){
      t.loadHongbao()
    }
  },
  loadHongbao(){
    const t = this
    let times = wx.getStorageSync('hongbuyuCishu')
    if(times){

    }
    if(times > 0){
      this.setData({
        visible: true,
        createSpeed: 5, // 速度
        time: 5, // 游戏时间
        readyTime: 3, // 准备时间
        min: 0, // 金币最小是0
        max: 10, // 金币最大是10
      })
      let time = times-1
      wx.setStorageSync('hongbuyuCishu', time)
    }

  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  submitSearch(e) {
    wx.pro.showLoading({
      title: '提交中',
    })
    log(e)
    const t = this
    let key = e.detail.value
    if(key == ""){
      return wx.showToast({
        title: '请输入内容',
        icon: 'error',
        duration: 2000
      })
    }
    let _key = t.store.data.curCity
    let temp = _key + 'zuixinhuodong'
    let database = pinyin.getPinyin(temp).replace(/\s+/g, "");
    db.collection(database).where(_.or([{
      title: db.RegExp({
        regexp: '.*' + key + '.*',
        options: 'i',
      })
    }])).orderBy('_createTime', 'desc').get().then(res => {
      t.setData({
        zuixinhuodong: res.data
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
  navHome() {
    wx.navigateBack({
      delta: 9,
    })
  },
  navZixun(e) {
    wx.navigateTo({
      url: '../news/news'
    })
  },
  navMap() {
    wx.navigateTo({
      url: '../index/mapDetail/mapDetail',
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
  packetrainSuccess(e) {
    console.log('bind:finish',e)
    let score = e.detail.showScore
    if(score <= 10){
      this.setData({
        visible: false, //  隐藏界面
      })
    }else if(score > 10){
      this.setData({
        visible: false, //  隐藏界面
        score: score,
        jiangpin:e.detail.jiangpin,
        modalName: 'duihuanHongbao'
      })
    }
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
  submitForm(e) {
    log(e)
    const t = this
    wx.pro.showLoading({
      title: '提交中',
    })
    let _key = t.store.data.curCity
    let temp = _key + 'hongbaoduihuan'
    let database = pinyin.getPinyin(temp).replace(/\s+/g, "");
    db.collection(database).add({
        data: {
          name: e.detail.value.nameInput,
          phone: e.detail.value.phoneInput,
          score:t.data.score,
          jiangpin:t.data.jiangpin,
          time:t.getCurrentTime()
        }
      })
      .then(res => {
        console.log(res)
        wx.pro.hideLoading()
        t.hideModal()
        wx.showToast({
          title: '提交成功',
        })
      })
      .catch(console.error)
  },
  navDetail(e) {
    log(e)
    wx.navigateTo({
      url: './detail/detail?detailid=' + e.currentTarget.id
    })
  },
  navQiyefuwu() {
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