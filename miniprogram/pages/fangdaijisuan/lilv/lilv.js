require("../utils/service"), require("../utils/util.js").liLvApi;

var n = getApp();

Page({
    data: {
        lilvList: []
    },
    onLoad: function(t) {
        var i = this;
        n.getLiLvList().then(function(n) {
            i.setData({
                lilvList: n
            });
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {
        return n.appShare();
    }
});