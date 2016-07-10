var express = require('express');
var router = express.Router();
var UserDao = require('../dao/UserDao');
var HttpHelper = require('../util/HttpHelper');

//POST 登陆 /login
// body {login_id:xxx,login_pwd:xxx}
router.post('/', function (req, res, next) {
    var helper = new HttpHelper(req, res, next);
    var userDao = new UserDao(req.body);
    var result = userDao.check(['login_id','login_pwd']);
    if(result !== true){
        helper.error(result);
        return;
    }
    userDao.checkLogin(function (userObj) {
        if (userObj) {
            // 将用户信息放入session
            var obj = {uid: userObj.uid, name: userObj.name};
            req.session.user = obj;
            helper.success(obj);
        } else {
            helper.code('0003');
        }
    });
});

module.exports = router;