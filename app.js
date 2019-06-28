import { $wuxToast } from '/static/wux/index'
var store = require('./utils/store.js');

//app.js
App({
    showTextToast: function(data) {
        $wuxToast().show({
            type: 'text',
            duration: 600,
            color: '#fff',
            text: data,
            success: () => {}
        })
    },
    getQiNiuToken: function() {
        this.get(store.state.ip + ':' + store.state.port + '/wem/rest/token/get', null).then((res) => {
            this.globalData.qiniuToken = res.data.token
        }).catch((err) => {
            app.showTextToast('服务器异常')
        })
    },


    getStorage: function(key) {
        var getStoragePromise = new Promise(function(getSuccess, getFail) {
            wx.getStorage({
                key: 'wxtoken',
                success: (res) => {
                    getSuccess(res)
                },
                fail: (res) => {
                    getFail(res)
                }
            });
        })
        return getStoragePromise
    },

    post: function(url, data) {
        var postpromise = new Promise(function(postsuccess, postfail) {
            wx.showLoading({
                title: '数据加载中',
                mask: true,
            })
            wx.request({
                header: { 'content-type': 'application/json' },
                url: url,
                data: data,
                method: "POST",
                success: function(sres) {
                    wx.hideLoading()
                    postsuccess(sres);
                },
                fail: (fres) => {
                    wx.hideLoading()
                    postfail(fres);
                }
            })
        })
        return postpromise;
    },
    get: function(url, data) {
        var postpromise = new Promise(function(getsuccess, getfail) {
            wx.showLoading({
                title: '数据加载中',
                mask: true,
            })
            wx.request({
                header: { 'content-type': 'application/json' },
                url: url,
                data: data,
                method: "GET",
                success: function(sres) {
                    wx.hideLoading()
                    getsuccess(sres);
                },
                fail: (fres) => {
                    wx.hideLoading()
                    getfail(fres);
                }
            })
        })
        return postpromise;
    },
    onLaunch: function() {
        wx.getSystemInfo({
            success: e => {
                this.globalData.systemInfo = e
                this.globalData.StatusBar = e.statusBarHeight;
                let custom = wx.getMenuButtonBoundingClientRect();
                this.globalData.Custom = custom;
                this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
            }
        })
    },
    globalData: {
        tabbarHeight: 0,
        userInfo: null,
        citys: {},
        bindinfo: [],
        qiniuToken: '',
        wxtoken: '',
        //组件my index页面 是否挂载 首页设置成my时
        // isAttached:null,
        // 首页设置成home时
        isAttached: null
    }
})