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

create(store, {
  use: [
    'adSwiperList',
    'swiperList',
    'dailiren',
    'allHouseList',
    'maifangliucheng',
    'goufangzhengce'
  ],
  data: {
    searchWord:"",
    hasHouseList:false,
  },
  onLoad: function (options) {
    log(options)
    let key = options.searchWord
    db.collection('dangeloupanxiangqing').where(_.or([{
        name: db.RegExp({
          regexp: '.*' + key,
          options: 'i',
        })
      },
      {
        chengshi: db.RegExp({
          regexp: '.*' + key,
          options: 'i',
        })
      }
    ])).get({
      success: res => {
        log(res.data)
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