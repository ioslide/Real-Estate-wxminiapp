Component({
    properties: {
        imgUrl: {
            type: String,
            value: "https://cdn-fhy-file.bgy.com.cn/bu00310-prd1/5ed9c708e4b04e6375de997a.png"
        },
        tipsData: {
            type: Array,
            value: []
        },
        btnName: {
            type: String,
            value: ""
        },
        isAdd: {
            type: String,
            value: ""
        },
        btnUrl: {
            type: String,
            value: "/pages/HomePage/IndexPage"
        },
        btnDisabled: {
            type: String,
            value: ""
        },
        boxStyle: {
            type: String,
            value: ""
        },
        imgStyle: {
            type: String,
            value: ""
        },
        btnStyle: {
            type: String,
            value: ""
        },
        textStyle: {
            type: String,
            value: ""
        },
        isTabBarPage: {
            type: Number,
            value: 1
        }
    },
    observers: {
        btnUrl: function() {
            this.properties.btnUrl && (console.log(this.properties.btnUrl, this.data.url), this.setData({
                url: this.properties.btnUrl
            }));
        }
    },
    data: {
        url: "/pages/HomePage/IndexPage"
    },
    methods: {
        btnClick: function() {
            wx.navigateBack({
              delta: 0,
            })
        }
    }
});