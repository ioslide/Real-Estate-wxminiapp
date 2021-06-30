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
    'userInfo'
  ],

  /**
   * 页面的初始数据
   */
  data: {
    rechargeMoney: ["50", "100", "200", "300", "400", "500"],
    rechargeClick: true,
  },

  onLoad: function (options) {

  },
  bindconfirmInput: function (e) {
    log(e)
    const t = this
    if (t.data.inputText == '请输入' || t.data.inputText == '' || t.data.inputText == null) {
      wx.showToast({
        title: '请输入',
        image: '../../../weatherui/assets/images/pleaseWrite.svg',
        duration: 1000,
        success: function (res) {
          console.log("提交成功", res.result)
        },
        fail: function (res) {
          console.log(res);
        }
      });
      return
    }

    let money = t.data.price * 100
    let inputMoney = money.toFixed()
    wx.cloud.callFunction({
      name: 'pay',
      data: {
        body: "论方略",
        orderid: globalData.openid + Math.floor((Math.random() * 1000) + 1) + new Date().getTime(),
        money: inputMoney
      },
      success(res) {
        let payment = res.result;
        wx.requestPayment({
          ...payment,
          success: (res) => {
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 1000,
              mask: true
            })
          },
          fail: (err) => {
            console.log('支付失败', err);
            wx.showToast({
              title: '支付失败',
              icon: 'success',
              image: '../../../weatherui/assets/images/failMoney.svg',
              duration: 1000,
              success: function (res) {

              },
              fail: function (res) {
                console.log(res);
              }
            });
          }
        });
      },
      fail(res) {
        wx.showToast({
          title: '支付失败',
          icon: 'success',
          image: '../../../weatherui/assets/images/failMoney.svg',
          duration: 1000,
          success: function (res) {

          },
          fail: function (res) {
            console.log(res);
          }
        });
      }
    })
  },

  cancelSelect: function cancelSelect() {
    this.setData({
      showPicker1: false
    });
  },
  confirmSelect: function confirmSelect(e) {
    this.setData({
      showPicker1: false
    });
    if (e.detail.data && e.detail.data.name) {
      this.setData({
        canteen: e.detail.data.name,
        canteenid: e.detail.data.canteenId,
        mchid: e.detail.data.mchId
      });
    }
  },

  //选择充值金额
  chooseChargeMoney: function chooseChargeMoney(e) {
    this.setData({
      currentRechargeIndex: e.currentTarget.dataset.index,
      recharge: e.currentTarget.dataset.value,
      // currenBackground: ''
      clickMoneyFlag: true
    });
  },
  // 输入金额获取焦点事件
  inputMoney: function inputMoney(e) {
    this.setData({
      showClose: false,
      recharge: e.detail.value
    });
  },
  // 点击清除金额
  clearMoney: function clearMoney() {
    this.setData({
      showClose: true,
      recharge: "",
      currentRechargeIndex: -1
    });
  },
  //校验充值金额格式
  testMoney: function testMoney(e) {
    if (this.data.clickMoneyFlag) {
      e.detail.value = this.data.recharge;
    }
    if (!e.detail.value) {
      this.setData({
        currentRechargeIndex: -1
      });
      return;
    }
    if (this.data.showClose) {
      this.setData({
        showCancel: false
      });
      return;
    }
    this.setData({
      recharge: e.detail.value,
      showClose: false
    });
    if (this.data.recharge) {
      var i = this.data.rechargeMoney.indexOf(this.data.recharge);
      this.setData({
        currentRechargeIndex: i
      });
    }
  },
  //确定充值
  confirmCharge: function confirmCharge() {
    var t = this;

    if (!this.data.recharge) {
      wx.showModal({
        title: "提示",
        content: "必填项填写不完整！",
        showCancel: false,
        confirmColor: "#DF222E"
      });
      return;
    }
    if (this.data.recharge) {
      // console.log(!/^[1-9]{1,}[\d]*$/.test(this.data.recharge), (this.data.recharge % 10) !== 0)
      if (this.data.recharge == 0 || this.data.recharge % 10 !== 0) {
        wx.showModal({
          title: "提示",
          content: "充值金额必须是10的整倍数",
          showCancel: false,
          confirmColor: "#DF222E",
          success: function success(res) {
            t.setData({
              recharge: ""
            });
          }
        });
        return;
      }
    }





    //没绑定先提示是否绑定
    log(t.data.rechargeClick)
    if (t.data.rechargeClick) {
      t.setData({
        rechargeClick: false
      });
      wx.showLoading({
        title: 'loading',
      })
      let money = t.data.recharge * 100
      let inputMoney = money.toFixed()
      let orderId = globalData.openid + Math.floor((Math.random() * 1000) + 1) + new Date().getTime()
      log(orderId)
      wx.cloud.callFunction({
        name: 'pay',
        data: {
          body: "论方略",
          orderid: orderId,
          money: inputMoney
        },
        success(res) {
          let payment = res.result;
          wx.requestPayment({
            ...payment,
            success: (res) => {
              wx.showToast({
                title: '支付成功',
                icon: 'success',
                duration: 1000,
                mask: true
              })
              t.setData({
                rechargeClick: true
              });

              log(Number(t.data.recharge),globalData.openid)
              let key = t.store.data.curCity
              let temp = key + 'userInfo'
              let database = pinyin.getPinyin(temp).replace(/\s+/g, "");
              db.collection(database).doc(t.store.data.userInfo._id).update({
                data: {
                  userMoney: _.inc(Number(t.data.recharge))
                }
              }).then( res =>{
                log(res)
                if(res.stats.updated == 1){
                  wx.navigateBack({
                    delta: 1,
                  })
                }
              })

              wx.hideLoading()
            },
            fail: (err) => {
              console.log('支付失败', err);
              wx.showToast({
                title: '支付失败',
                icon: 'success',
                duration: 1000,
              });
              t.setData({
                rechargeClick: true
              });
              wx.hideLoading()
            }
          });
        },
        fail(res) {
          wx.showToast({
            title: '支付失败',
            icon: 'error',
            duration: 1000,
          });
          t.setData({
            rechargeClick: true
          });
        }
      })
    } else {
      return;
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
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