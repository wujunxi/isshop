"use strict";

let ERROR_MSG = {
    "0000": "未定义错误",
    "0001": "缺失入参",
    "0002": "入参有误",
    "0003": "用户名或密码错误",
    "0004": "未登录",
    "0005": "用户名不能为空",
    "0006": "登陆密码不能为空"
};

let AJAX_SUCC = "00";

class HttpHelper {
    constructor(req, res, next) {
        this.req = req;
        this.res = res;
        this.next = next;
    }

    checkParam(opt, cb) {
        let param;
        for (let k in opt) {
            param = this.req.query[k];
            if (typeof(param) == "undefined" || param == "") {
                this.error("0001", k);
                return;
            } else if (!opt[k].test(param)) {
                this.error("0002", k);
                return;
            }
        }
        if (cb) {
            cb();
        }
    }

    error(code, attach) {
        code = code || "0000";
        attach = attach || "";
        var msg = ERROR_MSG[code];
        if (typeof(msg) == "undefined") {
            msg = "";
        }
        this.res.json({code: code, msg: msg + attach});
    }

    success(obj) {
        obj = obj || {};
        this.res.json({code: AJAX_SUCC, msg: "", data: obj});
    }
}
module.exports = HttpHelper;