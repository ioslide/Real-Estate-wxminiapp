const log = console.log.bind(console)
const group = console.group.bind(console)
const groupEnd = console.groupEnd.bind(console)
const error = console.error.bind(console)
import {
  promisifyAll
} from 'wx-promise-pro'
promisifyAll()
const apiLists = require('../config/config.js').apiLists
const db = wx.cloud.database()

let $$ = {
  allHouseList: [],
  swiperList: [],
  dailiren: [],
  adSwiperList: [],
  maifangliucheng: [],
  goufangzhengce: []
}


export default {
  data: {
    adSwiperList: $$.adSwiperList,
    swiperList: $$.swiperList,
    dailiren: $$.dailiren,
    allHouseList: $$.allHouseList,
    maifangliucheng: $$.maifangliucheng,
    goufangzhengce: $$.goufangzhengce
  },
  updateAll: true,
  debug: true
}
const judgeTime = () => { //判断缓存是否过期
  let nowTime = Date.now();
  let furtureTime = wx.getStorageSync('furtureTime');
  if (furtureTime && nowTime < furtureTime) {
    return true;
  }
  return false;
}

let isLessThanFurtureTime = judgeTime()

const furtureTime = () => {
  return Date.now() + 1800000; //毫秒(72小时)
}

const getdailirenList = () => {
  db.collection('dailiren').get().then(res => {
    module.exports.default.data.dailiren = res.data
    wx.setStorage({
      key:"dailiren",
      data:res.data
    })
  })
}
const getSwiper = () => {
  db.collection('shouyelunbotu').get().then(res => {
    module.exports.default.data.swiperList = res.data
    wx.setStorage({
      key:"swiperList",
      data:res.data
    })
  })
}
const getadSwiper = () => {
  db.collection('shouyezhongjianguanggaolunbotu').get().then(res => {
    module.exports.default.data.adSwiperList = res.data
    wx.setStorage({
      key:"adSwiperList",
      data:res.data
    })
  })
}
const getAllHouseList = () => {
  db.collection('dangeloupanxiangqing').get().then(res => {
    module.exports.default.data.allHouseList = res.data
    wx.setStorage({
      key:"allHouseList",
      data:res.data
    })
  })
}
const getGoufangzhengce = () => {
  wx.pro.request({
    url: apiLists.goufangzhengce,
    data: {},
    method: 'GET',
  }).then(res => {
    wx.setStorage({
      key:"goufangzhengce",
      data:res.data.data.list
    })
    module.exports.default.data.goufangzhengce = res.data.data.list
  })
}
const getMaifangliucheng = () => {
  wx.pro.request({
    url: apiLists.maifangliucheng,
    data: {},
    method: 'GET',
  }).then(res => {
    wx.setStorage({
      key:"maifangliucheng",
      data:res.data.data.list
    })
    module.exports.default.data.maifangliucheng = res.data.data.list
  })
}
const initData = async () => {
  getSwiper()
  getadSwiper()
  getAllHouseList()
  getdailirenList()
  getGoufangzhengce()
  getMaifangliucheng()
}
const initStorageData =async () =>{
  module.exports.default.data.dailiren = wx.getStorageSync('dailiren')
  module.exports.default.data.swiperList = wx.getStorageSync('swiperList')
  module.exports.default.data.adSwiperList = wx.getStorageSync('adSwiperList')
  module.exports.default.data.allHouseList = wx.getStorageSync('allHouseList')
  module.exports.default.data.goufangzhengce = wx.getStorageSync('goufangzhengce')
  module.exports.default.data.maifangliucheng = wx.getStorageSync('maifangliucheng')
}
const onReadyEvnet = async () => {
  await wx.pro.showLoading({
    title: '加载中',
    mask: true
  })  
  log('[isLessThanFurtureTime]',isLessThanFurtureTime)
  if (isLessThanFurtureTime == false) {  //过期了
    wx.setStorageSync('furtureTime', furtureTime());
    await initData()
  }else if(isLessThanFurtureTime == true){ //没过期
    await initStorageData()
  }
  // await initData()
  await wx.pro.hideLoading()
}
onReadyEvnet()

console.log('[initData]', $$)