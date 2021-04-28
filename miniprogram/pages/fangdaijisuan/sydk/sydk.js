var a = Object.assign || function (a) {
        for (var t = 1; t < arguments.length; t++) {
            var e = arguments[t];
            for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (a[r] = e[r]);
        }
        return a;
    },
    t = (require("../utils/const"), require("../utils/service")),
    e = getApp();

Page({
    data: {
        isIpx: !!e.globalData.isIpx,
        tabbar: {
            onidx: 1
        },
        dk: {
            lilv: 4.9,
            amt: 0,
            year: 0,
            fqtype: 1,
            deflilv: {}
        },
        menu: 1,
        lilvList: []
    },
    tabNav: function (a) {
        var t = this,
            r = a.target.dataset.page;
        if (r != t.data.tabbar.onidx) {
            var n = e.pageUrl(r);
            n && wx.reLaunch({
                url: n
            });
        }
    },
    onLoad: function (r) {
        var n = this,
            i = (this.fromShareInit(r), a({}, n.data.dk)),
            l = e.getMenuData(n.data.menu),
            u = !1;
        l && (i.amt = l.amt, i.year = l.year, i.fqtype = l.fqtype, i.lilv = l.lilv, u = !0,
            n.setData({
                dk: i
            })), e.getLilv(10).then(function (e) {
            var r = 4.9;
            e ? (e.a_rate = (0, t.numFixed)(e.a_rate), e.b_rate = (0, t.numFixed)(e.b_rate),
                r = (0, t.numFixed)(e.b_rate)) : e = {
                b_rate: 4.9,
                a_rate: 3.25
            };
            var i = a({}, n.data.dk);
            u && "" != i.lilv && 0 != i.lilv || (i.lilv = r), i.deflilv = e, n.setData({
                dk: i
            });
        });
    },
    fromShareInit: function (a) {
        var t = a.dktype;
        if (!t) return !1;
        var r = {
            amt: parseInt(a.amt),
            lilv: parseFloat(a.lilv),
            year: parseInt(a.year),
            fqtype: parseInt(a.fqtype),
            frommenu: t
        };
        return e.setMenuData(t, r), !0;
    },
    bindAmtInput: function (e) {
        var r = this,
            n = e.detail.value,
            i = (0, t.amtInput)(n),
            l = a({}, r.data.dk);
        return "" == i && (i = 0), l.amt = i, r.setData({
            dk: l
        }), i;
    },
    bindYearInput: function (e) {
        var r = this,
            n = e.detail.value,
            i = (0, t.yearInput)(n),
            l = a({}, r.data.dk);
        return "" == i && (i = 0), l.year = i, r.setData({
            dk: l
        }), i;
    },
    bindYearBlur: function (a) {},
    bindLilvInput: function (e) {
        var r = this,
            n = e.detail.value,
            i = (0, t.lilvInput)(n),
            l = a({}, r.data.dk);
        return l.lilv = i, r.setData({
            dk: l
        }), i;
    },
    navzuhedaikuan() {
        wx.navigateTo({
            url: '../combdk/combdk',
        })
    },
    navgongjijin() {
        wx.navigateTo({
            url: '../index/index',
        })
    },
    navshangyedaikuan() {
        wx.navigateTo({
            url: '../sydk/sydk',
        })
    },
    navHome(){
        wx.navigateBack({
          delta: 9,
        })
      },
      navZixun(e){
        wx.navigateTo({
          url: '../../news/news'
        })
      },
      navQiyefuwu(){
        wx.navigateTo({
          url: '../../qiyefuwuhuodong/qiyefuwuhuodong',
        })
      },
      navMap(){
        wx.navigateTo({
          url: '../../index/mapDetail/mapDetail',
        })
      },
      navHuodong(e) {
        wx.navigateTo({
          url: '../../huodong/huodong'
        })
      },
    tabMenu: function (a) {
        var t = this,
            r = a.currentTarget.dataset.type;
        if (r != t.data.menu) {
            var n = {
                amt: t.data.dk.amt,
                year: t.data.dk.year,
                fqtype: t.data.dk.fqtype,
                lilv: t.data.dk.lilv,
                frommenu: t.data.menu
            };
            e.setMenuData(t.data.menu, n), e.navMenu(r, e.globalData.menudata);
        }
    },
    tabfqtype: function (t) {
        var e = this,
            r = t.currentTarget.dataset.fqtype;
        if (r != e.data.dk.fqtype) {
            var n = a({}, e.data.dk);
            n.fqtype = r, e.setData({
                dk: n
            });
        }
    },
    calcCheck: function (a) {
        return (0, t.numIsEmpty)(a.amt) ? (0, t.numIsEmpty)(a.year) ? !!(0, t.numIsEmpty)(a.lilv) || (e.toast("请输入贷款利率"),
            !1) : (e.toast("请输入贷款年限"), !1) : (e.toast("请输入贷款金额"), !1);
    },
    calctap: function () {
        var a = this,
            t = a.data.dk;
        if (this.calcCheck(t)) {
            var r = {
                dktype: parseInt(a.data.menu),
                fqtype: parseInt(t.fqtype),
                year: parseInt(t.year),
                form: {
                    amt: parseInt(t.amt),
                    lilv: parseFloat(t.lilv)
                }
            };
            e.setDkForm(r), wx.navigateTo({
                url: "../result/result"
            });
        }
    },
    onShareAppMessage: function () {
        return e.appShare();
    }
});