const log = console.log.bind(console)
const group = console.group.bind(console)
const groupEnd = console.groupEnd.bind(console)
const error = console.error.bind(console)
require("./pages/fangdaijisuan/utils/service");
import util from "./util/weapp";
import uma from'umtrack-wx';


var a = require("./pages/fangdaijisuan/utils/util.js"),
  t = a.liLvApi,
  e = a.trimAll;
App({
  globalData: {
    uma :[],
    latitude: 30.664,
    longitude: 104.016,
    StatusBar: "",
    CustomBar: "",
    barHeight: "",
    navigationHeight: "",
    Custom: "",
    pixelRatio: "",
    windowWidth: "",
    windowHeight: "",
    screenWidth: "",
    openid: '',
    unionid: '',
    isIpx: !1,
    systemInfo: {},
    lilvList: null,
    lilvMap: null,
    dkform: {},
    gjjform: {},
    menudata: {
      amt: 0,
      year: "",
      fqtype: 0,
      frommenu: 0
    },
    menu: {}
  },
  umengConfig:{
    appKey:'60acc0d053b67264990f437f',
    useOpenid:true,
    autoGetOpenid:false,// 是否需要通过友盟后台获取openid，如若需要，请到友盟后台设置appId及secret
    debug:true,//是否打开调试模式
    uploadUserInfo:true// 上传用户信息，上传后可以查看有头像的用户分享信息，同时在查看用户画像时，公域画像的准确性会提升。
},
  onLaunch: function (options) {
    const t = this
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')

    } else {
      wx.cloud.init({
        traceUser: true,
      })
      t.getWxcontext()
    }
    if (wx.canIUse("getUpdateManager")) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
      });
      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: "更新提示",
          content: "新版本已经准备好，是否重启应用？",
          success: function (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate();
            } else if (res.cancel) {
              updateManager.applyUpdate();
            }
          }
        });
      });
      updateManager.onUpdateFailed(function () {
        // 新版本下载失败
        console.log("onUpdateFailed");
      });
    } else {
      wx.showModal({
        title: "提示",
        content: "您的微信版本过低，建议升级到最新版本。"
      });
    }
    this.getSystemInfo();
  },
  getWxcontext(){
    const t = this
    log('getWxcontext')
    wx.cloud.callFunction({
      name: "openapi",
      data: {
        action: 'getContext',
      },
    }).then(function (res) {
      log('[wxContext]',res.result)
      wx.uma.setOpenid(res.result.openid)
      t.globalData.openid = res.result.openid
      t.globalData.unionid  = res.result.unionid 
      wx.setStorage({
        data: res.result,
        key: 'wxContext',
      })
      return  res.result
    }).catch(console.error)
  },
  getLiLvList: function () {
    var a = this;
    return new Promise(function (e, l) {
      a.globalData.lilvList ? e(a.globalData.lilvList) : t().then(function (t) {
        var l = {};
        t.map(function (a) {
          l[a.field] = a;
        }), a.globalData.lilvList = t, a.globalData.lilvMap = l, e(a.globalData.lilvList);
      });
    });
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
  toast: function (a) {
    wx.showToast({
      title: a,
      icon: "none"
    }), setTimeout(function () {
      wx.hideToast();
    }, 2e3);
  },
  getLilv: function (a) {
    var e = "";
    e = a >= 5 ? "gt5year" : a > 3 & a <= 5 ? "gt3year" : a > 1 & a <= 3 ? "gt1year" : "1year";
    var l = this;
    return new Promise(function (a, i) {
      l.globalData.lilvMap ? a(l.globalData.lilvMap[e]) : t().then(function (t) {
        var i = {};
        t.map(function (a) {
          i[a.field] = a;
        }), l.globalData.lilvList = t, l.globalData.lilvMap = i, a(l.globalData.lilvMap[e]);
      });
    });
  },
  navMenu: function (a, t) {
    var e = {
      1: "/pages/sydk/sydk",
      2: "/pages/index/index",
      3: "/pages/combdk/combdk"
    } [a];
    wx.reLaunch({
      url: e
    });
  },
  setDkForm: function (a) {
    this.globalData.dkform = a;
  },
  setGjjForm: function (a) {
    this.globalData.gjjform = a;
  },
  setMenuData: function (a, t) {
    this.globalData.menu[a] = t;
  },
  getMenuData: function (a) {},
  getSystemInfo: function () {
    var info = util.getSystemInfoSync();
    var iphoneX = "";
    if (info) {
      var statusBarHeight = info.statusBarHeight;
      var model = info.model;
      var windowHeight = info.windowHeight;
      var totalTopHeight = 68;
      model.indexOf("iPhone X") !== -1 ?
        ((totalTopHeight = 94), (iphoneX = "iphone-x")) :
        -1 !== model.indexOf("iPhone") ? (totalTopHeight = 64) : -1 !== model.indexOf("MI 8") && (totalTopHeight = 88);
      var titleBarHeight = totalTopHeight - statusBarHeight;
      this.globalData.systemInfo = Object.assign({}, info, {
        statusBarHeight,
        titleBarHeight,
        totalTopHeight,
        iphoneX,
        windowHeight
      })
    }
  },
  onShow: function (options) {
    let _this = this;
    wx.getSystemInfo({
      success: res => {
        // 全局存手机信息
        _this.globalData.mobile = res;
        if (res.model.search("iPhone X") != -1) {
          _this.globalData.isIphoneX = true;
        }
      }
    });
  },
})