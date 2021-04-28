var a = Object.assign || function(a) {
    for (var t = 1; t < arguments.length; t++) {
        var e = arguments[t];
        for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (a[r] = e[r]);
    }
    return a;
}, t = (require("../utils/const"), require("../utils/service")), e = getApp();

Page({
    data: {
        isIpx: !!e.globalData.isIpx,
        tabbar: {
            onidx: 1
        },
        dk: {
            lilv: 0,
            amt: 0,
            year: 0,
            fqtype: 1
        },
        gjj: {
            lilv: 0,
            amt: 0,
            year: 0,
            fqtype: 1
        },
        menu: 3
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
    tabNav: function(a) {
        var t = this, r = a.target.dataset.page;
        if (r != t.data.tabbar.onidx) {
            var n = e.pageUrl(r);
            n && wx.reLaunch({
                url: n
            });
        }
    },
    onLoad: function(r) {
        var n = this, l = (this.fromShareInit(r), a({}, n.data.dk)), i = a({}, n.data.gjj), u = e.getMenuData(n.data.menu), d = !1;
        u && (l.amt = u.amt, l.year = u.year, l.lilv = u.lilv, l.fqtype = u.fqtype, i.amt = u.gjjamt, 
        i.year = u.year, i.fqtype = u.fqtype, i.lilv = u.gjjlilv, d = !0, n.setData({
            dk: l,
            gjj: i
        })), e.getLilv(10).then(function(e) {
            e || (e = {
                b_rate: 4.9,
                a_rate: 3.25
            }), e.a_rate = (0, t.numFixed)(e.a_rate), e.b_rate = (0, t.numFixed)(e.b_rate);
            var r = a({}, n.data.dk);
            d && "" != r.lilv && 0 != r.lil || (r.lilv = e.b_rate), r.deflilv = e;
            var l = a({}, n.data.gjj);
            d && "" != r.lilv && 0 != r.lilv || (l.lilv = e.a_rate), l.deflilv = e, n.setData({
                dk: r,
                gjj: l
            });
        });
    },
    fromShareInit: function(a) {
        var t = this, r = a.dktype;
        if (!r) return !1;
        var n = {
            amt: parseInt(a.amt),
            year: parseInt(a.year),
            fqtype: parseInt(a.fqtype),
            frommenu: t.data.menu,
            lilv: parseFloat(a.lilv),
            gjjamt: parseInt(a.gjjamt),
            gjjlilv: parseFloat(a.gjjlilv)
        };
        return e.setMenuData(r, n), !0;
    },
    bindGjjAmtInput: function(e) {
        var r = this, n = e.detail.value, l = (0, t.amtInput)(n), i = a({}, r.data.gjj);
        return "" == l && (l = 0), i.amt = l, r.setData({
            gjj: i
        }), l;
    },
    bindGjjLilvInput: function(e) {
        var r = this, n = e.detail.value, l = (0, t.lilvInput)(n), i = a({}, r.data.gjj);
        return i.lilv = l, r.setData({
            gjj: i
        }), l;
    },
    bindSyAmtInput: function(e) {
        var r = this, n = e.detail.value, l = (0, t.amtInput)(n), i = a({}, r.data.dk);
        return "" == l && (l = 0), i.amt = l, r.setData({
            dk: i
        }), l;
    },
    bindSyLilvInput: function(e) {
        var r = this, n = e.detail.value, l = (0, t.lilvInput)(n), i = a({}, r.data.dk);
        return i.lilv = l, r.setData({
            dk: i
        }), l;
    },
    bindYearInput: function(e) {
        var r = this, n = e.detail.value, l = (0, t.yearInput)(n);
        "" == l && (l = 0);
        var i = a({}, r.data.dk);
        i.year = l;
        var u = a({}, r.data.gjj);
        return u.year = l, r.setData({
            dk: i,
            gjj: u
        }), l;
    },
    tabMenu: function(a) {
        var t = this, r = a.currentTarget.dataset.type;
        if (r != t.data.menu) {
            var n = {
                amt: t.data.dk.amt,
                year: t.data.dk.year,
                fqtype: t.data.dk.fqtype,
                frommenu: t.data.menu,
                lilv: t.data.dk.lilv,
                gjjamt: t.data.gjj.amt,
                gjjlilv: t.data.gjj.lilv
            };
            e.setMenuData(t.data.menu, n), e.navMenu(r, e.globalData.menudata);
        }
    },
    tabfqtype: function(t) {
        var e = this, r = t.currentTarget.dataset.fqtype;
        if (r != e.data.dk.fqtype) {
            var n = a({}, e.data.dk);
            n.fqtype = r, e.setData({
                dk: n
            });
        }
    },
    calcCheck: function(a, r) {
        return (0, t.numIsEmpty)(a.amt) ? !!(0, t.numIsEmpty)(a.lilv) || (e.toast("请输入" + r + "贷款利率"), 
        !1) : (e.toast("请输入" + r + "贷款金额"), !1);
    },
    calctap: function() {
        var a = this, r = a.data.dk, n = a.data.gjj, l = this.calcCheck(n, "公积金");
        if (l && (l = this.calcCheck(r, "商业"))) {
            if (!(0, t.numIsEmpty)(r.year)) return e.toast("请输入贷款年限"), !1;
            var i = {
                dktype: parseInt(a.data.menu),
                fqtype: parseInt(r.fqtype),
                year: parseInt(r.year),
                form: {
                    amt: parseInt(r.amt),
                    lilv: parseFloat(r.lilv)
                }
            };
            e.setDkForm(i);
            var u = {
                dktype: parseInt(a.data.menu),
                fqtype: parseInt(n.fqtype),
                year: parseInt(n.year),
                form: {
                    amt: parseInt(n.amt),
                    lilv: parseFloat(n.lilv)
                }
            };
            e.setGjjForm(u), wx.navigateTo({
                url: "../result/result"
            });
        }
    },
    onShareAppMessage: function() {
        return e.appShare();
    }
});