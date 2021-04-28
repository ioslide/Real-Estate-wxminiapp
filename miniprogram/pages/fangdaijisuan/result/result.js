var t = require("../utils/service.js"), l = getApp();

Page({
    data: {
        syCalcRes: {},
        gjjCalcRes: {},
        dktype: 1,
        details: [],
        monthAmt: 0,
        monthDesc: "",
        lxtotal: "",
        alltotal: "",
        screenWidth: 480,
        ft: ""
    },
    onLoad: function(t) {
        var a = this;
        if (l.globalData.systemInfo && l.globalData.systemInfo.screenWidth) {
            var e = l.globalData.systemInfo.screenWidth, o = parseInt(.032 * e);
            a.setData({
                screenWidth: e,
                ft: e < 370 ? "font-size:" + o + "px" : ""
            });
        } else wx.getSystemInfo({
            success: function(t) {
                l.globalData.systemInfo = t;
                var e = t.screenWidth, o = parseInt(.032 * e);
                a.setData({
                    screenWidth: e,
                    ft: e < 370 ? "font-size:" + o + "px" : ""
                });
            }
        });
        this.fromShareInit(t);
        var s = l.globalData.dkform;
        s || wx.navigateBack();
        var m = s.dktype;
        1 == m || 2 == m ? this.singleDk() : this.comboDk();
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
      },      navHuodong(e) {
        wx.navigateTo({
          url: '../../huodong/huodong'
        })
      },
      navMap(){
        wx.navigateTo({
          url: '../../index/mapDetail/mapDetail',
        })
      },
    fromShareInit: function(t) {
        var a = t.dktype;
        if (a) if (3 == a) {
            o = {
                dktype: parseInt(a),
                fqtype: parseInt(t.fqtype),
                year: parseInt(t.year),
                form: {
                    amt: parseInt(t.amt),
                    lilv: parseFloat(t.lilv)
                }
            };
            l.setDkForm(o);
            var e = {
                dktype: parseInt(a),
                fqtype: parseInt(t.fqtype),
                year: parseInt(t.year),
                form: {
                    amt: parseInt(t.gjjamt),
                    lilv: parseFloat(t.gjjlilv)
                }
            };
            l.setGjjForm(e);
        } else {
            var o = {
                dktype: parseInt(a),
                fqtype: parseInt(t.fqtype),
                year: parseInt(t.year),
                form: {
                    amt: parseInt(t.amt),
                    lilv: parseFloat(t.lilv)
                }
            };
            l.setDkForm(o);
        }
    },
    singleDk: function() {
        var a = this, e = l.globalData.dkform, o = e.dktype, s = e.fqtype, m = e.year, r = e.form, i = r.amt, n = r.lilv, f = (0, 
        t.dkCalc)(s, i, m, n), d = {
            dktype: o,
            details: [],
            lxtotal: f.lxtotal,
            alltotal: f.alltotal
        };
        1 == s ? (1 == o ? d.syCalcRes = f : d.gjjCalcRes = f, d.monthAmt = (0, t.numSplit)(f.monthAmt), 
        d.monthDesc = "每月月供") : (1 == o ? d.syCalcRes = f : d.gjjCalcRes = f, d.monthDesc = "首月月供", 
        d.monthAmt = (0, t.numSplit)(f.details[0].emtotal));
        for (var c = [], p = f.details.length, y = d.alltotal, u = 0; u < p; u++) {
            var j = f.details[u];
            y -= j.emtotal;
            var F = {
                fld: j.fld,
                emtotal: (0, t.localNumFloatFixed)(j.emtotal),
                em: (0, t.localNumFloatFixed)(j.em),
                lx: (0, t.localNumFloatFixed)(j.lx),
                leftbj: (0, t.localNumFloatFixed)(j.leftbj),
                leftall: (0, t.localNumFloatFixed)(y)
            };
            u == p - 1 && (F.leftbj = 0, F.leftall = 0), c.push(F);
        }
        d.details = c, d.lxtotal = (0, t.localNumFloatFixed)(d.lxtotal), d.alltotal = (0, 
        t.localNumFloatFixed)(d.alltotal), a.setData(d);
    },
    comboDk: function() {
        var a = this, e = l.globalData.dkform, o = e.dktype, s = e.fqtype, m = e.year, r = e.form, i = r.amt, n = r.lilv, f = (0, 
        t.dkCalc)(s, i, m, n), d = l.globalData.gjjform.form, c = (0, t.dkCalc)(s, d.amt, m, d.lilv), p = {
            dktype: o,
            details: [],
            lxtotal: (0, t.numFixed)(f.lxtotal + c.lxtotal),
            alltotal: (0, t.numFixed)(f.alltotal + c.alltotal)
        };
        1 == s ? (1 == o ? p.syCalcRes = f : 2 == o ? p.gjjCalcRes = c : (p.syCalcRes = f, 
        p.gjjCalcRes = c), p.monthAmt = (0, t.numSplit)(f.monthAmt + c.monthAmt), p.monthDesc = "每月月供") : (1 == o ? p.syCalcRes = f : 2 == o ? p.gjjCalcRes = c : (p.syCalcRes = f, 
        p.gjjCalcRes = c), p.monthDesc = "首月月供", p.monthAmt = (0, t.numSplit)(f.details[0].emtotal + c.details[0].emtotal));
        for (var y = [], u = f.details.length, j = p.alltotal, F = 0; F < u; F++) {
            var x = f.details[F], g = c.details[F];
            j = j - x.emtotal - g.emtotal;
            var v = {
                fld: x.fld,
                emtotal: (0, t.localNumFloatFixed)(x.emtotal + g.emtotal),
                em: (0, t.localNumFloatFixed)(x.em + g.em),
                lx: (0, t.localNumFloatFixed)(x.lx + g.lx),
                leftbj: (0, t.localNumFloatFixed)(x.leftbj + g.leftbj),
                leftall: (0, t.localNumFloatFixed)(j)
            };
            F == u - 1 && (v.leftbj = 0, v.leftall = 0), y.push(v);
        }
        p.details = y, p.lxtotal = (0, t.localNumFloatFixed)(p.lxtotal), p.alltotal = (0, 
        t.localNumFloatFixed)(p.alltotal), a.setData(p);
    },
    onShareAppMessage: function() {
        var a = l.globalData.dkform, e = {
            dktype: a.dktype,
            fqtype: a.fqtype,
            year: a.year,
            amt: a.form.amt,
            lilv: a.form.lilv
        };
        if (3 == a.dktype) {
            var o = l.globalData.gjjform.form;
            e.gjjamt = o.amt, e.gjjlilv = o.lilv;
        }
        return {
            title: "房贷计算结果如下",
            path: "/pages/result/result" + (0, t.objToQueryString)(e),
            success: function(t) {}
        };
    }
});