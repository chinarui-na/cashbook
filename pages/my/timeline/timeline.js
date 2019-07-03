const app = getApp()
var store = require('../../../utils/store.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
      moneyRecord:[]
    },
    onLoad: function(options) {
        wx.getStorage({
            key: 'wxtoken',
            success: (res) => {
                var that = this
                var moneyRecord = []
                app.get(store.state.server + '/conf/rest/money/moneyList/' + res.data).then(res => {
                    var arr = res.data.data.list
                    var moneyRecord = [];
                    var aviable = 0
                    arr.forEach(function(oldData, i) {
                        var index = -1;
                        var alreadyExists = moneyRecord.some(function(newData, j) {
                            if (oldData.time.substring(0, 7) === newData.time) {
                                index = j;
                                return true;
                            }
                        });
                        if (!alreadyExists) {
                          var payMoney = 0;
                                var incomeMoney = 0;
                                if (oldData.payOrIncome === 0) {
                                    payMoney = oldData.money
                                } else {
                                    incomeMoney = oldData.money
                                }
                            moneyRecord.push({
                                time: oldData.time.substring(0, 7),
                                list: [oldData],
                                pay: payMoney,
                                income: incomeMoney

                            });
                        } else {
                            if (oldData.payOrIncome === 0) {
                                moneyRecord[index].pay = that.accAdd(oldData.money, moneyRecord[index].pay)
                            } else {
                                moneyRecord[index].income = that.accAdd(oldData.money, moneyRecord[index].income)
                            }
                            oldData.time = oldData.time.substring(0, 7)
                            moneyRecord[index].list.push(oldData);
                        }
                    });

                    that.setData({moneyRecord:moneyRecord})
                }).catch(err => {
                    console.log(err)
                })
            }
        });
    },
    accSub(arg1, arg2) {
        var r1, r2, m, n;
        try {
            r1 = arg1.toString().split(".")[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = arg2.toString().split(".")[1].length;
        } catch (e) {
            r2 = 0;
        }
        m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
        n = (r1 >= r2) ? r1 : r2;
        return ((arg1 * m - arg2 * m) / m).toFixed(n);
    },
    accAdd(arg1, arg2) {
        var r1, r2, m, c;
        try {
            r1 = arg1.toString().split(".")[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = arg2.toString().split(".")[1].length;
        } catch (e) {
            r2 = 0;
        }
        c = Math.abs(r1 - r2);
        m = Math.pow(10, Math.max(r1, r2));
        if (c > 0) {
            var cm = Math.pow(10, c);
            if (r1 > r2) {
                arg1 = Number(arg1.toString().replace(".", ""));
                arg2 = Number(arg2.toString().replace(".", "")) * cm;
            } else {
                arg1 = Number(arg1.toString().replace(".", "")) * cm;
                arg2 = Number(arg2.toString().replace(".", ""));
            }
        } else {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", ""));
        }
        return (arg1 + arg2) / m;
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})