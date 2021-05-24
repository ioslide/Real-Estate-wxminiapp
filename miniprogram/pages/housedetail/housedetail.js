const app = getApp()
const globalData = getApp().globalData
const log = console.log.bind(console)
const group = console.group.bind(console)
const groupEnd = console.groupEnd.bind(console)
const error = console.error.bind(console)
const db = wx.cloud.database()
const _ = db.command
const QQMapWX = require('../../util/qqmap-wx-jssdk.min.js');
var qqmapsdk = new QQMapWX({
  key: 'NILBZ-E3U3F-V2WJ5-NS7HA-BH5CH-GOBR7'
});
import {
  promisifyAll
} from 'wx-promise-pro'
promisifyAll()
import pinyin from "wl-pinyin"
import create from '../../util/create'
import store from '../../store/index'

create(store, {
  use: [
    'adSwiperList',
    'swiperList',
    'dailiren',
    'allHouseList',
    'maifangliucheng',
    'goufangzhengce',
    'markersData',
    'curCity'
  ],
  data: {
    curDaili: {
      name: '',
      level: '',
      phone: '',
      id: ''
    },
    mapsetting: {
      skew: 0,
      rotate: 0,
      showLocation: false,
      showScale: false,
      subKey: 'NILBZ-E3U3F-V2WJ5-NS7HA-BH5CH-GOBR7',
      layerStyle: 1,
      enableZoom: true,
      enableScroll: true,
      enableRotate: false,
      showCompass: false,
      enable3D: false,
      enableOverlooking: false,
      enableSatellite: false,
      enableTraffic: false,
    },
    latitude: '31.46751',
    longitude: '104.6796',
    searchWord: "",
    hasHouseList: false,
  },
  onLoad: function (options) {
    const t = this
    wx.showLoading({
      title: 'Loading',
    })
    let key = t.store.data.curCity
    let temp = key + 'dangeloupanxiangqing'
    let temp2 = key + 'dailiren'

    let database = pinyin.getPinyin(temp).replace(/\s+/g, "");
    let database2 = pinyin.getPinyin(temp2).replace(/\s+/g, "");
    
    db.collection(database).get().then(res => {
      let allHouseList = res.data
      var results = allHouseList.filter(function (entry) {
        return entry._id === options.houseId;
      });
      log(results[0])
      let jingweidu = results[0].jingweidu.split(',')
      let latitude = jingweidu[0]
      let longitude = jingweidu[1]
      log('jingweidu', jingweidu)
      t.setData({
        longitude: Number(longitude),
        latitude: Number(latitude),
        houseDetail: results[0]
      })

      db.collection(database2).doc(results[0].loupanshouxidailiren).get().then(res => {
        log('loupanshouxidailiren', res.data)
        t.setData({
          loupanshouxidailiren: res.data
        })
      })

      db.collection(database2).where({
        daililoupanliebiao: options.houseId
      }).get().then(res => {
        log('daliren', res.data)
        t.setData({
          dailiren: res.data
        })
      })
      wx.hideLoading({
        success: (res) => {},
      })
    })

  },
  handlePhone(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  navHousedetail(e) {
    log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../housedetail/housedetail?houseId=' + e.currentTarget.dataset.id,
    })
  },
  navNearBuilding() {
    log('[navNearBuilding]')
    const t = this
    let locationKey = 'NILBZ-E3U3F-V2WJ5-NS7HA-BH5CH-GOBR7'
    const appReferer = '论方略';
    const locationCategory = '学校,公交,医院';
    const location = JSON.stringify({
      'latitude': Number(t.data.latitude),
      'longitude': Number(t.data.longitude),
    });
    wx.navigateTo({
      url: 'plugin://chooseLocation/index?key=' + locationKey + '&referer=' + appReferer + '&category=' + locationCategory + '&location=' + location
    });
  },
  handleChat(e) {
    this.setData({
      'curDaili.name': e.currentTarget.dataset.name,
      'curDaili.level': e.currentTarget.dataset.level,
      'curDaili.phone': e.currentTarget.dataset.phone,
      'curDaili.id': e.currentTarget.dataset.id,
      modalName: e.currentTarget.dataset.target
    })
    log(e.currentTarget.dataset)
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
          tijiaoshijian: t.getCurrentTime()
        }
      })
      .then(res => {
        console.log(res)
        wx.pro.hideLoading()
        t.hideModal()
      })
      .catch(console.error)
  },
  guideTo() {
    const t = this
    let plugin = requirePlugin('routePlan');
    let endPoint = JSON.stringify({
      'name': t.data.houseDetail.loupanmingcheng,
      'latitude': Number(t.data.latitude),
      'longitude': Number(t.data.longitude),
    });
    let key = 'NILBZ-E3U3F-V2WJ5-NS7HA-BH5CH-GOBR7'
    let referer = '论方略';
    wx.navigateTo({
      url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
    })
  },
  handlePhone(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  onShareAppMessage() {
    const t = this
    const promise = new Promise(resolve => {
      setTimeout(() => {
        resolve({
          title: '论方略-' + t.data.houseDetail.loupanmingcheng,
        })
      }, 2000)
    })
    return {
      title: '论方略-' + t.data.houseDetail.loupanmingcheng,
      path: '/pages/houseDetail/houseDetail?houseId=' + t.data.houseDetail._id,
      promise
    }
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
})