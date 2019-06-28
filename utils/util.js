const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

const secondToDate = result => {
    var h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
    var m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
    var s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
    return h + ":" + m + ":" + s
}

const count_down = countDown_time => {
    var that = this;
    var time = countDown_time.split(':')
    var hhh = parseInt(time[0])
    var mmm = parseInt(time[1])
    var sss = parseInt(time[2])

    that.setData({
        ss: (sss < 10) ? '0' + sss : sss,
        mm: (mmm < 10) ? '0' + mmm : mmm,
        hh: (hhh < 10) ? '0' + hhh : hhh
    })
    var Interval = setInterval(function() {
        if (sss > 0) {
            sss--
        } else if (sss == 0 && mmm == 0 & hhh == 0) {
            clearInterval(Interval)
        }
        if (sss == 0) {
            if (mmm > 0) {
                mmm--
                sss = 59;
            }
            if (mmm == 0 && hhh > 0) {
                hhh--
                sss = 59;
                mmm = 59;
            }
        }
        that.setData({
            ss: (sss < 10) ? '0' + sss : sss,
            mm: (mmm < 10) ? '0' + mmm : mmm,
            hh: (hhh < 10) ? '0' + hhh : hhh
        })
    }, 1000)
    that.setData({ Interval: Interval })
}
module.exports = {
    formatTime: formatTime
}