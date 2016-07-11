var express = require('express');
var router = express.Router();
var HttpHelper = require('../util/HttpHelper');
var LoginService = require('../service/LoginService');

//POST 注册 /register
//body {name:xxx,login_id:xxx,login_pwd:xxx}
router.post('/', function (req, res, next) {
    var helper = new HttpHelper(req, res, next);
    var loginService = new LoginService();
    loginService.register(req.body,function(err,userObj){
        if(err){
            helper.error(err);
            return;
        }
        helper.success(userObj);
    })
});

module.exports = router;