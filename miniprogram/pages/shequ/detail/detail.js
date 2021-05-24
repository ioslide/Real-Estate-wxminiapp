const app = getApp()
const globalData = getApp().globalData
const log = console.log.bind(console)
const group = console.group.bind(console)
const groupEnd = console.groupEnd.bind(console)
const error = console.error.bind(console)
const db = wx.cloud.database()
const _ = db.command
import create from '../../../util/create'
import store from '../../../store/index'
import pinyin from "wl-pinyin"
const dayjs = require('../../../util/day/day.js')
const form = require("../../../util/formValidation.js")
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
    hascommentUser:false
  },
  onLoad: function (options) {
    const t = this
    log(options)
    t.setData({
      options:options
    })
    t.getDetailcomment(options)
  },
  getDetailcomment(options){
    const t = this
    let _key =  t.store.data.curCity
    let temp = _key + 'qiuzuqiugou'
    let database = pinyin.getPinyin(temp).replace(/\s+/g, "");
    db.collection(database).where({
      _id: options.detailid
    }).get().then(res => {
      log(res.data[0])
      t.setData({
        qiuzuqiugou: res.data[0]
      })
    })
  },
  reloadDetailcomment(options){
    const t = this
    let _key =  t.store.data.curCity
    let temp = _key + 'qiuzuqiugou'
    let database = pinyin.getPinyin(temp).replace(/\s+/g, "");
    db.collection(database).where({
      _id: t.data.options.detailid
    }).get().then(res => {
      log(res.data[0])
      t.setData({
        qiuzuqiugou: res.data[0]
      })
    })
  },
  getUserProfile() {
    const t = this
    wx.getUserProfile({
      desc: '用于完善个人资料',
      success: function (res) {
        let commentUser = res.userInfo
        console.log('commentUser==>', commentUser)
        //下面将userInfo存入服务器中的用户个人资料
        if (t.data.hascommentUser == false) {
          t.setData({
            hascommentUser:true,
            modalName: 'addcomment',
            commentUser: commentUser
          })
        }else if(t.data.hascommentUser == true) {
          t.setData({
            modalName: 'addcomment'
          })
        }
      },
      fail:function(err){
        wx.showToast({
          icon:'error',
          title: '请授权',
        })
      }
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  addComment() {
    const t = this
    const judgeTime = () => {
      let nowTime = Date.now();
      let commentIntervalTime = wx.getStorageSync('commentIntervalTime');
      log('commentIntervalTime',commentIntervalTime)
      if (commentIntervalTime && nowTime < commentIntervalTime) {
        return true;
      }
      return false;
    }
    let isLessThanFurtureTime = judgeTime()
    log('[isLessThanFurtureTime]', isLessThanFurtureTime)
    if (isLessThanFurtureTime == false) { //过期了
      log('[isLessThanFurtureTime] 过期了')
      t.getUserProfile()
    } else if (isLessThanFurtureTime == true) { //没过期
      log('[isLessThanFurtureTime] 没过期')
      wx.showToast({
        icon: 'error',
        duration: 2000,
        title: '15分钟回答一次',
      })
    }
  },
  submitForm(e) {
    log(e)
    const t = this
    let rules = [
      {
        name: "comment",
        rule: ["required", "minLength:2"],
        msg: ["请输入回答", "必须2个或以上字符"]
      }
    ];
    const commentIntervalTime = () => {
      return Date.now() + 900000; //毫秒(15分钟)
    }
    let formData = e.detail.value;
    let checkRes = form.validation(formData, rules);
    if (!checkRes) {
      log('验证通过')
      wx.pro.showLoading({
        title: '提交中',
      })
      let newComment = t.data.qiuzuqiugou.comment
      newComment.push({
        avatar : t.data.commentUser.avatarUrl,
        comment:formData.comment,
        name:t.data.commentUser.nickName || '热心网友',
        time: dayjs(new Date()).format('YYYY-MM-DD mm-ss')
      })
      log('newComment',newComment)
      let _key =  t.store.data.curCity
      let temp = _key + 'qiuzuqiugou'
      let database = pinyin.getPinyin(temp).replace(/\s+/g, "");
      db.collection(database).doc(t.data.qiuzuqiugou._id).set({
          data: {
            title: t.data.qiuzuqiugou.title,
            chakanrenshu:t.data.qiuzuqiugou.chakanrenshu,
            time:t.data.qiuzuqiugou.time,
            chakanrenshu:t.data.qiuzuqiugou.chakanrenshu,
            publishName:t.data.qiuzuqiugou.publishName,
            avatar:t.data.qiuzuqiugou.avatar,
            phone:t.data.qiuzuqiugou.phone,
            comment: newComment
          }
        })
        .then(res => {
          t.reloadDetailcomment()
          console.log(res)
          wx.pro.hideLoading()
          wx.setStorageSync('commentIntervalTime', commentIntervalTime());
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