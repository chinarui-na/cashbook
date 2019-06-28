const app = getApp()
var store = require('../../../utils/store.js');
Component({
    options: {
        addGlobalClass: true,
    },
    data: {
        height: app.globalData.CustomBar,
        scrollHeight: 0,
        noticeBarHeight: 0,
        modalName: 'Model',
        moneyRecord: [],
        income: 0.00,
        pay: 0.00,
        aviable: 0.00
    },
    pageLifetimes: {
        show: function() {
            this.getMoneyData()
        }
    },
    lifetimes: {
        attached() {
            if (app.globalData.isAttached) {
                this.getMoneyData()
                app.globalData.isAttached = null
            }
            var that = this
            const query = wx.createSelectorQuery().in(this);
            setTimeout(function() {
                query.select('#panel').boundingClientRect()
                query.select('#noticeBar').boundingClientRect()
                query.exec((res) => {
                    let height = res[0].height
                    var scrollHeight = that.data.scrollHeight
                    scrollHeight = ((app.globalData.systemInfo.screenHeight - app.globalData.CustomBar) * 2 - 100 - height * 2) / 2
                    that.setData({ scrollHeight: scrollHeight, noticeBarHeight: res[1].height })
                })
            }, 50)

        },
        detached() {
            app.globalData.isAttached = true
        },
    },
    methods: {
        getMoneyData() {
            wx.getStorage({
                key: 'wxtoken',
                success: (res) => {
                    var timestamp = Date.parse(new Date());
                    var date = new Date(timestamp);
                    var Y = date.getFullYear();
                    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
                    var that = this
                    app.get(store.state.server +'/conf/rest/money/moneyList/' + res.data + '/' + Y + '-' + M).then(res => {
                        var arr = res.data.data.list
                        var moneyRecord = [];
                        var pay = 0
                        var income = 0
                        var aviable = 0
                        arr.forEach(function(oldData, i) {
                            if (oldData.payOrIncome === 0) {
                                pay = that.accAdd(pay,oldData.money)
                            } else { income = that.accAdd(income,oldData.money)}
                            var index = -1;
                            var createTime = oldData.time;
                            var alreadyExists = moneyRecord.some(function(newData, j) {
                                if (oldData.time === newData.time) {
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
                                    time: oldData.time,
                                    list: [oldData],
                                    pay: payMoney,
                                    income: incomeMoney

                                });
                            } else {
                                if (oldData.payOrIncome === 0) {
                                    moneyRecord[index].pay = that.accAdd(oldData.money,moneyRecord[index].pay)
                                } else {
                                    moneyRecord[index].income = that.accAdd(oldData.money,moneyRecord[index].income)
                                }

                                moneyRecord[index].list.push(oldData);
                            }
                        });
                        this.setData({ pay: pay, income: income, aviable: this.accSub(income, pay) })
                        moneyRecord.forEach(function(element, index) {

                        });
                        this.setData({ moneyRecord: moneyRecord })
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
        closeNoticeBar() {
            var scrollHeight = this.data.scrollHeight
            scrollHeight = scrollHeight + this.data.noticeBarHeight
            this.setData({ scrollHeight: scrollHeight })
        },
        tabSelect(e) {
            this.setData({
                TabCur: e.currentTarget.dataset.id,
            })
        },
    }
})