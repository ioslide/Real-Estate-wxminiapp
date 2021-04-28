function t(t) {
    if (isNaN(t)) return 0;
    var r = (t = (t = parseFloat(t)).toFixed(2)).split(".");
    return r.length > 1 && "00" == r[1] && (t = parseInt(r[0])), parseFloat(t);
}

function r(t) {
    return isNaN(t) ? 0 : t = (t = parseFloat(t)).toFixed(2);
}

function e(r, e, n) {
    for (var a = 12 * e, o = 1e4 * r, i = n / 100, l = o * i / 12 * Math.pow(1 + i / 12, a) / (Math.pow(1 + i / 12, a) - 1), s = 0, f = [], p = 0; p < a; p++) {
        var x = o * i / 12, c = l - x;
        o -= c, s += x, f.push({
            fld: p,
            em: u(c),
            lx: u(x),
            emtotal: u(l),
            leftbj: u(o <= 0 ? 0 : o)
        });
    }
    return {
        dktotal: o,
        lxtotal: t(s),
        alltotal: t(1e4 * r + s),
        amt: r,
        lilv: n,
        year: e,
        monthAmt: l,
        details: f
    };
}

function n(r, e, n) {
    for (var a = 12 * e, o = 1e4 * r, i = n / 100, l = o / a, s = 0, f = [], p = 0; p < a; p++) {
        var x = o * i / 12;
        o -= l, s += x, f.push({
            fld: p,
            em: u(l),
            lx: u(x),
            emtotal: u(l + x),
            leftbj: u(o <= 0 ? 0 : o)
        });
    }
    return {
        dktotal: o,
        lxtotal: t(s),
        alltotal: t(1e4 * r + s),
        amt: r,
        lilv: n,
        year: e,
        monthamt: l,
        details: f
    };
}

function a(t) {
    return t.toString().replace(/\d+/, function(t) {
        return t.replace(/(\d)(?=(\d{3})+$)/g, function(t) {
            return t + ",";
        });
    });
}

Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.amtInput = function(t) {
    var r = parseInt(t);
    return "" == t || isNaN(r) ? "" : 0 == r ? "" : r > o.MAX_AMT ? o.MAX_AMT : r + "";
}, exports.yearInput = function(t) {
    var r = parseInt(t);
    return "" == t || isNaN(r) ? "" : 0 == r ? "0" : r > o.MAX_YEAR ? o.MAX_YEAR : r + "";
}, exports.numFixed = t, exports.floatFixed = r, exports.numSplit = function(r) {
    var r = t(r), e = i(r);
    return {
        l: e = a(e),
        r: l(r),
        spl: "."
    };
}, exports.lilvInput = function(t) {
    var r = parseFloat(t);
    if ("" == t || isNaN(r)) return "";
    if (r > o.MAX_LILV) return 0;
    if (0 == r && "0." != t) return 0;
    if ("00" == t) return "0";
    if ("0." == t) return t;
    var e = t + "", n = e.indexOf("."), a = e.lastIndexOf(".");
    if (-1 != n && a != n) return r;
    if (t == r + ".") return t;
    if (t == r + ".0") return t;
    return n > 0 ? e.length - n > 5 ? e.substring(0, n + 4 + 1) : e.length - n == 5 ? r : t : r;
}, exports.numIsEmpty = function(t) {
    if (!t || "" == t) return !1;
    var r = parseFloat(t);
    return !(isNaN(r) || r <= 0);
}, exports.numIsEgtZero = function(t) {
    if (!t || "" == t) return !1;
    var r = parseFloat(t);
    return !(isNaN(r) || r < 0);
}, exports.debx = e, exports.debj = n, exports.dkCalc = function(t, r, a, o) {
    return 1 == t ? e(r, a, o) : n(r, a, o);
}, exports.objToQueryString = function(t) {
    var r = "?";
    for (var e in t) r += e + "=" + t[e] + "&";
    return r;
}, exports.localNumFormat = a, exports.localNumFloatFixed = function(t) {
    return t = r(t), a(t);
};

var o = require("./const"), u = function(t) {
    return isNaN(t) ? 0 : t;
}, i = function(t) {
    return t = "" + t, parseInt(t);
}, l = function(t) {
    var r = (t = "" + t).indexOf(".");
    return -1 == r ? "00" : (t += "00", r = t.indexOf("."), t.substr(r + 1).substr(0, 2));
};