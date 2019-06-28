//index.js
//获取应用实例
const app = getApp()
var store = require('../../utils/store.js');

Page({
    data: {
        currentTab: "home"
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
                    url: '/pages/home/addMoneyNote/addMoneyNote'
                })
            },
            fail: (res) => {
                wx.navigateTo({
                    url: '/pages/authorize/authorize'
                })
            }
        });

    },
    //事件处理函数
    onLoad: function(options) {

    },
    getUserInfo: function(e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    }
})