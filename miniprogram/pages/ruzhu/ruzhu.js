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
const form = require("../../util/formValidation.js")
import {
  promisifyAll
} from 'wx-promise-pro'
create(store, {
  use: [
    'adSwiperList',
    'swiperList',
    'dailiren',
    'allHouseList',
    'maifangliucheng',
    'goufangzhengce',
    'zixunxinxi',
    'curCity'
  ],
  data: {
    uploadFilePaths: [],
    uploadFilePathsName: [],
    submitUploadImgList: [],
    submitFileList: [],
    modalName: null,
    phone: '',
    code: '1949'
  },
  onLoad: function (options) {

  },
  genID(length) {
    return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36);
  },
  verifySmsCode(e) {
    log(e)
    this.setData({
      code: e.detail.code,
      phone: e.detail.phone
    })
  },
  submitForm(e) {
    log(e)
    const t = this
    let rules = [{
        name: "nameInput",
        rule: ["required", "isChinese", "minLength:2", "maxLength:30"],
        msg: ["请输入姓名", "姓名必须是中文", "必须2个或以上字符", "姓名不能超过20个字符"]
      },
      {
        name: "codeInput",
        rule: ["required"],
        msg: ["请输入验证码"]
      },
      {
        name: "ruzhuquyuInput",
        rule: ["required", "isChinese"],
        msg: ["意向代理区域", "代理区域必须是中文"]
      },
      {
        name: "beizhuInput",
        rule: ["required"],
        msg: ["请输入备注"]
      }
    ];
    let formData = e.detail.value;
    let checkRes = form.validation(formData, rules);
    log(checkRes, formData)
    if (formData.codeInput !== t.data.code && formData.codeInput !== "") {
      wx.showToast({
        title: '验证码不正确',
        icon: 'none'
      })
      return false
    }
    if (t.data.uploadFilePaths.length == 0) {
      wx.showToast({
        title: '请上传合同附件',
        icon: "none"
      });
      return false
    } 
    if(t.data.phone == ''){
      wx.showToast({
        title: '请获取验证码',
        icon:'none'
      })
      return false
    }
    if (!checkRes) {
      log('验证通过')
      wx.pro.showLoading({
        title: '提交中',
      })

      db.collection('ruzhudaili').add({
        data: {
          name: formData.nameInput,
          phone: t.data.phone,
          yixiangdailiquyu: formData.ruzhuquyuInput,
          beizhu: formData.beizhuInput,
          hetongtupian: t.data.submitUploadImgList,
          fujian: t.data.submitFileList,
          time: app.getCurrentTime()
        }
      })
      .then(res => {
        console.log(res)
        wx.pro.hideLoading()
        wx.showToast({
          title: '提交成功',
        })
        t.setData({
          uploadFilePaths: [],
          uploadFilePathsName: [],
          submitUploadImgList: [],
          submitFileList: []
        })
        wx.navigateBack({
          delta: 1,
        })
      })
      .catch(console.error)

    }else {
      wx.showToast({
        title: checkRes,
        icon: "none"
      });
    }

  },
  uploadFile() {
    const t = this
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success(res) {
        log(res)
        const tempFilePaths = res.tempFiles
        let _tempFilePaths = []
        let _tempFilePathsName = []
        for (let i = 0; i < tempFilePaths.length; i++) {
          _tempFilePaths.push(tempFilePaths[i].path)
          _tempFilePathsName.push(tempFilePaths[i].name)
        }
        t.setData({
          uploadFilePaths: _tempFilePaths,
          uploadFilePathsName: _tempFilePathsName,
        })
      },
      fail(err) {
        wx.showToast({
          title: '上传失败',
          icon: 'none'
        })
      }
    })
  },
  // DelImg(e) {
  //   wx.showModal({
  //     title: '合同图片',
  //     content: '确定删除这张图片?',
  //     cancelText: '取消',
  //     confirmText: '确定',
  //     success: res => {
  //       if (res.confirm) {
  //         this.data.imgList.splice(e.currentTarget.dataset.index, 1);
  //         this.setData({
  //           imgList: this.data.imgList
  //         })
  //       }
  //     }
  //   })
  // },
  // ViewImage(e) {
  //   wx.previewImage({
  //     urls: this.data.imgList,
  //     current: e.currentTarget.dataset.url
  //   });
  // },
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