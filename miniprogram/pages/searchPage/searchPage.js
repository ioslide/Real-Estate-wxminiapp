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
    searchWord:"",
    hasHouseList:false,
  },
  inputfocus(){
    this.setData({
      showClear : true
    })
  },
  inputblur(){
    this.setData({
      showClear : false
    })
  },
  clearKeyword(){
    this.setData({
      keyword: ''
    })
  },
  searchArean(e) {
    const t = this
    log('[searchWord]', e.detail.value)
    let searchWord = e.detail.value
    if (searchWord == "") {
      return wx.showToast({
        title: '请输入内容',
        icon: 'error',
        duration: 2000
      })
    }
    wx.showLoading({
      title: 'Loading',
    })
    let key = searchWord
    let _key =  t.store.data.curCity
    let temp = _key + 'dangeloupanxiangqing'
    let database = pinyin.getPinyin(temp).replace(/\s+/g, "");

    db.collection(database).where(_.or([{
        loupanmingcheng: db.RegExp({
          regexp: '.*' + key + '.*' ,
          options: 'i',
        }),
          jutidizhi: db.RegExp({
            regexp: '.*' + key + '.*' ,
            options: 'i',
          })
      },
    ])).get({
      success: res => {
        log(res.data)
        wx.hideLoading()
        if(res.data.length !== 0){
          t.setData({
            searchHouseList: res.data,
            hasHouseList:true
          })
        }else{
          t.setData({
            hasHouseList : false
          })
          wx.showToast({
            title: '没有找到房源',
            icon: 'error',
            duration: 2000
          })
        }
      },
      fail: err => {
        log(err)
      }
    })
  },
  navHousedetail(e) {
    log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../housedetail/housedetail?houseId=' + e.currentTarget.dataset.id,
    })
  },
  onLoad: function (options) {
    log(options)
    const t = this
    let key = options.searchWord
    this.setData({
      keyword:key
    })
    wx.showLoading({
      title: 'Loading',
    })
    let _key = t.store.data.curCity
    let dangeloupanxiangqingtemp = _key + 'dangeloupanxiangqing'
    let dangeloupanxiangqingdatabase = pinyin.getPinyin(dangeloupanxiangqingtemp).replace(/\s+/g, "");
    db.collection(dangeloupanxiangqingdatabase).where(_.or([{
      loupanmingcheng: db.RegExp({
        regexp: '.*' + key + '.*',
        options: 'i',
      })
    },
    {
      chengshi: db.RegExp({
        regexp: '.*' + key + '.*',
        options: 'i',
      })
    },
    {
      jutidizhi: db.RegExp({
        regexp: '.*' + key + '.*',
        options: 'i',
      })
    }
  ])).get({
      success: res => {
        log(res.data)
        wx.hideLoading({
          success: (res) => {},
        })
        if(res.data.length > 0){
          this.setData({
            searchWord:options.searchWord,
            searchHouseList: res.data,
            hasHouseList:true
          })
        }else{
          this.setData({
            hasHouseList : false
          })
          wx.showToast({
            title: '没有找到房源',
            icon: 'error',
            duration: 2000
          })
        }
      },
      fail: err => {
        log(err)
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})