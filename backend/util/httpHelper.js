"use strict";

let ERROR_MSG = {
    "0000": "未定义错误",
    "0001": "缺失入参",
    "0002": "入参有误",
    "0003": "用户名或密码错误",
    "0004": "未登录",
    "0005": "用户名不能为空",
    "0006": "登陆密码不能为空",
    "0007": "注销失败"
};

let AJAX_SUCC = "00";

class HttpHelper {
    constructor(req, res, next) {
        this.req = req;
        this.res = res;
        this.next = next;
    }

    checkQuery(opt, cb) {
        let param;
        for (let k in opt) {
            param = this.req.query[k];
            if (typeof(param) == "undefined" || param == "") {
                this.error("0001");
                return;
            } else if (!opt[k].test(param)) {
                this.error("0002");
                return;
            }
        }
        if (cb) {
            cb();
        }
    }

    error(code, msg) {
        code = code || "0000";
        msg =  msg || ERROR_MSG[code] || "";
        this.res.json({code: code, msg: msg});
    }

    success(obj) {
        obj = obj || {};
        this.res.json({code: AJAX_SUCC, msg: "", data: obj});
    }
}
module.exports = HttpHelper;