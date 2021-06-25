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
import pinyin from "wl-pinyin"
import {
  promisifyAll
} from 'wx-promise-pro'
promisifyAll()
import create from '../../util/create'
import store from '../../store/index'
const form = require("../../util/formValidation.js")

create(store, {
  use: [
    'allRentHouseList',
    'rentHouseMarkersData',
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
    'startImage',
    'curCity'
  ],
  data: {
    scrollTop: 0,
    currentTag: 'shouye',
    false: false,
    true: true,
    latitude: 30.5702,
    longitude: 104.06476,
    btnList: [],
    shareBtnList: [{
      bgColor: "#ffffff",
      imgUrl: "cloud://lunfanglue-7g33jtt446e6cefa.6c75-lunfanglue-7g33jtt446e6cefa-1306211988/huodongBtn.svg",
      text: "活动中心",
      fontSize: 34,
      color: "#fff"
    }, {
      bgColor: "#ffffff",
      imgUrl: "cloud://lunfanglue-7g33jtt446e6cefa.6c75-lunfanglue-7g33jtt446e6cefa-1306211988/shareBtn.svg",
      text: "分享抽奖",
      fontSize: 34,
      color: "#fff"
    }, {
      bgColor: "#ffffff",
      imgUrl: "cloud://lunfanglue-7g33jtt446e6cefa.6c75-lunfanglue-7g33jtt446e6cefa-1306211988/find.svg",
      text: "求租求购",
      fontSize: 34,
      color: "#fff"
    }],
    mapsetting: {
      skew: 0,
      rotate: 0,
      showLocation: false,
      showScale: false,
      subKey: 'NILBZ-E3U3F-V2WJ5-NS7HA-BH5CH-GOBR7',
      layerStyle: 2,
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
    region: ['四川省', '锦江区', '锦江区'],
    scrollLeft: 0,
    isShowLocation: true,
    cardCur: 0,
    curCity: '锦江区',
    curDaili: {
      name: '',
      level: '',
      phone: '',
      id: ''
    },
    modalName: '',
    ruzhuList: [{}]
  },
  onLoad: function (options) {
    log('options', options)
    // const t = this
    //     var token = jwt.sign({ foo: 'bar' }, privateKey, { algorithm: 'RS256' });

    //     const signedData = jwths256.encode(EncodingAESKey, {
    //       uid: t.globalData.openid, 
    //       data: {
    //          q:"微信智言与微信智聆两大技术的支持下，微信AI团队推出了“微信对话开放平台”和“腾讯小微”智能硬件两大核心产品。微信支付团队最新发布的“微信青蛙Pro”在现场设置了体验区，让大家感受AI认脸的本事。"
    //       }
    //     }
    // )
    //     wx.request({
    //       url: 'https://openai.weixin.qq.com/openapi/nlp/tokenize/WmlasdlPkVIUh9hvwdKaVA1CRCYSaX',
    //       data: {
    //         query: signedData
    //       },
    //       enableCache: true,
    //       enableHttp2: true,
    //       enableQuic: true,
    //       method: 'post',
    //       responseType: responseType,
    //       timeout: 0,
    //       success: (result) => {},
    //       fail: (res) => {},
    //       complete: (res) => {},
    //     })

    wx.setStorageSync('hongbuyuCishu', 1)
    if (options.pageid == 'luckdraw') {
      wx.navigateTo({
        url: '../luckdraw/luckdraw',
      })
    }
    const t = this
    t.getUserLocation()
    if (wx.getStorageSync('curCity')) {
      let curCity = wx.getStorageSync('curCity')
      t.setData({
        curCity: curCity
      })
      t.store.data.curCity = curCity
      t.revAddress(curCity)
    } else {
      t.setData({
        curCity: '锦江区'
      })
      t.store.data.curCity = curCity
      t.revAddress('锦江区')
    }
  },
  bindRegionChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    const t = this
    t.setData({
      curCity: e.detail.value[2]
    })
    t.store.data.curCity = e.detail.value[2]
    // t.store.data.longitude = Number(selectedCity.location.longitude),
    // t.store.data.latitude = Number(selectedCity.location.latitude)
    let revAddressName = e.detail.value[0] + e.detail.value[1] + e.detail.value[2]
    log('[pickerRegon]', revAddressName, e.detail.value[2])
    t.revAddress(revAddressName)
    t.reloadData(e.detail.value[2])
  },
  showADmodal(e) {
    this.setData({
      modalName: 'startImage'
    })
  },
  onClickShareBtn(e) {
    let index = e.detail.index
    switch (index) {
      case -1:
        util.toast("您点击了悬浮按钮")
        break;
      case 0:
        wx.navigateTo({
          url: "/pages/huodong/huodong"
        })
        break;
      case 1:
        wx.showShareMenu({
          withShareTicket: true,
          menus: ['shareAppMessage', 'shareTimeline'],
          success(res) {
            console.log('showShareMenu', res);
          }
        })
        break;
      case 2:
        wx.navigateTo({
          url: "/pages/shequ/shequ"
        })
        break;
      default:
        break;
    }
  },
  onPullDownRefresh: function () {
    this.getUserLocation()
  },
  navQiuzuqiugou() {
    wx.navigateTo({
      url: '../shequ/shequ'
    })
  },
  // onPageScroll(e) {
  //   this.setData({
  //     scrollTop: e.scrollTop
  //   })
  // },
  navNewsDetail(e) {
    log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../news/detail/detail?detailid=' + e.currentTarget.dataset.id
    })
  },
  navGoufangzizi() {
    wx.navigateTo({
      url: '../fangchanwenda/fangchanwenda'
    })
  },
  onReady() {
    const t = this
    t.selectComponent('#startScreen').screenFadeOut()
    t.showADmodal()
    // let houselist = t.store.data.allHouseList
    // log('[houselist]',houselist)
    // for (var i = 0, markersData = []; i < houselist.length; i++) {
    //   let jingweidu = houselist[i]['jingweidu'].split(',')
    //   markersData.push({
    //     "iconPath": "cloud://lunfanglue-7g33jtt446e6cefa.6c75-lunfanglue-7g33jtt446e6cefa-1306211988/location.png",
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
          tijiaoshijian: app.getCurrentTime()
        }
      })
      .then(res => {
        console.log(res)
        wx.showToast({
          title: '提交成功',
        })
        wx.pro.hideLoading()
        t.hideModal()
      })
      .catch(console.error)
  },
  vipsubmitForm(e) {
    log(e)
    const t = this
    let rules = [{
        name: "nameInput",
        rule: ["required", "minLength:2", "maxLength:30"],
        msg: ["请输入姓名", "必须2个或以上字符", "姓名不能超过20个字符"]
      },
      {
        name: "phoneInput",
        rule: ["required", "isMobile"],
        msg: ["请输入手机号", "请输入正确的手机号"]
      }
    ];
    let formData = e.detail.value;
    let checkRes = form.validation(formData, rules);
    if (!checkRes) {
      log('验证通过')
      wx.pro.showLoading({
        title: '提交中',
      })
      let _key = t.store.data.curCity
      let temp = _key + 'gukeyuyue'
      let database = pinyin.getPinyin(temp).replace(/\s+/g, "");
      db.collection(database).add({
          data: {
            guketijiaolaiyuan: "首页VIP选房小帮手",
            username: e.detail.value.nameInput,
            userphone: e.detail.value.phoneInput,
            tijiaoshijian: app.getCurrentTime()
          }
        })
        .then(res => {
          console.log(res)
          wx.pro.hideLoading()
          t.hideModal()
        })
        .catch(console.error)
    } else {
      wx.showToast({
        title: checkRes,
        icon: "none"
      });
    }

  },
  selectCity() {
    const key = 'NILBZ-E3U3F-V2WJ5-NS7HA-BH5CH-GOBR7'; // 使用在腾讯位置服务申请的key
    const referer = '论方略'; // 调用插件的app的名称
    const hotCitys = '成都,德阳,资阳';
    wx.navigateTo({
      url: `plugin://citySelector/index?key=${key}&referer=${referer}&hotCitys=${hotCitys}`,
    })
  },
  onShow() {
    const t = this
    // const selectedCity = citySelector.getCity(); // 选择城市后返回城市信息对象，若未选择返回null
    // log(selectedCity)
    // if (selectedCity == null) {

    // } else {
    //   log('selectedCity !== null', selectedCity)
    //   t.setData({
    //     curCity: selectedCity.fullname
    //   })
    //   t.store.data.longitude = Number(selectedCity.location.longitude),
    //     t.store.data.latitude = Number(selectedCity.location.latitude)
    //   wx.setStorageSync('curCity', selectedCity.fullname)
    //   t.reloadData(selectedCity.fullname)
    // }
  },
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  markertap(e) {
    log(e.detail.markerId, e)
    let houseId = this.store.data.allHouseList[e.detail.markerId - 900000000]
    wx.navigateTo({
      url: '../housedetail/housedetail?houseId=' + e.detail.markerId
    })
  },
  revAddress(revAddressName) {
    const t = this;
    let dizhi = revAddressName + '政府'
    qqmapsdk.geocoder({
      address: dizhi, //地址参数
      success: function (res) {
        log('[revAddressName]', dizhi, res)
        t.store.data.longitude = res.result.location.lng,
          t.store.data.latitude = res.result.location.lat
      },
      fail: function (error) {
        console.error(error);
      },
    })
  },
  navMap() {
    wx.navigateTo({
      url: './mapDetail/mapDetail',
    })
  },
  navQiyefuwu() {
    wx.navigateTo({
      url: '../qiyefuwuhuodong/qiyefuwuhuodong',
    })
  },
  navAboutus() {
    wx.navigateTo({
      url: '../aboutus/aboutus',
    })
  },
  helpVIPTofindHouse() {
    const t = this
    t.setData({
      modalName: 'helpVIPTofindHouse'
    })
  },
  navHousedetail(e) {
    log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../housedetail/housedetail?houseId=' + e.currentTarget.dataset.id,
    })
  },
  navDetailDailiren(e) {
    log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../detailDailiren/detailDailiren?dailirenId=' + e.currentTarget.dataset.id,
    })
  },
  goToAllhouseList(e) {
    log(e.currentTarget.dataset.housetag)
    wx.navigateTo({
      url: '../allhouseList/allhouseList?housetag=' + e.currentTarget.dataset.housetag
    })
  },
  goToAllRentHouseList(e) {
    log(e.currentTarget.dataset.housetag)
    wx.navigateTo({
      url: '../allRentHouseList/allRentHouseList?housetag=' + e.currentTarget.dataset.housetag
    })
  },
  navGongju() {
    wx.navigateTo({
      url: '../fangdaijisuan/sydk/sydk'
    })
  },
  navHuodong(e) {
    wx.navigateTo({
      url: '../huodong/huodong'
    })
  },
  navDetailHuodong(e) {
    log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../huodong/detail/detail?detailid=' + e.currentTarget.dataset.id
    })
  },

  gotoMap() {
    log('[gotoMap]')
  },
  onShareAppMessage: function (options) {
    log('onShareAppMessage')
    var that = this
    var shareObj = {
      title: "论方略",
      path: '/pages/index/index',
      imageUrl: '',
      success: function (res) {
        log(res)
        if (res.errMsg == 'shareAppMessage:ok') {}
      },
      fail: function () {
        if (res.errMsg == 'shareAppMessage:fail cancel') {} else if (res.errMsg == 'shareAppMessage:fail') {}
      }
    }
    if (options.from == 'button') {
      var eData = 'luckdraw'
      shareObj.title = '买房就上论方略-有奖派送'
      shareObj.imageUrl = 'cloud://lunfanglue-7g33jtt446e6cefa.6c75-lunfanglue-7g33jtt446e6cefa-1306211988/shareLipin.jpg'
      shareObj.path = '/pages/index/index?pageid=' + eData
      wx.setStorageSync('luckdrawTimes', 1)
    }
    return shareObj;
  },
  swiperNavTarget(e) {
    log(e)
    if (e.currentTarget.dataset.appid) {
      wx.navigateToMiniProgram({
        appId: e.currentTarget.dataset.appid,
        path: e.currentTarget.dataset.route,
        success(res) {
          log(res)
        }
      })
    } else if (e.currentTarget.dataset.guanlianqiyefuwu) {
      wx.navigateTo({
        url: '../qiyefuwuhuodong/detail/detail?detailid=' + e.currentTarget.dataset.guanlianqiyefuwu,
      })
    } else if (e.currentTarget.dataset.guanlianhuodong) {
      wx.navigateTo({
        url: '../huodong/detail/detail?detailid=' + e.currentTarget.dataset.guanlianhuodong,
      })
    } else if (e.currentTarget.dataset.guanlianzixun) {
      wx.navigateTo({
        url: '../news/detail/detail?detailid=' + e.currentTarget.dataset.guanlianzixun,
      })
    }

  },
  navAllDailiren() {
    wx.navigateTo({
      url: '../allDailiren/allDailiren',
    })
  },
  navZixun(e) {
    wx.navigateTo({
      url: '../news/news'
    })
  },
  navRuzhu() {
    wx.navigateTo({
      url: '../ruzhu/ruzhu'
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
    if (searchWord == "") {
      return wx.showToast({
        title: '请输入内容',
        icon: 'error',
        duration: 2000
      })
    }
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
                // setTimeout(() => {
                //   wx.navigateBack()
                // }, 1500)
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
                      // setTimeout(() => {
                      //   wx.navigateBack()
                      // }, 1500)
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
          log(res)
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
        log('[getLocation]', res)
        let latitude = res.latitude
        let longitude = res.longitude
        // t.setData({
        //   latitude:Number(latitude),
        //   longitude:Number(longitude)
        // })
        t.store.data.latitude = Number(latitude),
          t.store.data.longitude = Number(longitude)
        t.revLatitude()
      },
      fail: function (res) {
        if (res.errMsg === 'getLocation:fail:auth denied') {
          wx.showToast({
            title: '拒绝授权',
            icon: 'none'
          })
          // setTimeout(() => {
          //   wx.navigateBack()
          // }, 1500)
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
        }
      }
    })
  },
  revLatitude(e) {
    var t = this;
    qqmapsdk.reverseGeocoder({
      location: t.store.data.latitude + ',' + t.store.data.longitude || '',
      success: function (res) { //成功后的回调
        log('revLatitude', res)
        var city = res.result.address_component.district;
        if (wx.getStorageSync('curCityy') !== city) {
          wx.setStorageSync('curCity', city)
          t.setData({
            curCity: city
          })
          t.store.data.curCity = city
          t.reloadData(city)
        } else if (wx.getStorageSync('curCityy') == city) {

        }
        wx.setStorage({
          data: res.result,
          key: 'address',
        })
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    })
  },
  navDetailQiyefuwu(e) {
    log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../qiyefuwuhuodong/detail/detail?detailid=' + e.currentTarget.dataset.id,
    })
  },
  reloadData(city) {
    const t = this
    wx.stopPullDownRefresh()
    let _key = city
    let dangeloupanxiangqingtemp = _key + 'dangeloupanxiangqing'
    let dailirentemp = _key + 'dailiren'
    let shouyelunbotutemp = _key + 'shouyelunbotu'
    // let shouyezhongjianguanggaolunbotutemp = _key + 'shouyezhongjianguanggaolunbotu'
    let startImagedatabasetemp = _key + 'shouyetanchucengguanggao'
    let zixunxinxitemp = _key + 'zixunxinxi'
    let rentHousetemp = _key + 'rentHouse'

    let dailirendatabase = pinyin.getPinyin(dailirentemp).replace(/\s+/g, "");
    let dangeloupanxiangqingdatabase = pinyin.getPinyin(dangeloupanxiangqingtemp).replace(/\s+/g, "");
    let startImagedatabase = pinyin.getPinyin(startImagedatabasetemp).replace(/\s+/g, "");
    let shouyelunbotudatabase = pinyin.getPinyin(shouyelunbotutemp).replace(/\s+/g, "");
    // let shouyezhongjianguanggaolunbotudatabase = pinyin.getPinyin(shouyezhongjianguanggaolunbotutemp).replace(/\s+/g, "");
    let zixunxinxidatabase = pinyin.getPinyin(zixunxinxitemp).replace(/\s+/g, "");
    let rentHousedatabase = pinyin.getPinyin(rentHousetemp).replace(/\s+/g, "");

    log('首页轮播图DATABASE', shouyelunbotudatabase)
    log('开屏广告DATABASE', startImagedatabase)
    log('最新资讯DATABASE', zixunxinxidatabase)
    log('代理人DATABASE', dailirendatabase)
    log('新房DATABASE', dangeloupanxiangqingdatabase)
    log('租房DATABASE', rentHousedatabase)

    const setNoneData = () => {
      t.store.data.markersData = []
      t.store.data.rentHouseMarkersData = []
      t.store.data.adSwiperList = []
      t.store.data.swiperList = []
      t.store.data.zixunxinxi = []
      t.store.data.startImage = []
      t.store.data.dailiren = []
      t.store.data.allHouseList = []
      t.store.data.maifangliucheng = []
      t.store.data.goufangzhengce = []
    }

    db.collection(dangeloupanxiangqingdatabase).orderBy('_createTime', 'desc').get().then(res => {
      let houselist = res.data
      log('[houselist]', houselist)
      for (var i = 0, markersData = []; i < houselist.length; i++) {
        let jingweidu = houselist[i]['jingweidu'].split(',')
        markersData.push({
          "iconPath": "https://6c75-lunfanglue-7g33jtt446e6cefa-1306211988.tcb.qcloud.la/dly_sydc_icon%403x.png?sign=4b5a163eb5ff8634e4459a7f375988db&t=1623923855",
          "id": houselist[i]['_id'],
          "latitude": jingweidu[0],
          "longitude": jingweidu[1],
          "width": 30,
          "height": 30,
          "callout": {
            "id": houselist[i]['_id'],
            "content": houselist[i]['loupanmingcheng'] + "\n" + houselist[i]['loupandanjia'],
            "display": "ALWAYS",
            "padding": 10,
            "bgColor": "#89A8FB",
            "borderColor": "#ffffff",
            "color": "#fff",
            "borderRadius": 20,
            "fontSize": 14,
            "textAlign": "center",
            "areaName": houselist[i]['chengshi'] + houselist[i]['loupanmingcheng'],
            "logoUrl": "https://6c75-lunfanglue-7g33jtt446e6cefa-1306211988.tcb.qcloud.la/dly_sydc_icon%403x.png?sign=4b5a163eb5ff8634e4459a7f375988db&t=1623923855",
            "city": houselist[i]['chengshi'],
            "region": houselist[i]['jutidizhi'],
            "lables": houselist[i]['biaoqian'],
            "averagePriceJoin": houselist[i]['loupandanjia'],
            "areaIntervalJoin": houselist[i]['jianzumianji']
          }
        });
      }
      t.store.data.markersData = markersData
      t.store.data.allHouseList = res.data

      if (houselist.length == 0) {
        wx.showModal({
          cancelText: '不了',
          confirmText: '好的',
          content: '是否切换城市',
          showCancel: true,
          title: '您当前城市没有楼盘数据',
          success: (res) => {
            if (res.confirm) {
              t.selectCity()
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
              wx.setStorageSync('isChangeCity', false)
            }
          },
          fail: (res) => {},
          complete: (res) => {},
        })
      }
    }).catch(err => {
      console.error('dangeloupanxiangqingdatabase', err)
    })

    db.collection(rentHousedatabase).orderBy('_createTime', 'desc').get().then(res => {
      let houselist = res.data
      log('[houselist]',houselist)
      for (var i = 0, rentHouseMarkersData = []; i < houselist.length; i++) {
        let jingweidu = houselist[i]['jingweidu'].split(',')
        rentHouseMarkersData.push({
          "iconPath": "https://6c75-lunfanglue-7g33jtt446e6cefa-1306211988.tcb.qcloud.la/dly_sydc_icon%403x.png?sign=4b5a163eb5ff8634e4459a7f375988db&t=1623923855",
          "id": houselist[i]['_id'],
          "latitude": jingweidu[0],
          "longitude": jingweidu[1],
          "width": 30,
          "height": 30,
          "callout": {
            "id": houselist[i]['_id'],
            "content": houselist[i]['xiaoqumingcheng'] + "\n" + houselist[i]['rentMoney'] + '元/月',
            "display": "ALWAYS",
            "padding": 10,
            "bgColor": "#89A8FB",
            "borderColor": "#ffffff",
            "color": "#fff",
            "borderRadius": 20,
            "fontSize": 14,
            "textAlign": "center",
            "areaName": houselist[i]['quxian'] + houselist[i]['xiaoqumingcheng'],
            "logoUrl": "https://6c75-lunfanglue-7g33jtt446e6cefa-1306211988.tcb.qcloud.la/dly_sydc_icon%403x.png?sign=4b5a163eb5ff8634e4459a7f375988db&t=1623923855",
            "city": houselist[i]['quxian'],
            "region": houselist[i]['jutidizhi'],
            "lables": houselist[i]['tag'],
            "averagePriceJoin": houselist[i]['rentMoney'],
            "areaIntervalJoin": houselist[i]['mianji']
          }
        });
      }
      t.store.data.rentHouseMarkersData = rentHouseMarkersData
      t.store.data.allRentHouseList = res.data
    })

    db.collection('qiyefuwulunbotu').orderBy('_createTime', 'desc').get().then(res => {
      t.store.data.adSwiperList = res.data
    })
    db.collection(dailirendatabase).orderBy('paimingshunxu', 'desc').get().then(res => {
      t.store.data.dailiren = res.data
    })

    db.collection(zixunxinxidatabase).orderBy('_createTime', 'desc').get().then(res => {
      t.store.data.zixunxinxi = res.data
    }).catch(err => {
      log(err)
      setNoneData()
      wx.showToast({
        icon: "error",
        title: '当前区域无楼盘数据',
      })
    })

    db.collection(startImagedatabase).orderBy('_createTime', 'desc').get().then(res => {
      t.store.data.startImage = res.data
    })

    db.collection(shouyelunbotudatabase).orderBy('_createTime', 'desc').get().then(res => {
      t.store.data.swiperList = res.data
    })
  }
})