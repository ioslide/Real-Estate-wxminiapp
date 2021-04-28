const app = getApp()
const globalData = getApp().globalData
const log = console.log.bind(console)
const group = console.group.bind(console)
const groupEnd = console.groupEnd.bind(console)
const error = console.error.bind(console)
const db = wx.cloud.database()
const _ = db.command
const apiLists = require('../../config/config.js').apiLists
const citySelector = requirePlugin('citySelector');
const QQMapWX = require('../../util/qqmap-wx-jssdk.min.js');
var qqmapsdk = new QQMapWX({
  key: 'NILBZ-E3U3F-V2WJ5-NS7HA-BH5CH-GOBR7'
});

import {
  promisifyAll
} from 'wx-promise-pro'
promisifyAll()
import create from '../../util/create'
import store from '../../store/index'

create(store, {
  data: {
    false: false,
    true: true,
    latitude:30.5702,
    longitude:104.06476,
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
    windowWidth: wx.getSystemInfoSync().windowWidth,
    TabCur: 0,
    scrollLeft: 0,
    isShowLocation: true,
    cardCur: 0,
    curCity: '成都市',
    curDaili: {
      name: '',
      level: '',
      phone: '',
      id: ''
    },
    modalName: 'startImage',
    use: [
      'adSwiperList',
      'swiperList',
      'dailiren',
      'allHouseList',
      'homepageHouseList',
      'maifangliucheng',
      'goufangzhengce',
      'markersData',
      'latitude',
      'longitude',
      'zixunxinxi',
      'startImage'
    ],
  },
  onLoad: function () {
    const t = this
    t.getUserLocation()
    if (wx.getStorageSync('curCity')) {
      let curCity = wx.getStorageSync('curCity')
      t.setData({
        curCity: curCity
      })
      t.revAddress(curCity)
    } else {
      t.setData({
        curCity: '成都市'
      })
      t.revAddress('成都市')
    }
  },
  navNewsDetail(e){
    log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../news/detail/detail?detailid=' + e.currentTarget.dataset.id
    })
  },
  onReady() {
    const t = this
    // let houselist = t.store.data.allHouseList
    // log('[houselist]',houselist)
    // for (var i = 0, markersData = []; i < houselist.length; i++) {
    //   let jingweidu = houselist[i]['jingweidu'].split(',')
    //   markersData.push({
    //     "iconPath": "../../assets/image/location.png",
    //     "id": houselist[i]['_id'],
    //     "latitude": jingweidu[0],
    //     "longitude": jingweidu[1],
    //     "width": 30,
    //     "height": 30,
    //     "callout": {
    //       "id": houselist[i]['_id'],
    //       "content": houselist[i]['loupanmingcheng'] + "\n" + houselist[i]['loupandanjia'],
    //       "display": "ALWAYS",
    //       "padding": 5,
    //       "bgColor": "#D25D5D",
    //       "borderColor": "#4BA6EE",
    //       "color": "#fff",
    //       "borderRadius": 5,
    //       "fontSize": 14,
    //       "textAlign": "center",
    //       "areaName": houselist[i]['chengshi'] + houselist[i]['loupanmingcheng'],
    //       "logoUrl": "https://xsfile.bgy.com.cn/fileservice/file/view?fileId=f6ec2f90-7da2-442a-a555-ff9fbbd24ea9",
    //       "city": houselist[i]['chengshi'],
    //       "region": houselist[i]['jutidizhi'],
    //       "lables": houselist[i]['biaoqian'],
    //       "averagePriceJoin": houselist[i]['loupandanjia'],
    //       "areaIntervalJoin": houselist[i]['jianzumianji']
    //     }
    //   });
    // }
    // t.setData({
    //   markersData: markersData
    // })
    
    // log('[markersData]', markersData, houselist.length)
  },
  onUnload() {
    citySelector.clearCity();
  },
  handlePhone(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
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
  hideModal(e) {
    this.setData({
      modalName: null
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
          jiedaidailixingming: t.data.curDaili.name,
          jiedaidailidianhua: t.data.curDaili.phone,
          dailiid: t.data.curDaili.id,
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
  selectCity() {
    const key = 'NILBZ-E3U3F-V2WJ5-NS7HA-BH5CH-GOBR7'; // 使用在腾讯位置服务申请的key
    const referer = '搜房客'; // 调用插件的app的名称
    const hotCitys = '成都,德阳';
    wx.navigateTo({
      url: `plugin://citySelector/index?key=${key}&referer=${referer}&hotCitys=${hotCitys}`,
    })
  },
  onShow() {
    const t = this
    const selectedCity = citySelector.getCity(); // 选择城市后返回城市信息对象，若未选择返回null
    log(selectedCity)
    if (selectedCity == null) {

    } else {
      log('selectedCity !== null', selectedCity)
      t.setData({
        curCity: selectedCity.fullname,
        // longitude:Number(selectedCity.location.longitude),
        // latitude:Number(selectedCity.location.latitude)
      })
      t.store.data.longitude =Number(selectedCity.location.longitude),
      t.store.data.latitude = Number(selectedCity.location.latitude)
      wx.setStorageSync('curCity', selectedCity.fullname)
      db.collection('dangeloupanxiangqing').limit(10).where(_.or([{
          name: db.RegExp({
            regexp: '.*' + selectedCity.name,
            options: 'i',
          })
        },
        {
          chengshi: db.RegExp({
            regexp: '.*' + selectedCity.fullname,
            options: 'i',
          })
        }
      ])).get().then(res => {
          log(res.data)
          if (res.data.length > 0) {
            t.store.data.homepageHouseList = res.data
            wx.setStorage({
              key: "homepageHouseList",
              data: res.data
            })
          } else {
            t.store.data.homepageHouseList = []
            wx.setStorage({
              key: "homepageHouseList",
              data: []
            })
          }
      })

      db.collection('shouyezhongjianguanggaolunbotu').where(_.or([
        {
          chengshi: db.RegExp({
            regexp: '.*' + selectedCity.fullname,
            options: 'i',
          })
        }
      ])).orderBy('_createTime', 'desc').get().then(res => {
        t.store.data.adSwiperList = res.data
        wx.setStorage({
          key:"adSwiperList",
          data:res.data
        })
      })

      db.collection('shouyelunbotu').where(_.or([
        {
          chengshi: db.RegExp({
            regexp: '.*' + selectedCity.fullname,
            options: 'i',
          })
        }
      ])).orderBy('_createTime', 'desc').get().then(res => {
        t.store.data.swiperList = res.data
        wx.setStorage({
          key:"swiperList",
          data:res.data
        })
      })

      db.collection('dailiren').where(_.or([
        {
          chengshi: db.RegExp({
            regexp: '.*' +  selectedCity.fullname,
            options: 'i',
          })
        }
      ])).orderBy('paimingshunxu', 'desc').get().then(res => {
          t.store.data.dailiren = res.data
          wx.setStorage({
            key:"dailiren",
            data:res.data
          })
        })
    }
  },
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  markertap(e){
    let houseId = this.store.data.allHouseList[e.detail.markerId - 900000000]
    wx.navigateTo({
      url: '../housedetail/housedetail?houseId=' + houseId._id,
    })
  },
  revAddress(revAddress) {
    const t = this;
    let dizhi = revAddress + '政府'
    qqmapsdk.geocoder({
      address: dizhi, //地址参数
      success: function (res) {
        log('[revAddress]', dizhi,res)
        // t.setData({
        //   latitude:Number(res.result.location.lat),
        //   longitude:Number(res.result.location.lng)
        // })
        // log(latitude, longitude);
        t.store.data.longitude = res.result.location.lng,
        t.store.data.latitude = res.result.location.lat
      },
      fail: function (error) {
        console.error(error);
      },
    })
  },
  navMap(){
    wx.navigateTo({
      url: './mapDetail/mapDetail',
    })
  },
  navQiyefuwu(){
    wx.navigateTo({
      url: '../qiyefuwuhuodong/qiyefuwuhuodong',
    })
  },
  navLowPriceHouseList(){
    wx.navigateTo({
      url: '../lowPriceHouseList/lowPriceHouseList',
    })
  },
  navHousedetail(e) {
    log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../housedetail/housedetail?houseId=' + e.currentTarget.dataset.id,
    })
  },
  navDetailDailiren(e){
    log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../detailDailiren/detailDailiren?dailirenId=' + e.currentTarget.dataset.id,
    })
  },
  goToAllhouseList(){
    wx.navigateTo({
      url: '../allhouseList/allhouseList'
    })
  },
  navGongju(){
    wx.navigateTo({
      url: '../fangdaijisuan/sydk/sydk'
    })
  },
  navHuodong(e) {
    wx.navigateTo({
      url: '../huodong/huodong'
    })
  },
  navDetailHuodong(e){
    log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../huodong/detail/detail?detailid=' + e.currentTarget.dataset.id
    })
  },
  navHome() {
    wx.navigateTo({
      url: '../index/index'
    })
  },
  gotoMap() {
    log('[gotoMap]')
  },
  onShareAppMessage() {
    const promise = new Promise(resolve => {
      setTimeout(() => {
        resolve({
          title: '搜房客'
        })
      }, 2000)
    })
    return {
      title: '搜房客',
      path: '/pages/index/index?id=123',
      promise
    }
  },
  navApp(e) {
    log(e)
    wx.navigateToMiniProgram({
      appId: e.currentTarget.dataset.appid,
      path: e.currentTarget.dataset.route,
      success(res) {
        log(res)
      }
    })
  },
  navAllDailiren(){
    wx.navigateTo({
      url: '../allDailiren/allDailiren',
    })
  },
  navZixun(e) {
    wx.navigateTo({
      url: '../news/news'
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
  searchArean(e) {
    log('[searchWord]', e.detail.value)
    let searchWord = e.detail.value
    wx.navigateTo({
      url: '../searchPage/searchPage?searchWord=' + searchWord,
    })
  },
  getUserLocation: function () {
    let t = this
    wx.getSetting({
        success: (res) => {
            // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
            // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
            // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
            // 拒绝授权后再次进入重新授权
            if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
                // console.log('authSetting:status:拒绝授权后再次进入重新授权', res.authSetting['scope.userLocation'])
                wx.showModal({
                    title: '',
                    content: '授权地理位置以提供附件房源',
                    success: function (res) {
                        if (res.cancel) {
                            wx.showToast({
                                title: '拒绝授权',
                                icon: 'none'
                            })
                            setTimeout(() => {
                                wx.navigateBack()
                            }, 1500)
                        } else if (res.confirm) {
                            wx.openSetting({
                                success: function (dataAu) {
                                    // console.log('dataAu:success', dataAu)
                                    if (dataAu.authSetting["scope.userLocation"] == true) {
                                        //再次授权，调用wx.getLocation的API
                                        t.getLocation(dataAu)
                                    } else {
                                        wx.showToast({
                                            title: '授权失败',
                                            icon: 'none'
                                        })
                                        setTimeout(() => {
                                            wx.navigateBack()
                                        }, 1500)
                                    }
                                }
                            })
                        }
                    }
                })
            }
            // 初始化进入，未授权
            else if (res.authSetting['scope.userLocation'] == undefined) {
                // console.log('authSetting:status:初始化进入，未授权', res.authSetting['scope.userLocation'])
                //调用wx.getLocation的API
                t.getLocation(res)
            }
            // 已授权
            else if (res.authSetting['scope.userLocation']) {
                // console.log('authSetting:status:已授权', res.authSetting['scope.userLocation'])
                //调用wx.getLocation的API
                t.getLocation(res)
            }
        }
    })
},
// 微信获得经纬度
getLocation: function (userLocation) {
    let t = this
    wx.getLocation({
        type: "wgs84",
        success: function (res) {
            // console.log('getLocation:success', res)
            log('[getLocation]',res)
            let latitude = res.latitude
            let longitude = res.longitude
            // t.setData({
            //   latitude:Number(latitude),
            //   longitude:Number(longitude)
            // })
            t.store.data.latitude =Number(latitude),
            t.store.data.longitude =Number(longitude)
        },
        fail: function (res) {
            if (res.errMsg === 'getLocation:fail:auth denied') {
                wx.showToast({
                    title: '拒绝授权',
                    icon: 'none'
                })
                setTimeout(() => {
                    wx.navigateBack()
                }, 1500)
                return
            }
            if (!userLocation || !userLocation.authSetting['scope.userLocation']) {
                t.getUserLocation()
            } else if (userLocation.authSetting['scope.userLocation']) {
                wx.showModal({
                    title: '',
                    content: '请在系统设置中打开定位服务',
                    showCancel: false,
                    success: result => {
                        if (result.confirm) {
                            wx.navigateBack()
                        }
                    }
                })
            } else {
                wx.showToast({
                    title: '授权失败',
                    icon: 'none'
                })
                setTimeout(() => {
                    wx.navigateBack()
                }, 1500)
            }
        }
    })
}
})