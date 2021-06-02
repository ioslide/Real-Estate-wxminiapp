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
const form = require("../../util/formValidation.js")
import pinyin from "wl-pinyin"
import {
  promisifyAll
} from 'wx-promise-pro'
promisifyAll()
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
    InputBottom: 0,
    showCancel: false
  },
  onLoad: function (options) {
    
  },
  navDetail(e) {
    log(e)
    const t = this
    wx.navigateTo({
      url: './detail/detail?detailid=' + e.currentTarget.id
    })
    let key = t.store.data.curCity
    let temp = key + 'fangchanwenda'
    let database = pinyin.getPinyin(temp).replace(/\s+/g, "");
    db.collection(database).doc(e.currentTarget.id).update({
      data: {
        chakanrenshu: _.inc(1)
      }
    })
  },
  getShequ() {
    const t = this
    wx.pro.showLoading({
      title: 'Loading'
    })
    let key = t.store.data.curCity
    let temp = key + 'fangchanwenda'
    let database = pinyin.getPinyin(temp).replace(/\s+/g, "");
    db.collection(database).orderBy('_createTime', 'desc').get().then(res => {
      for(let i=0;i<res.data.length;i++){
        wx.cloud.callFunction({
          name: "openapi",
          data: {
            action: 'getTokenize',
            msg : res.data[i].title,
            openid: app.globalData.openid
          },
        }).then(function (result) {
          log('[' + res.data[i].title + ']',result.result)
          res.data[i].tag = result.result.entities
          if(res.data.length == 4){
          log(res.data)
            t.setData({
              fangchanwenda: res.data,
              showCancel: false
            })
            wx.pro.hideLoading()
          }
        }).catch(console.error)
      }
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
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
  submitSearch(e) {
    wx.pro.showLoading({
      title: '提交中',
    })
    log(e)
    const t = this
    let key = e.detail.value
    if (key == "") {
      return wx.showToast({
        title: '请输入文本',
        icon: 'error',
        duration: 2000
      })
    }
    let _key = t.store.data.curCity
    let temp = _key + 'fangchanwenda'
    let database = pinyin.getPinyin(temp).replace(/\s+/g, "");
    db.collection(database).where(_.or([
    {
      title: db.RegExp({
        regexp: '.*' + key + '.*',
        options: 'i',
      })
    }
  ])).orderBy('_createTime', 'desc').get().then(res => {
      t.setData({
        fangchanwenda: res.data,
        showCancel: true
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
  addComment() {
    const t = this
    const judgeTime = () => {
      let nowTime = Date.now();
      let willTime = wx.getStorageSync('fangchanwendawillTime');
      if (willTime && nowTime < willTime) {
        return true;
      }
      return false;
    }
    let isLessThanFurtureTime = judgeTime()
    log('[isLessThanFurtureTime]', isLessThanFurtureTime)
    if (isLessThanFurtureTime == false) { //过期了
      log('[isLessThanFurtureTime] 过期了')
      t.getUserProfile()
      t.setData({
        modalName: 'addcomment'
      })
    } else if (isLessThanFurtureTime == true) { //没过期
      log('[isLessThanFurtureTime] 没过期')
      wx.showToast({
        icon: 'error',
        duration: 2000,
        title: '1分钟发布一次',
      })
    }
  },
  getUserProfile() {
    const t = this
    wx.getUserProfile({
      desc: '用于完善个人资料',
      success: function (res) {
        var userInfo = res.userInfo
        console.log('userInfo==>', userInfo)
        //下面将userInfo存入服务器中的用户个人资料
        if (!wx.getStorageSync('storage_info')) {
          let _key = t.store.data.curCity
          let temp = _key + 'userInfo'
          let database = pinyin.getPinyin(temp).replace(/\s+/g, "");
          db.collection(database).add({
              data: {
                nickName: userInfo.nickName,
                avatarUrl: userInfo.avatarUrl,
                gender: userInfo.gender,
                language: userInfo.language,
                country: userInfo.country,
                city: userInfo.city,
                province: userInfo.province
              }
            })
            .then(res => {
              console.log(res)
            })
            .catch(console.error)
        }
        wx.setStorageSync('storage_info', 1);
        wx.setStorageSync('userInfo', userInfo)
        t.setData({
          userInfo: userInfo
        })
      }
    })
  },
  handlePhone(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  submitForm(e) {
    log(e)
    const t = this
    let rules = [{
        name: "mobile",
        rule: ["required", "isMobile"],
        msg: ["请输入手机号", "请输入正确的手机号"]
      },
      {
        name: "title",
        rule: ["required", "minLength:2", "maxLength:30"],
        msg: ["请输入标题", "必须2个或以上字符", "姓名不能超过30个字符"]
      }
    ];
    const willTime = () => {
      return Date.now() + 60000; //毫秒(1分钟)
    }
    let formData = e.detail.value;
    let checkRes = form.validation(formData, rules);
    if (!checkRes) {
      log('验证通过')
      wx.pro.showLoading({
        title: '提交中',
      })
      let _key = t.store.data.curCity
      let temp = _key + 'fangchanwenda'
      let database = pinyin.getPinyin(temp).replace(/\s+/g, "");
      db.collection(database).add({
          data: {
            title: e.detail.value.title,
            time: dayjs(new Date()).format('YYYY-MM-DD'),
            publishName: t.data.userInfo.nickName,
            avatar: t.data.userInfo.avatarUrl,
            comment: [],
            phone: e.detail.value.mobile,
          }
        })
        .then(res => {
          t.getShequ()
          console.log(res)
          wx.pro.hideLoading()
          wx.setStorageSync('fangchanwendawillTime', willTime());
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
  onReady: function () {

  },
  onShow: function () {
    this.getShequ()
  },
  InputFocus(e) {
    log(e)
    this.setData({
      InputBottom: e.detail.height
    })
  },
  InputBlur(e) {
    log(e)
    this.setData({
      InputBottom: 0
    })
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