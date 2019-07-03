const app = getApp()
var store = require('../../../utils/store.js');
Page({
    data: {
        TabCur: 0,
        scrollLeft: 0,
        key: 0,
        tabName: ['支出', '收入'],
        payList: [
            { 'viable': true, 'value': '吃喝' },
            { 'viable': false, 'value': '交通' },
            { 'viable': false, 'value': '买菜' },
            { 'viable': false, 'value': '孩子' },
            { 'viable': false, 'value': '服饰鞋包' },
            { 'viable': false, 'value': '化妆护肤' },
            { 'viable': false, 'value': '日用品' },
            { 'viable': false, 'value': '红包' },
            { 'viable': false, 'value': '话费' },
            { 'viable': false, 'value': '娱乐' },
            { 'viable': false, 'value': '医疗' },
            { 'viable': false, 'value': '公司' },
            { 'viable': false, 'value': '其他' }
        ],
        incomeList: [
            { 'viable': true, 'value': '工资' },
            { 'viable': false, 'value': '投资' },
            { 'viable': false, 'value': '奖金' },
            { 'viable': false, 'value': '兼职' },
            { 'viable': false, 'value': '红包' },
            { 'viable': false, 'value': '其他' },
        ],
        paySelectIndex: 0,
        incomeSelectIndex: 0,
        money: '',
        defaultCurrent: 0,
        moneyObj: {
            'payOrIncome': 0, //0 支出 1 收入
            'type': '吃喝',
            'money': 0,
            'time': '',
            'note': '',
            'token': ''
        },
        type: '',
        displayObj: {}
    },
    againRecord() {
        var moneyObj = this.data.moneyObj
        var that = this
        app.getStorage('wxtoken').then(res => {
            let token = res.data
            if (token) {
                moneyObj.token = token
                app.post(store.state.server + '/conf/rest/money/create', moneyObj).then(res => {
                    if (res.data.returnCode == 0) {
                        moneyObj.money = 0.00
                        moneyObj.note = ''
                        console.log(moneyObj)
                        that.setData({ moneyObj: moneyObj, money: '' })
                        console.log(moneyObj)
                    } else { app.showTextToast('保存失败') }
                }).catch(err => { app.showTextToast('保存失败') })
            } else { app.showTextToast('保存失败') }
        })
    },
    save() {
        var moneyObj = this.data.moneyObj
        app.getStorage('wxtoken').then(res => {
            let token = res.data
            if (token) {
                moneyObj.token = token
                if (moneyObj.money === 0) {
                    app.showTextToast('金额不能为0')
                } else {
                    app.post(store.state.server + '/conf/rest/money/create', moneyObj).then(res => {
                        if (res.data.returnCode == 0) {
                            wx.navigateBack({
                                delta: 1
                            })
                        } else { app.showTextToast('保存失败') }
                    }).catch(err => { app.showTextToast('保存失败') })
                }
            } else { app.showTextToast('保存失败') }
        })
    },
    update() {
        var moneyObj = this.data.moneyObj
        if (moneyObj.money === 0) {
            app.showTextToast('金额不能为0')
        } else {
            app.post(store.state.server + '/conf/rest/money/update', moneyObj).then(res => {
                if (res.data.returnCode == 0) {
                    wx.navigateBack({
                        delta: 1
                    })
                } else { app.showTextToast('保存失败') }
            }).catch(err => { app.showTextToast('保存失败') })
        }
    },
    delete() {
        var that = this
        wx.showModal({
            content: '确定删除吗？',
            success(res) {
                if (res.confirm) {
                    var moneyObj = that.data.moneyObj
                    var id = moneyObj.id
                    app.get(store.state.server + '/conf/rest/money/delete/' + id).then(res => {
                        if (res.data.returnCode == 0) {
                            wx.navigateBack({
                                delta: 1
                            })
                        } else { app.showTextToast('删除失败') }
                    }).catch(err => { app.showTextToast('删除失败') })
                } else if (res.cancel) {}
            }
        })
    },
    onChange(e) {
        var moneyObj = this.data.moneyObj
        moneyObj.payOrIncome = e.detail.key
        if (e.detail.key === 0) {
            moneyObj.type = '吃喝'
        } else { moneyObj.type = '工资' }

        this.setData({ defaultCurrent: e.detail.key, moneyObj: moneyObj, defaultCurrent: e.detail.key })
    },
    chooseType(e) {
        let defaultCurrent = this.data.defaultCurrent
        var moneyObj = this.data.moneyObj
        if (defaultCurrent === 0) {
            let index = e.currentTarget.dataset.index
            var payList = this.data.payList
            payList[this.data.paySelectIndex].viable = false
            payList[index].viable = true
            moneyObj.type = payList[index].value
            this.setData({ payList: payList, paySelectIndex: index, moneyObj: moneyObj })
        } else {
            let index = e.currentTarget.dataset.index
            var incomeList = this.data.incomeList
            incomeList[this.data.incomeSelectIndex].viable = false
            incomeList[index].viable = true
            moneyObj.type = incomeList[index].value
            this.setData({ incomeList: incomeList, incomeSelectIndex: index, moneyObj: moneyObj })
        }
    },
    tabSelect(e) {
        this.setData({
            TabCur: e.currentTarget.dataset.id,
            scrollLeft: (e.currentTarget.dataset.id - 1) * 60
        })
    },
    noteInput(e) {
        var moneyObj = this.data.moneyObj
        moneyObj.note = filterEmoji(e.detail.value)
        this.setData({
            moneyObj: moneyObj
        })
    },
    moneyInput(e) {
        var moneyObj = this.data.moneyObj
        moneyObj.money = parseFloat(e.detail.value)
        this.setData({ money: e.detail.value, moneyObj: moneyObj })
    },
    bindDateChange(e) {
        var moneyObj = this.data.moneyObj
        moneyObj.time = e.detail.value
        this.setData({
            moneyObj: moneyObj
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this
        var timestamp = Date.parse(new Date());
        var date = new Date(timestamp);
        var Y = date.getFullYear();
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        console.log("当前时间：" + Y + '年' + M + '月' + D + '日');
        var moneyObj = that.data.moneyObj
        moneyObj.time = Y + '-' + M + '-' + D
        that.setData({
            moneyObj: moneyObj,
            type: options.type
        })
        if (options.type == 'display') {
            app.get(store.state.server + '/conf/rest/money/findById/' + options.id).then(res => {
                if (res.data.returnCode == 0) {
                    var nowChooseIndex = 0
                    if (res.data.data.payOrIncome === 0) { //支出
                        var payList = that.data.payList
                        payList.some(function(item, index, array) {
                            nowChooseIndex = index
                            return item.value === res.data.data.type
                        })
                        payList[that.data.paySelectIndex].viable = false
                        payList[nowChooseIndex].viable = true
                        console.log(payList)
                        that.setData({ payList: payList, paySelectIndex: nowChooseIndex })
                    } else {
                        var incomeList = that.data.incomeList
                        var nowChooseIndex = 0
                        incomeList.some(function(item, index, array) {
                            nowChooseIndex = index
                            return item.value === res.data.data.type
                        })
                        incomeList[that.data.incomeSelectIndex].viable = false
                        incomeList[nowChooseIndex].viable = true
                        that.setData({ incomeList: incomeList, incomeSelectIndex: nowChooseIndex })
                    }

                    that.setData({
                        moneyObj: res.data.data,
                        money: res.data.data.money,
                        defaultCurrent: res.data.data.payOrIncome,
                    })
                } else { app.showTextToast('查看失败') }
            }).catch(err => {
                app.showTextToast('查看失败')
                console.log(err)
            })
        }

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

    }

})

function filterEmoji(name) {

    var str = name.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig, "");

    return str;

}