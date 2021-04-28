const log = console.log.bind(console)
const group = console.group.bind(console)
const groupEnd = console.groupEnd.bind(console)
const error = console.error.bind(console)
require("pages/fangdaijisuan/utils/service");

var a = require("pages/fangdaijisuan/utils/util.js"),
  t = a.liLvApi,
  e = a.trimAll;
App({
  onLaunch: function () {
    this.getSysInfo()
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }

    this.globalData = {}
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
  getMenuData: function (a) {
  },
  getSysInfo() {
    const that = this
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.systemInfo = res;
        var l = e(res.model);
        l = l.toLowerCase(), that.globalData.isIpx = l.indexOf("iphonex") > -1, console.log(res);
      }
    }), this.getLiLvList().then(function (a) {});
  },
  globalData: {
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
})