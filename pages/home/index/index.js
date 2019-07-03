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
        aviable: 0.00,
        imgMap: null,
        date: '2019-07'
    },
    pageLifetimes: {
        show: function() {
            this.getMoneyData(this.data.date)
        }
    },
    lifetimes: {
        attached() {
            var timestamp = Date.parse(new Date());
            var date = new Date(timestamp);
            var Y = date.getFullYear();
            var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
            if (app.globalData.isAttached) {
                this.getMoneyData(Y + '-' + M)
                app.globalData.isAttached = null
            }
            this.setData({ date: Y + '-' + M })

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
            }, 100)
            this.setImgMap()
        },
        detached() {
            app.globalData.isAttached = true
        },
    },
    methods: {
        bindDateChange: function(e) {
            this.getMoneyData(e.detail.value)
            this.setData({
                date: e.detail.value
            })
        },
        detail(e) {
            var moneyRecord = this.data.moneyRecord
            var choose = moneyRecord[e.currentTarget.dataset.index1].list[e.currentTarget.dataset.index2]
            wx.navigateTo({
                url: '/pages/home/addMoneyNote/addMoneyNote?type=display&id=' + choose.id
            })
        },
        getMoneyData(date) {
            wx.getStorage({
                key: 'wxtoken',
                success: (res) => {
                    var that = this
                    app.get(store.state.server + '/conf/rest/money/moneyList/' + res.data + '/' + date).then(res => {
                        var arr = res.data.data.list
                        var moneyRecord = [];
                        var pay = 0
                        var income = 0
                        var aviable = 0
                        arr.forEach(function(oldData, i) {
                            oldData.imgUrl = that.data.imgMap.get(oldData.type)
                            if (oldData.payOrIncome === 0) {
                                pay = that.accAdd(pay, oldData.money)
                            } else { income = that.accAdd(income, oldData.money) }
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
                                oldData.money = that.changeMoney(oldData.money)
                                moneyRecord.push({
                                    time: oldData.time,
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
                                oldData.money = that.changeMoney(oldData.money)

                                moneyRecord[index].list.push(oldData);
                            }
                        });
                        this.setData({ aviable: this.changeMoney(this.accSub(income, pay)), pay: that.changeMoney(pay), income: that.changeMoney(income)})
                        moneyRecord.forEach(function(element, index) {
                            element.pay = that.changeMoney(element.pay)
                            element.income = that.changeMoney(element.income)
                        });
                        this.setData({ moneyRecord: moneyRecord })
                    }).catch(err => {
                        console.log(err)
                    })
                }
            });
        },
        setImgMap() {
            var imgMap = new Map()
            imgMap.set('吃喝', 'http://img.chinarui.cn/canyin.png')
            imgMap.set('交通', 'http://img.chinarui.cn/jiaotong3.png')
            imgMap.set('买菜', 'http://img.chinarui.cn/maicai.png')
            imgMap.set('孩子', 'http://img.chinarui.cn/haizi.png')
            imgMap.set('服饰鞋包', 'http://img.chinarui.cn/fushixiebao.png')
            imgMap.set('化妆护肤', 'http://img.chinarui.cn/huazhuang1.png')
            imgMap.set('日用品', 'http://img.chinarui.cn/riyongpin.png')
            imgMap.set('红包', 'http://img.chinarui.cn/hongbao1.png')
            imgMap.set('话费', 'http://img.chinarui.cn/huafei.png')
            imgMap.set('娱乐', 'http://img.chinarui.cn/yule3.png')
            imgMap.set('医疗', 'http://img.chinarui.cn/yiliao1.png')
            imgMap.set('公司', 'http://img.chinarui.cn/gongsi.png')
            imgMap.set('其他', 'http://img.chinarui.cn/qita1.png')
            imgMap.set('工资', 'http://img.chinarui.cn/gongzi1.png')
            imgMap.set('投资', 'http://img.chinarui.cn/gongzi1.png')
            imgMap.set('奖金', 'http://img.chinarui.cn/gongzi1.png')
            imgMap.set('兼职', 'http://img.chinarui.cn/gongzi1.png')
            this.setData({ imgMap: imgMap })
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
        thousands(num) {
            var str = num.toString();
            var reg = str.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
            return str.replace(reg, "$1,");
        },

        changeMoney(num) {
            num = parseFloat(num)
            var isFu = false
            var result = ""
            if(num < 0){
                num = Math.abs(num)
                isFu = true
            }
            var regexp = /(?:\.0*|(\.\d+?)0+)$/
            if (num > 1000000) {
                num = JSON.stringify(num)
                if (num.indexOf(".") != -1) {
                    num = num.substring(0, num.indexOf("."))
                }
                var front = num.substring(0, num.length - 4)
                var back = '0.' + num.substring(num.length - 4, num.length)
                var back2 = parseFloat(back).toFixed(2)
                num = parseInt(front) + parseFloat(back2)
                result = this.thousands(num) + '万'
            } else {
                result =  this.thousands(num)
            }
            if(isFu){
                result = '-' + result
            }
            return result
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