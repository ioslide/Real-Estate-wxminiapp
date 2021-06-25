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
    imgList: [],
    submitUploadImgList: [],
    submitFileList: [],
    modalName: null,
    code:'0000'
  },
  onLoad: function (options) {

  },
  genID(length) {
    return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36);
  },
  verifySmsCode(e){
    log(e)
    this.setData({
      code : e.detail.code,
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
    let imageList = t.data.imgList
    log(imageList, checkRes,formData)
    if(formData.codeInput !== t.data.code && formData.codeInput !== ""){
      wx.showToast({
        title: '验证码不正确',
        icon:'none'
      })
      return false
    }
    if (!checkRes && imageList.length !== 0) {
      log('验证通过')
      wx.pro.showLoading({
        title: '提交中',
      })
      for (let j = 0; j < t.data.imgList.length; j++) {
        wx.cloud.uploadFile({
          cloudPath: t.genID(20),
          filePath: t.data.imgList[j], // 文件路径
        }).then(res => {
          t.data.submitUploadImgList.push(res.fileID)
          console.log(res)

          for (let i = 0; i < t.data.uploadFilePaths.length; i++) {
            wx.cloud.uploadFile({
              cloudPath: t.genID(20),
              filePath: t.data.uploadFilePaths[i], // 文件路径
            }).then(res => {
              t.data.submitFileList.push(res.fileID)
              console.log(res)
              if(i == t.data.uploadFilePaths.length-1 && j == t.data.imgList.length-1){
              db.collection('ruzhudaili').add({
                  data: {
                    name: formData.nameInput,
                    phone: t.data.phoneInput,
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
                    uploadFilePaths:[],
                    uploadFilePathsName:[],
                    imgList:[],
                    submitUploadImgList:[],
                    submitFileList:[]
                  })
                })
                .catch(console.error)
              }
            }).catch(error => {
              // handle error
            })
          }

        }).catch(error => {
          // handle error
        })
      }


      // db.collection('ruzhudaili').add({
      //   data: {
      //     name: e.detail.value.nameInput,
      //     phone: e.detail.value.phoneInput,
      //     yixiangdailiquyu: e.detail.value.ruzhuquyuInput,
      //     beizhu: e.detail.value.beizhuInput,
      //     hetongtupian: t.data.imgList,
      //     fujian: t.data.uploadFilePaths,
      //     time: app.getCurrentTime()
      //   }
      //   })
      //   .then(res => {
      //     console.log(res)
      //     wx.pro.hideLoading()
      //   })
      //   .catch(console.error)
    } else if (imageList.length == 0) {
      wx.showToast({
        title: '请上传合同图片',
        icon: "none"
      });
    } else {
      wx.showToast({
        title: checkRes,
        icon: "none"
      });
    }

  },
  uploadFile() {
    const t = this
    wx.chooseMessageFile({
      count: 3,
      type: 'file',
      success(res) {
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
        log(res)
      },
      fail(err) {
        wx.showToast({
          title: '上传失败',
          icon: 'none'
        })
      }
    })
  },
  ChooseImage() {
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '合同图片',
      content: '确定删除这张图片?',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
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