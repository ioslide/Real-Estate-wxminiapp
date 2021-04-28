var a = getApp();

Page({
    data: {
        isIpx: !!a.globalData.isIpx,
        tabbar: {
            onidx: 2
        }
    },
    tabNav: function(n) {
        var t = this, o = n.target.dataset.page;
        if (o != t.data.tabbar.onidx) {
            var e = a.pageUrl(o);
            e && wx.reLaunch({
                url: e
            });
        }
    },
    tapApp: function(n) {
        console.log(n);
        var t = n.currentTarget.dataset.app;
        a && a.openApp(t, "");
    },
    onLoad: function(a) {},
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {
        return a.appShare();
    }
});