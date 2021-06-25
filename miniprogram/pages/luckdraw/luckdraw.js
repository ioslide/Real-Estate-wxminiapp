const app = getApp()
const globalData = getApp().globalData
const log = console.log.bind(console)
const group = console.group.bind(console)
const groupEnd = console.groupEnd.bind(console)
const error = console.error.bind(console)
const db = wx.cloud.database()
import pinyin from "wl-pinyin"
const _ = db.command
import create from '../../util/create'
import store from '../../store/index'
create(store, {
  use: [
    'curCity'
  ],
  data: {
    award: "无",
    luckdrawTimes: wx.getStorageSync('luckdrawTimes') || 0,
    circleList: 24, //圆点
    awardList: [{
      img: "cloud://lunfanglue-7g33jtt446e6cefa.6c75-lunfanglue-7g33jtt446e6cefa-1306211988/ia_100000003.png",
      name: "楼盘礼品"
    }, {
      img: "cloud://lunfanglue-7g33jtt446e6cefa.6c75-lunfanglue-7g33jtt446e6cefa-1306211988/ia_100000004.png",
      name: "楼盘模型"
    }, {
      img: "cloud://lunfanglue-7g33jtt446e6cefa.6c75-lunfanglue-7g33jtt446e6cefa-1306211988/ia_100000005.png",
      name: "专业顾问咨询"
    }, {
      img: "cloud://lunfanglue-7g33jtt446e6cefa.6c75-lunfanglue-7g33jtt446e6cefa-1306211988/ia_100000006.png",
      name: "专属内购机会"
    }, {
      img: "cloud://lunfanglue-7g33jtt446e6cefa.6c75-lunfanglue-7g33jtt446e6cefa-1306211988/ia_100000007.png",
      name: "VIP顾问一对一咨询"
    }, {
      img: "cloud://lunfanglue-7g33jtt446e6cefa.6c75-lunfanglue-7g33jtt446e6cefa-1306211988/ia_100000008.png",
      name: "9折购房"
    }, {
      img: "cloud://lunfanglue-7g33jtt446e6cefa.6c75-lunfanglue-7g33jtt446e6cefa-1306211988/ia_100000009.png",
      name: "楼盘模型"
    }, {
      img: "cloud://lunfanglue-7g33jtt446e6cefa.6c75-lunfanglue-7g33jtt446e6cefa-1306211988/ia_100000010.png",
      name: "VIP顾问一对一咨询"
    }],
    indexSelect: 0, //被选中的奖品index
    isRunning: false //是否正在抽奖
  },
  onShareAppMessage: function (options) {
    log('onShareAppMessage', options)
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
      shareObj.title = '搜房客有奖派送'
      shareObj.imageUrl = 'cloud://lunfanglue-7g33jtt446e6cefa.6c75-lunfanglue-7g33jtt446e6cefa-1306211988/shareLipin.jpg'
      shareObj.path = '/pages/index/index?pageid=' + eData
      let luckdrawTimes = Number(wx.getStorageSync('luckdrawTimes'))
      luckdrawTimes = luckdrawTimes + 1
      log(luckdrawTimes)
      wx.setStorageSync('luckdrawTimes', luckdrawTimes)
      that.setData({
        luckdrawTimes: luckdrawTimes
      })
      wx.showToast({
        title: '抽奖次数+1',
      })
    }
    return shareObj;
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
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  onLoad: function (e) {
    const t = this
    let _key = 'jinjiangqu'
    let temp = _key + 'huodongjiangpinshezhi'
    let database = pinyin.getPinyin(temp).replace(/\s+/g, "");
    let newawardList = t.data.awardList
    db.collection(database).get().then(res => {
        console.log(res.data[0])
        let result = res.data[0]
        for(let i=0;i<newawardList.length;i++){
          let cc = 'jiangpin'.concat(i)
          log(i,result.jiugonggechoujiang[cc])
          newawardList[i].name = result.jiugonggechoujiang[cc]
        }
        log(newawardList)
        t.setData({
          awardList : newawardList
        })
      })
      .catch(console.error)

    let luckdrawTimes = wx.getStorageSync('luckdrawTimes')
    t.setData({
      luckdrawTimes: luckdrawTimes
    })
    log(luckdrawTimes)
    if (luckdrawTimes < 1) {
      wx.showModal({
        cancelText: '返回',
        confirmText: '确定',
        content: '您抽奖次数不足',
        showCancel: true,
        title: '您抽奖次数不足',
        success: (result) => {
          log(result)
          if (result.confirm == false) {

          } else if (result.cancel == true) {
            wx.navigateBack({
              delta: 9,
            })
          }
        },
        fail: (res) => {},
        complete: (res) => {},
      })
    }
  },
  //获取随机数
  getRandom: function (u) {
    let rnd = Math.random() > 0.5 ? "2" : "1";
    u = u || 3;
    for (var i = 0; i < u; i++) {
      rnd += Math.floor(Math.random() * 10);
    }
    return Number(rnd);
  },
  //开始抽奖
  startDrawing: function () {
    let luckdrawTimes = wx.getStorageSync('luckdrawTimes')
    if (luckdrawTimes < 1) {
      wx.showToast({
        icon: 'error',
        title: '抽奖次数不足',
      })
      return
    }
    if (this.data.isRunning) return
    this.setData({
      isRunning: true
    })
    let indexSelect = 0
    let i = 0;
    let randomNum = this.getRandom(3);
    let timer = setInterval(() => {
      ++indexSelect;
      //这里用y=30*x+150函数做的处理.可根据自己的需求改变转盘速度
      indexSelect = indexSelect % 8;
      this.setData({
        indexSelect: indexSelect
      })
      i += 40;
      if (i > randomNum) {

        luckdrawTimes = luckdrawTimes - 1
        this.setData({
          luckdrawTimes: luckdrawTimes
        })
        wx.setStorageSync('luckdrawTimes', luckdrawTimes)
        //去除循环
        clearInterval(timer)
        timer = null;
        //获奖提示
        wx.showModal({
          title: '恭喜您',
          content: `获得了奖品【${this.data.awardList[indexSelect].name}】`,
          confirmColor: '#5677FC',
          showCancel: false, //去掉取消按钮
          success: (res) => {
            if (res.confirm) {
              this.setData({
                award: this.data.awardList[indexSelect].name,
                isRunning: false,
                modalName: 'duihuanHongbao'
              })
            }
          }
        })
      }
    }, (70 + i))
  },
  submitForm(e) {
    log(e)
    const t = this
    wx.pro.showLoading({
      title: '提交中',
    })
    let _key = t.store.data.curCity
    let temp = _key + 'jiugonggeduihuan'
    let database = pinyin.getPinyin(temp).replace(/\s+/g, "");
    db.collection(database).add({
        data: {
          name: e.detail.value.nameInput,
          phone: e.detail.value.phoneInput,
          jiangpin: t.data.award,
          time: t.getCurrentTime()
        }
      })
      .then(res => {
        console.log(res)
        wx.pro.hideLoading()
        t.hideModal()
        wx.showToast({
          title: '提交成功',
        })
      })
      .catch(console.error)
  },
})