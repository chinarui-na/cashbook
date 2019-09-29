//index.js
//获取应用实例
const app = getApp()
var store = require('../../utils/store.js');

Page({
    data: {
        currentTab: "home",
        isTiptrue: true,
        shareImgUrl:'http://img.chinarui.cn/share.jpg'
    },
    navChange(e) {
        this.setData({
            currentTab: e.currentTarget.dataset.cur
        })
    },
    addMoneyNote() {
        wx.getStorage({
            key: 'wxtoken',
            success: (res) => {
                wx.navigateTo({
                    url: '/pages/home/addMoneyNote/addMoneyNote?type=add'
                })
            },
            fail: (res) => {
                wx.navigateTo({
                    url: '/pages/authorize/authorize'
                })
            }
        });

    },
    closeThis() {
        wx.setStorage({
            key: 'loadOpen',
            data: 'OpenTwo'
        })
        this.setData({
            isTiptrue: false
        })
    },
    //事件处理函数
    onLoad: function(options) {
		
        // app.get(store.state.server + '/conf/rest/static/wechatCode').then(res=>{
        //     if(res.returnCode == 0){
        //         this.setData({shareImgUrl: res.data.data.cashbookShareImgUrl})
        //     }
        // }).catch(err=>{})
        let firstOpen = wx.getStorageSync("loadOpen")
        if (firstOpen == undefined || firstOpen == '') { //根据缓存周期决定是否显示新手引导
            this.setData({
                isTiptrue: true,
            })
        } else {
            this.setData({
                isTiptrue: false,
            })
        }
    },
    getUserInfo: function(e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
    onShareAppMessage: function(res) {
            return {
                title: '一款好用的记账小程序，有钱人都在用！',
                path: '/pages/index/index',
                imageUrl: 'http://img.chinarui.cn/share.jpg', //用户分享出去的自定义图片大小为5:4,
                success: function(res) {
                    console.log(res)
                },
                fail: function(res) {
                    console.log(res)
                },
            }
    },
})