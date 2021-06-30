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
var plugin = requirePlugin("chatbot");

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
  handlePhone(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  navDetail(e) {
    log(e)
    const t = this
    wx.navigateTo({
      url: './detail/detail?detailid=' + e.currentTarget.id
    })
    let _key = t.store.data.curCity
    let temp = _key + 'qiuzuqiugou'
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
    let _key = t.store.data.curCity
    let temp = _key + 'qiuzuqiugou'
    let database = pinyin.getPinyin(temp).replace(/\s+/g, "");
    db.collection(database).orderBy('_createTime', 'desc').get().then(res => {
      t.setData({
        qiuzuqiugou: res.data,
        showCancel: false
      })
      wx.pro.hideLoading()
    })

    // db.collection(database).orderBy('_createTime', 'desc').get().then(res => {
    //   log(res.data)
    //   for(let i=0;i<res.data.length;i++){
    //     wx.cloud.callFunction({
    //       name: "openapi",
    //       data: {
    //         action: 'getTokenize',
    //         msg : res.data[i].title,
    //         openid: app.globalData.openid
    //       },
    //     }).then(function (result) {
    //       log('[' + res.data[i].title + ']',result.result)
    //       res.data[i].tag = result.result.entities
    //       if(res.data.length-1 == i){
    //       log(res.data)
    //         t.setData({
    //           qiuzuqiugou: res.data,
    //           showCancel: false
    //         })
    //       }
    //     }).catch(console.error)
    //   }
    //   wx.pro.hideLoading()
    // })
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
    if (key == "") {
      return wx.showToast({
        title: '请输入文本',
        icon: 'error',
        duration: 2000
      })
    }
    let _key = t.store.data.curCity
    let temp = _key + 'qiuzuqiugou'
    let database = pinyin.getPinyin(temp).replace(/\s+/g, "");
    db.collection(database).where(_.or([{
        content: db.RegExp({
          regexp: '.*' + key + '.*',
          options: 'i',
        })
      },
      {
        title: db.RegExp({
          regexp: '.*' + key + '.*',
          options: 'i',
        })
      }
    ])).orderBy('_createTime', 'desc').get().then(res => {
      t.setData({
        qiuzuqiugou: res.data,
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
      let willTime = wx.getStorageSync('qiuzuqiugouwillTime');
      if (willTime && nowTime < willTime) {
        return true;
      }
      return false;
    }
    let isLessThanFurtureTime = judgeTime()
    log('[isLessThanFurtureTime]', isLessThanFurtureTime)
    if (isLessThanFurtureTime == false) { //过期了
      log('[isLessThanFurtureTime] 过期了')
      if (!t.store.data.userInfo) {
        t.getUserProfile()
      } else {
        t.setData({
          modalName: 'addcomment'
        })
      }
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

        t.setData({
          modalName: 'addcomment'
        })

        var userInfo = res.userInfo
        console.log('userInfo==>', userInfo)

        let temp = t.store.data.curCity + 'userInfo'
        let database = pinyin.getPinyin(temp).replace(/\s+/g, "");
        db.collection(database).add({
            data: {
              realName: "",
              shenfengzhen: "",
              nickName: userInfo.nickName,
              city: userInfo.city,
              province: userInfo.province,
              country: userInfo.country,
              gender: userInfo.gender,
              avatarUrl: userInfo.avatarUrl,
              phone: '',
              kabao: [],
              tuiguangshouyi: 0,
              youxiaoyaoqingrenshu: 0,
              ishehuoren: false,
              isdaili: false,
              openid: globalData.openid,
              unionid: globalData.unionid || "",
              userMoney: 0,
              guanliankaquankabao: []
            }
          })
          .then(res => {
            console.log(res)
          })
          .catch(console.error)
        t.store.data.userInfo = userInfo
      },
      fail: function (err) {
        wx.showToast({
          icon: 'error',
          title: '请授权',
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

    const txt = e.detail.value.title;


    plugin.api.nlp('sensitive', {
      q: txt,
      mode: 'cnn'
    }).then(res => {
      console.log("sensitive result : ", res)
      let nlpContentPoint = 0
      for (let cc = 0; cc < res.result.length; cc++) {
        if (res.result[cc][0] == 'other') {
          nlpContentPoint = res.result[cc][1]
        }
      }
      log('nlpContentPoint', nlpContentPoint)
      if (nlpContentPoint > 0 && nlpContentPoint <= 1) {

        if (!checkRes) {
          log('验证通过')

          plugin.api.nlp("ner-product", {
            q: e.detail.value.title
          }).then((res) => {
            console.log("ner result : ", res);
            let textTag = []
            let ccc = res.entities
            if(ccc.hasOwnProperty('product') == false){
              textTag = []
            }else{
              for (let bb = 0; bb < res.entities.product.length; bb++) {
                textTag.push(res.entities.product[bb][0])
              }
            }
            log('textTag', textTag)

            let _key = t.store.data.curCity
            let temp = _key + 'qiuzuqiugou'
            let database = pinyin.getPinyin(temp).replace(/\s+/g, "");
            db.collection(database).add({
                data: {
                  title: e.detail.value.title,
                  time: dayjs(new Date()).format('YYYY-MM-DD'),
                  chakanrenshu: 0,
                  publishName: t.store.data.userInfo.nickName,
                  avatar: t.store.data.userInfo.avatarUrl,
                  tag: textTag,
                  comment: [],
                  phone: e.detail.value.mobile,
                }
              })
              .then(res => {
                t.getShequ()
                wx.showToast({
                  title: '提交成功',
                })
                console.log(res)
                wx.hideLoading()
                wx.setStorageSync('qiuzuqiugouwillTime', willTime());
                t.hideModal()
              })
              .catch(console.error)
          });
        } else {
          wx.showToast({
            title: checkRes,
            icon: "none"
          });
        }
      } else {
        log('包含违规内容！')
        wx.showToast({
          title: '包含违规内容！',
          icon: 'none'
        })
        wx.hideLoading()
      }
    })


    // if (!checkRes) {
    //   log('验证通过')
    //   wx.pro.showLoading({
    //     title: '提交中',
    //   })
    //   wx.cloud.callFunction({
    //     name: "openapi",
    //     data: {
    //       action: 'getTokenize',
    //       msg: e.detail.value.title,
    //       openid: app.globalData.openid
    //     },
    //   }).then(function (result) {
    //     let _key = t.store.data.curCity
    //     let temp = _key + 'qiuzuqiugou'
    //     let database = pinyin.getPinyin(temp).replace(/\s+/g, "");
    //     db.collection(database).add({
    //         data: {
    //           title: e.detail.value.title,
    //           time: dayjs(new Date()).format('YYYY-MM-DD'),
    //           chakanrenshu: 0,
    //           publishName: t.store.data.userInfo.nickName,
    //           avatar: t.store.data.userInfo.avatarUrl,
    //           tag: result.result.entities,
    //           comment: [],
    //           phone: e.detail.value.mobile,
    //         }
    //       })
    //       .then(res => {
    //         t.getShequ()
    //         console.log(res)
    //         wx.pro.hideLoading()
    //         wx.setStorageSync('qiuzuqiugouwillTime', willTime());
    //         t.hideModal()
    //       })
    //       .catch(console.error)
    //   }).catch(console.error)
    // } else {
    //   wx.showToast({
    //     title: checkRes,
    //     icon: "none"
    //   });
    // }

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