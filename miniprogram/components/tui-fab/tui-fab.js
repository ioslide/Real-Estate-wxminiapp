Component({
  properties: {
    //rpx 为0时值为auto
    left: {
      type: Number,
      value: 0
    },
    //rpx 当为0时且left不为0，值为auto
    right: {
      type: Number,
      value: 80
    },
    //rpx bottom值
    bottom: {
      type: Number,
      value: 100
    },
    //默认按钮 宽度 rpx
    width: {
      type: Number,
      value: 108
    },
    //默认按钮 高度 rpx
    height: {
      type: Number,
      value: 108
    },
    //圆角值
    radius: {
      type: String,
      value: "50%"
    },
    //默认按钮背景颜色
    bgColor: {
      type: String,
      value: "#c3c6d2"
    },
    //字体颜色
    color: {
      type: String,
      value: "#fff"
    },
    btnList: {
      type: Array,
      value: []
    },
    //点击遮罩 是否可关闭
    maskClosable: {
      type: Boolean,
      value: false
    }
  },
  data: {
    isOpen: false,
    hidden: true,
    timer: null
  },
  lifetimes: {
    detached: function () {
      clearTimeout(this.data.timer)
      this.setData({
        timer: null
      })
    }
  },
  methods: {
    stop(){},
    handleClick: function (e) {
      let index = e.currentTarget.dataset.index
      this.setData({
        hidden: false
      })
      clearTimeout(this.data.timer)
      if (index == -1 && this.data.btnList.length) {
        this.setData({
          isOpen: !this.data.isOpen
        })
      } else {
        this.triggerEvent("click", {
          index: Number(index)
        })
        this.setData({
          isOpen: false
        })
      }
      if (!this.data.isOpen) {
        this.setData({
          timer: setTimeout(() => {
            this.setData({
              hidden: true
            })
          }, 200)
        })
      }
    },
    handleClickCancel: function () {
      if (!this.data.maskClosable) return;
      this.setData({
        isOpen: false
      })
    }
  }
})