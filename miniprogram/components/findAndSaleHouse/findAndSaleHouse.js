// components/findAndSaleHouse/findAndSaleHouse.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  methods: {
    navHelpSaleHouse(){
      wx.navigateTo({
        url: '/pages/helpSaleHouse/helpSaleHouse',
      })
    },
    navHelpFindHouse(){
      wx.navigateTo({
        url: '/pages/helpFindHouse/helpFindHouse',
      })
    }
  }
})
