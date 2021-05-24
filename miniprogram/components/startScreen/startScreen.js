const log = console.log.bind(console)
const app = getApp()
const globalData = getApp().globalData

Component({
  properties: {

  },
  data: {
    isManualGetNewLocation: false,
    windowWidth: wx.getSystemInfoSync().windowWidth,
    windowHeight: wx.getSystemInfoSync().windowHeight,
  },
  lifetimes: {
    attached: function () {
      const t = this
      let e = t.properties
      t.setData({
        windowWidth: wx.getSystemInfoSync().windowWidth,
        windowHeight: wx.getSystemInfoSync().windowHeight,
      })
      t.screenFadeIn()
    },
    moved: function () {},
    detached: function () {},
  },
  pageLifetimes: {
    show: function () {
    },
    hide: function () {},
    resize: function () {},
  },
  data: {

  },
  methods: {
    screenFadeIn() {
      const t = this
      let defaultScreenFadeIn = wx.createAnimation({
        duration: 1500,
        timingFunction: 'ease-in-out',
        delay: 0,
      });
      defaultScreenFadeIn.opacity(1).translate3d(0, '10px', 0).step()
      t.setData({
        logoScreenAni: defaultScreenFadeIn.export(),
      })
    },
    screenFadeOut() {
      const t = this
      log('[screenFadeOut]')
      let defaultScreenAction = wx.createAnimation({
        duration: 1800,
        timingFunction: 'ease-in-out',
        delay: 1000,
      });
      defaultScreenAction.opacity(0).step()
      t.setData({
          defaultScreenAni: defaultScreenAction.export(),
        }),
        setTimeout(() => {
          t.setData({
            authScreen: true
          })
        }, 2200)
    }
  }
})