var express = require('express');
var router = express.Router();
var UserDao = require('../dao/UserDao');
var HttpHelper = require('../util/HttpHelper');

//POST 登陆 /register
//body {name:xxx,login_id:xxx,login_pwd:xxx}
router.post('/', function (req, res, next) {
    var helper = new HttpHelper(req, res, next);
    var userDao = new UserDao(req.body);
    if(!req.body.login_id){
        helper.error('0005');
        return;
    }
    if(!req.body.login_pwd){
        helper.error('0006');
        return;
    }
    userDao.checkLogin(function (userObj) {
        if(userObj){
            var obj = {uid:userObj.uid,name:userObj.name};
            req.session.user = obj;
            helper.success(obj);
        }else{
            helper.error('0003');
        }
    });
});

module.exports = router;