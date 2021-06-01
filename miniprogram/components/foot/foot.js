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
      wx.navigateTo({
        url: '/pages/index/mapDetail/mapDetail',
      })
    },
    navQiyefuwu() {
      wx.navigateTo({
        url: '/pages/qiyefuwuhuodong/qiyefuwuhuodong',
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
