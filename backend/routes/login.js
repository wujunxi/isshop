var express = require('express');
var router = express.Router();
var UserDao = require('../dao/UserDao');
var HttpHelper = require('../util/HttpHelper');

//POST 登陆 /login?login_id=xxx&login_pwd=xxx
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
            helper.success({uid:userObj.uid,name:userObj.name});
        }else{
            helper.error('0003');
        }
    });
});

module.exports = router;