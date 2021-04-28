function e(e) {
    var n = [];
    for (var o in e) n.push(encodeURIComponent(o) + "=" + encodeURIComponent(e[o]));
    return n.join("&");
}

var n = function(n, o) {
    var t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "GET", r = {
        "content-type": "application/json"
    };
    return "POST" == (t = t.toUpperCase()) && (o = e(o), r = {
        "content-type": "application/x-www-form-urlencoded"
    }), new Promise(function(e, i) {
        wx.request({
            method: t.toUpperCase(),
            url: n,
            data: o,
            header: r,
            success: function(n) {
                if (200 == n.statusCode) {
                    var o = n.data;
                    e(o);
                } else i(error(n.statusCode, "请求出错了"));
            },
            fail: function(e) {
                i(error(1, "请求出错了"));
            },
            complete: function(e) {
                wx.hideNavigationBarLoading(), console.log("req:" + n + ",http " + t + " withdata:" + JSON.stringify(o)), 
                console.log("response:"), console.log(e);
            }
        });
    });
};

module.exports = {
    liLvApi: function() {
        return new Promise(function(e, o) {
            n("https://p.xingqu11.com/params/SMNr2vF3XCjAQ5dBkpEDBP/house_mortgage_rate/1.0/?tms=1525658989&sign=9db02d", {}, "get").then(function(n) {
                e(n);
            }, function(e) {
                o(e);
            });
        });
    },
    trimAll: function(e) {
        return e.replace(/\s/g, "");
    }
};