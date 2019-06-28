const app = getApp()
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
        money:'',
        moneyObj: {
            'payOrIncome': 0, //0 支出 1 收入
            'type': '吃喝',
            'money': 0,
            'time': '',
            'note': '',
            'token':''
        }
    },
    againRecord(){
      var moneyObj = this.data.moneyObj
      var that = this
        app.getStorage('wxtoken').then(res=>{
          let token = res.data
          if(token){
            moneyObj.token = token
              app.post(store.state.server +'/conf/rest/money/create',moneyObj).then(res=>{
                if(res.data.returnCode == 0){
                  moneyObj.money = 0.00
                  moneyObj.note = ''
                  console.log(moneyObj)
                  that.setData({moneyObj:moneyObj,money:''})
                  console.log(moneyObj)
                }else{app.showTextToast('保存失败')}
              }).catch(err=>{ app.showTextToast('保存失败') })
          }else{app.showTextToast('保存失败')}
        })
    },
    save() {
        var moneyObj = this.data.moneyObj
        app.getStorage('wxtoken').then(res=>{
          let token = res.data
          if(token){
            moneyObj.token = token
              app.post(store.state.server + '/conf/rest/money/create',moneyObj).then(res=>{
                console.log(res)
                if(res.data.returnCode == 0){
                  wx.navigateBack({
                    delta: 1
                  })
                }else{app.showTextToast('保存失败')}
              }).catch(err=>{ app.showTextToast('保存失败') })
          }else{app.showTextToast('保存失败')}
        })
    },
    onChange(e) {
        var moneyObj = this.data.moneyObj
        moneyObj.payOrIncome =  e.detail.key
        if(e.detail.key === 0){
          moneyObj.type = '吃喝'
        }else{moneyObj.type = '工资'}

        this.setData({ key: e.detail.key, moneyObj: moneyObj })
    },
    chooseType(e) {
        let key = this.data.key
        var moneyObj = this.data.moneyObj
        if (key === 0) {
            let index = e.currentTarget.dataset.index
            var payList = this.data.payList
            payList[this.data.paySelectIndex].viable = false
            payList[index].viable = true
            moneyObj.type = payList[index].value
            this.setData({ payList: payList, paySelectIndex: index,moneyObj:moneyObj })
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
        moneyObj.note = e.detail.value
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
        var timestamp = Date.parse(new Date());
        var date = new Date(timestamp);
        var Y = date.getFullYear();
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        console.log("当前时间：" + Y + '年' + M + '月' + D + '日');
        var moneyObj = this.data.moneyObj
        moneyObj.time = Y + '-' + M + '-' + D
        this.setData({
            moneyObj: moneyObj
        })
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