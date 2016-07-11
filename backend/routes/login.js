var express = require('express');
var router = express.Router();
var HttpHelper = require('../util/HttpHelper');
var LoginService = require('../service/LoginService');

//POST 登陆 /login
// body {login_id:xxx,login_pwd:xxx}
router.post('/', function (req, res, next) {
    var helper = new HttpHelper(req, res, next);
    var loginService = new LoginService();
    loginService.checkLogin(req.body, function (userObj,err) {
        if(err){
            helper.error(err);
            return;
        }
        // 将用户信息放入session
        var obj = {uid: userObj.uid, name: userObj.name};
        req.session.user = obj;
        helper.success(obj);
    });
});

module.exports = router;