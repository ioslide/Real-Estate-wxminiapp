const log = console.log.bind(console)
const group = console.group.bind(console)
const groupEnd = console.groupEnd.bind(console)
const error = console.error.bind(console)
const db = wx.cloud.database()
const _ = db.command

import {
  promisifyAll
} from 'wx-promise-pro'
promisifyAll()
const apiLists = require('../config/config.js').apiLists
let $$ = {
  allHouseList: [],
  swiperList: [],
  dailiren: [],
  adSwiperList: [],
  maifangliucheng: [],
  goufangzhengce: [],
  homepageHouseList:[],
  markersData:[],
  latitude:30.5702,
  longitude:104.06476,
}


export default {
  data: {
    markersData:$$.markersData,
    adSwiperList: $$.adSwiperList,
    swiperList: $$.swiperList,
    zixunxinxi:$$.zixunxinxi,
    startImage:$$.startImage,
    dailiren: $$.dailiren,
    allHouseList: $$.allHouseList,
    maifangliucheng: $$.maifangliucheng,
    goufangzhengce: $$.goufangzhengce,
    homepageHouseList:$$.homepageHouseList,
    latitude:$$.latitude,
    longitude:$$.longitude
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
  let key = ''
  if(wx.getStorageSync('curCity')){
    key = wx.getStorageSync('curCity')
  }else{
    key = '成都市'
  }
  log('getdailirenList key',key)
  db.collection('dailiren').where(_.or([
  {
    chengshi: db.RegExp({
      regexp: '.*' + key,
      options: 'i',
    })
  }
])).orderBy('paimingshunxu', 'desc').get().then(res => {
    module.exports.default.data.dailiren = res.data
    wx.setStorage({
      key:"dailiren",
      data:res.data
    })
  })
}
const getSwiper = () => {
  let key = ''
  if(wx.getStorageSync('curCity')){
    key = wx.getStorageSync('curCity')
  }else{
    key = '成都市'
  }
  db.collection('shouyelunbotu').where(_.or([
    {
      chengshi: db.RegExp({
        regexp: '.*' + key,
        options: 'i',
      })
    }
  ])).orderBy('_createTime', 'desc').get().then(res => {
    module.exports.default.data.swiperList = res.data
    wx.setStorage({
      key:"swiperList",
      data:res.data
    })
  })
}
const getadSwiper = () => {
  let key = ''
  if(wx.getStorageSync('curCity')){
    key = wx.getStorageSync('curCity')
  }else{
    key = '成都市'
  }
  db.collection('shouyezhongjianguanggaolunbotu').where(_.or([
    {
      chengshi: db.RegExp({
        regexp: '.*' + key,
        options: 'i',
      })
    }
  ])).orderBy('_createTime', 'desc').get().then(res => {
    module.exports.default.data.adSwiperList = res.data
    wx.setStorage({
      key:"adSwiperList",
      data:res.data
    })
  })
}
const getNews = () => {
  db.collection('zixunxinxi').orderBy('_createTime', 'desc').get().then(res => {
    module.exports.default.data.zixunxinxi = res.data
    wx.setStorage({
      key:"zixunxinxi",
      data:res.data
    })
  })
}
const getStartImage = () => {
  db.collection('shouyetanchucengguanggao').orderBy('_createTime', 'desc').get().then(res => {
    log(res)
    module.exports.default.data.startImage = res.data
    wx.setStorage({
      key:"startImage",
      data:res.data
    })
  })
}
const getAllHouseList = () => {
  let key = ''
  if(wx.getStorageSync('curCity')){
    key = wx.getStorageSync('curCity')
  }else{
    key = '成都市'
    wx.setStorageSync('curCity', '成都市')
  }
//   db.collection('dangeloupanxiangqing').limit(10).where(_.or([{
//     name: db.RegExp({
//       regexp: '.*' + key,
//       options: 'i',
//     })
//   },
//   {
//     chengshi: db.RegExp({
//       regexp: '.*' + key,
//       options: 'i',
//     })
//   }
// ])).get().then(res => {
  db.collection('dangeloupanxiangqing').orderBy('_createTime', 'desc').get().then(res => {
    let houselist = res.data
    log('[houselist]',houselist)
    for (var i = 0, markersData = []; i < houselist.length; i++) {
      let jingweidu = houselist[i]['jingweidu'].split(',')
      markersData.push({
        "iconPath": "../../assets/image/location.png",
        "id": houselist[i]['_id'],
        "latitude": jingweidu[0],
        "longitude": jingweidu[1],
        "width": 30,
        "height": 30,
        "callout": {
          "id": houselist[i]['_id'],
          "content": houselist[i]['loupanmingcheng'] + "\n" + houselist[i]['loupandanjia'],
          "display": "ALWAYS",
          "padding": 5,
          "bgColor": "#D25D5D",
          "borderColor": "#D25D5D",
          "color": "#fff",
          "borderRadius": 5,
          "fontSize": 14,
          "textAlign": "center",
          "areaName": houselist[i]['chengshi'] + houselist[i]['loupanmingcheng'],
          "logoUrl": "https://xsfile.bgy.com.cn/fileservice/file/view?fileId=f6ec2f90-7da2-442a-a555-ff9fbbd24ea9",
          "city": houselist[i]['chengshi'],
          "region": houselist[i]['jutidizhi'],
          "lables": houselist[i]['biaoqian'],
          "averagePriceJoin": houselist[i]['loupandanjia'],
          "areaIntervalJoin": houselist[i]['jianzumianji']
        }
      });
    }
    let homepageHouseList = res.data.filter(function (entry) {
      return entry.chengshi === key;
    });
    wx.setStorage({
      key:"allHouseList",
      data:res.data
    })
    wx.setStorage({
      key:"homepageHouseList",
      data:homepageHouseList
    })
    wx.setStorage({
      key:"markersData",
      data:markersData
    })
    module.exports.default.data.markersData = markersData
    module.exports.default.data.allHouseList = res.data
    module.exports.default.data.homepageHouseList = homepageHouseList
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
  getNews()
  getStartImage()
  getdailirenList()
  getGoufangzhengce()
  getMaifangliucheng()
}
const initStorageData =async () =>{
  module.exports.default.data.zixunxinxi = wx.getStorageSync('zixunxinxi')
  module.exports.default.data.startImage = wx.getStorageSync('startImage')
  module.exports.default.data.dailiren = wx.getStorageSync('dailiren')
  module.exports.default.data.swiperList = wx.getStorageSync('swiperList')
  module.exports.default.data.adSwiperList = wx.getStorageSync('adSwiperList')
  module.exports.default.data.allHouseList = wx.getStorageSync('allHouseList')
  module.exports.default.data.goufangzhengce = wx.getStorageSync('goufangzhengce')
  module.exports.default.data.maifangliucheng = wx.getStorageSync('maifangliucheng')
  module.exports.default.data.homepageHouseList = wx.getStorageSync('homepageHouseList')
  module.exports.default.data.markersData = wx.getStorageSync('markersData')
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