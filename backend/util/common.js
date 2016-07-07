var ERROR_MSG = {
    "0000":"未定义错误",
    "0001":"缺失入参",
    "0002":"入参有误",
    "0003":"用户名或密码错误",
    "0004":"未登录"
};

var common = {
    AJAX_SUCC:"00"
};

/**
 * 设置当前上下文
 * @param req
 * @param res
 * @param next
 */
common.set = function (req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
};

/**
 * 检查入参
 * @param opt
 */
common.checkParam = function (opt) {
    var param;
    for(var k in opt){
        param = this.req.query[k];
        if(typeof(param) == "undefined" || param == ""){
            this.error("0001");
        }else if(!opt[k].test(param)){
            this.error("0002");
        }
    }
};

/**
 * 返回失败信息
 * @param code
 */
common.error = function(code){
    if(arguments.length == 0){
        code = "0000";
    }
    var msg = ERROR_MSG[code];
    if(typeof(msg) == "undefined"){
        msg = "";
    }
    this.res.json({retCode:code,retMsg:msg});
};

/**
 * 返回成功信息
 * @param obj
 */
common.success = function(obj){
    if(arguments.length == 0){
        obj = {};
    }
    obj.retCode = this.AJAX_SUCC;
    obj.retMsg = "";
    this.res.json(obj);
};

Date.prototype.format = function(fmt) {
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
}

module.exports = common;