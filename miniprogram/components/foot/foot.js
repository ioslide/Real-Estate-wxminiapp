// components/foot/foot.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    currentTag: {
      type: String,
      value: ""
  }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    navMap() {
      if(this.data.currentTag == "zhaofang") return
      wx.navigateTo({
        url: '/pages/index/mapDetail/mapDetail',
      })
    },
    navQiyefuwu() {
      if(this.data.currentTag == "fuwu") return
      wx.navigateTo({
        url: '/pages/qiyefuwuhuodong/qiyefuwuhuodong',
      })
    },
    navWode() {
      if(this.data.currentTag == "wode") return
      wx.navigateTo({
        url: '/pages/usercenter/usercenter'
      })
    },
    navQiuzuqiugou() {
      wx.navigateTo({
        url: '/pages/shequ/shequ'
      })
    },
    navHome() {
      wx.navigateBack({
        delta: 9,
      })
    },
    navHuodong(e) {
      wx.navigateTo({
        url: '/pages/huodong/huodong'
      })
    },
  }
})
