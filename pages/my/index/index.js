const app = getApp()
Component({
    options: {
        addGlobalClass: true,
    },
    data: {
        starCount: 0,
        forksCount: 0,
        visitTotal: 0,
    },
    attached() {
        let that = this;
        wx.showLoading({
            title: '数据加载中',
            mask: true,
        })
        let i = 0;
        numDH();

        function numDH() {
            if (i < 20) {
                setTimeout(function() {
                    that.setData({
                        starCount: i,
                        forksCount: i,
                        visitTotal: i
                    })
                    i++
                    numDH();
                }, 20)
            } else {
                that.setData({
                    starCount: that.coutNum(3000),
                    forksCount: that.coutNum(484),
                    visitTotal: that.coutNum(24000)
                })
            }
        }
        wx.hideLoading()
    },
    methods: {
        showCharts() {
            wx.getStorage({
                key: 'wxtoken',
                success: (res) => {
                    wx.navigateTo({
                        url: '/pages/my/charts/charts'
                    })
                },
                fail: (res) => {
                    wx.navigateTo({
                        url: '/pages/authorize/authorize'
                    })
                },
                complete: (res) => {

                }
            });
        }, 
        trashSort() { //垃圾分类
            wx.navigateToMiniProgram({
                appId: 'wxb1d395a44c5bb865', // 要跳转的小程序的appid
                path: 'pages/index/index', // 跳转的目标页面
                extarData: {
                    open: 'auth'
                },
                success(res) {
                    // 打开成功  
                }
            })

        },
        coutNum(e) {
            if (e > 1000 && e < 10000) {
                e = (e / 1000).toFixed(1) + 'k'
            }
            if (e > 10000) {
                e = (e / 10000).toFixed(1) + 'W'
            }
            return e
        },
        CopyLink(e) {
            wx.setClipboardData({
                data: e.currentTarget.dataset.link,
                success: res => {
                    wx.showToast({
                        title: '已复制',
                        duration: 1000,
                    })
                }
            })
        },
        timeline() {
            wx.getStorage({
                key: 'wxtoken',
                success: (res) => {
                    wx.navigateTo({
                        url: '/pages/my/timeline/timeline'
                    })
                },
                fail: (res) => {
                    wx.navigateTo({
                        url: '/pages/authorize/authorize'
                    })
                },
                complete: (res) => {

                }
            });

        },
        fixTime() {
            app.showTextToast('暂未开发')
        },
        showModal(e) {
            this.setData({
                modalName: e.currentTarget.dataset.target
            })
        },
        hideModal(e) {
            this.setData({
                modalName: null
            })
        },
        showQrcode() {
            wx.previewImage({
                urls: ['http://img.chinarui.cn/pay4me.jpg'],
                current: 'http://img.chinarui.cn/pay4me.jpg' // 当前显示图片的http链接      
            })
        },
        business(){
            wx.previewImage({ //商务合作
                urls: ['http://img.chinarui.cn/chinarui_wechat_code.jpg'],
                current: 'http://img.chinarui.cn/chinarui_wechat_code.jpg' // 当前显示图片的http链接      
            })
        }
    }
})