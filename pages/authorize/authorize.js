const app = getApp();
var store = require('../../utils/store.js');
Page({
    data: {
        //判断小程序的API，回调，参数，组件等是否在当前版本可用。
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    onLoad: function() {
        var that = this;
        // 查看是否授权
        wx.getSetting({
            success: function(res) {
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: function(res) {
                            
                        }
                    });
                }
            }
        })
    },
    bindGetUserInfo: function(e) {
        if (e.detail.userInfo) {
            //用户按了允许授权按钮
            var that = this;
            wx.login({
                success(res) {
                    if (res.code) {
                        app.get(store.state.server + '/conf/rest/wechat/login/' + res.code).then(res => {
                            console.log(res)
                            var data = res.data
                            if (data.returnCode == 1){
                                app.showTextToast('授权失败')
                               return
                            }
                            wx.setStorage({
                                key: 'wxtoken',
                                data: data.returnMsg,
                                success: function(res) {
                                    wx.navigateBack({
                                        delta: 1
                                    })
                                },
                                fail: function(res) {

                                }
                            })
                            //授权成功后，跳转进入小程序首页

                        }).catch(err => {

                        })
                    } else {

                    }
                }
            })
        } else {
            wx.showModal({
                title:'警告',
                content:'您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
                showCancel:false,
                confirmText:'返回授权',
                success:function(res){
                    if (res.confirm) {
                        console.log('用户点击了“返回授权”')
                    } 
                }
            })
        }
    }
})