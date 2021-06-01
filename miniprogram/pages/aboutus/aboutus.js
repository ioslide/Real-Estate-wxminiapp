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
import pinyin from "wl-pinyin"
import {
  promisifyAll
} from 'wx-promise-pro'
promisifyAll()

create(store, {
  use: [
  ],
  data: {
    currentTab: 0,
    tabs2: [{
      name: "品牌简介"
    }, {
      name: "服务宗旨"
    }, {
      name: "品牌理念"
    }, {
      name: "品牌愿景"
    },
    {
      name: "品牌logo"
    }],
    winHeight: "", //窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0 //tab标题的滚动条位置
  },
  onLoad: function (options) {
    const t = this
    wx.getSystemInfo({
      success: function(res) {
        let calc = res.windowHeight; //顶部脱离文档流了(- res.windowWidth / 750 * 100);
        t.setData({
          winHeight: calc
        });
      }
    });
    db.collection('gongsijieshao').get().then(res => {
      log(res.data[0])
      t.setData({
        gongsijieshao: res.data[0]
      })
    })
  },
  change(e) {
    this.setData({
      currentTab: e.detail.index
    })
  },
    // 滚动切换标签样式
    switchTab: function(e) {
      let that = this;
      that.setData({
        currentTab: e.detail.current
      });
      that.checkCor();
    },
    // 点击标题切换当前页时改变样式
    swichNav: function(e) {
      let cur = e.currentTarget.dataset.current;
      if (this.data.currentTab == cur) {
        return false;
      } else {
        this.setData({
          currentTab: cur
        })
      }
    },
    navZixun(e) {
      wx.navigateTo({
        url: '../news/news'
      })
    },
    navRuzhu(){
      wx.navigateTo({
        url: '../ruzhu/ruzhu'
      })
    },
    //判断当前滚动超过一屏时，设置tab标题滚动条。
    checkCor: function() {
      let that = this;
      if (that.data.currentTab > 3) {
        that.setData({
          scrollLeft: 300
        })
      } else {
        that.setData({
          scrollLeft: 0
        })
      }
    },
    detail(e) {
      wx.navigateTo({
        url: '../extend-view/newsDetail/newsDetail'
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