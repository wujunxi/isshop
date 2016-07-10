var common = {};

/**
 * 姓名校验
 * @param str
 * @returns {*}
 */
common.checkName = function (str) {
    if (!str) {
        return '姓名不能为空';
    }
    if (str.length > 32) {
        return '姓名长度不能超过32个字符';
    }
    if (/^\d/.test(str) || /[^a-zA-Z0-9\u4E00-\u9FA5\uF900-\uFA2D·]/.test(str)) {
        return '姓名只能由英文字母、数字、汉字或·组成，且不能以数字开头';
    }
    return true;
};

Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };

    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear().toString()).substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

module.exports = common;