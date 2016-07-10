"use strict";

const SUCC_CODE = "00";

const ERROR_CODE_MSG = {
    "0000": "系统繁忙，请稍后再试",
    "0001": "缺失入参",
    "0002": "入参有误",
    "0003": "用户名或密码错误",
    "0004": "未登录",
    "0005": "用户名不能为空",
    "0006": "登陆密码不能为空",
    "0007": "注销失败"
};

class HttpHelper {
    constructor(req, res, next) {
        Object.assign(this, {req, res, next});
    }

    code(code = "0000", msg = ERROR_CODE_MSG[code] || "") {
        this.res.json({code: code, msg: msg});
    }

    error(msg) {
        this.code(undefined, msg);
    }

    success(obj = {}) {
        this.res.json({code: SUCC_CODE, msg: "", data: obj});
    }
}
module.exports = HttpHelper;