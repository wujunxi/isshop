var express = require('express');
var router = express.Router();
var UserDao = require('../dao/UserDao');
var HttpHelper = require('../util/HttpHelper');
var loginService = require('../service/loginService');

//POST 注册 /register
//body {name:xxx,login_id:xxx,login_pwd:xxx}
router.post('/', function (req, res, next) {
    var helper = new HttpHelper(req, res, next);
    var userDao = new UserDao(req.body);
    var result = userDao.check(['name','login_id','login_pwd']);
    if(result !== true){
        helper.error(result);
        return;
    }
    // 检查用户是否存在
    userDao.queryByLoginID(function (userObj) {
        if (userObj) {
            helper.code('0009');
            return;
        }
        // 生成md5 key
        var key = loginService.randomKey();
        userDao.md5_key = key;
        userDao.login_pwd = loginService.md5Pwd(userDao.login_pwd,key);
        userDao.insert(function(uid){
            helper.success({uid: uid});
        })
    });
});

module.exports = router;