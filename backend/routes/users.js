var express = require('express');
var router = express.Router();
var UserDao = require('../dao/UserDao');
var HttpHelper = require('../util/HttpHelper');

//GET 条件查询 /users/get?uid=xxx&name=xxx&login_id=xxx
router.get('/get', function (req, res, next) {
    var helper = new HttpHelper(req, res, next);
    var userDao = new UserDao(req.query);
    // 查询不做入参校验
    // var result = userDao.check(['uid','name','login_id'],true);
    // if(result !== true){
    //     helper.error(result);
    //     return;
    // }
    // 查询成功返回记录列表及记录总数
    userDao.query(function (list, total) {
        helper.success({total: total, page: userDao.page, size: userDao.size, list: list});
    });
});

//GET 查询全部 /users/getAll
router.get('/getAll', function (req, res, next) {
    var helper = new HttpHelper(req, res, next);
    var userDao = new UserDao(req.query);
    // 查询成功返回记录列表及记录总数
    userDao.queryAll(function (list, total) {
        helper.success({total: total, page: userDao.page, size: userDao.size, list: list});
    });
});

//GET 根据ID查询 /users/getById?uid=xxx
router.get('/getById', function (req, res, next) {
    var helper = new HttpHelper(req, res, next);
    var userDao = new UserDao(req.query);
    // 校验入参
    var result = userDao.check(['uid']);
    if(result !== true){
        helper.error(result);
        return;
    }
    // 查询成功返回记录对象
    userDao.queryById(function (userObj) {
        helper.success(userObj);
    });
});

//POST 添加 /users/add
// body {name:xxx,login_id:xxx,login_pwd:xxx}
router.post('/add', function (req, res, next) {
    var helper = new HttpHelper(req, res, next);
    var userDao = new UserDao(req.body);
    // 校验入参
    var result = userDao.check(['name','login_id','login_pwd']);
    if(result !== true){
        helper.error(result);
        return;
    }
    // 插入成功返回uid
    userDao.insert(function (uid) {
        helper.success({uid: uid});
    });
});

//POST 删除 /users/delete
// body {uid:xxx}
router.post('/delete', function (req, res, next) {
    var helper = new HttpHelper(req, res, next);
    var userDao = new UserDao(req.body);
    var result = userDao.check(['uid']);
    if(result === true){
        // 删除成功返回uid
        userDao.delete(function (uid) {
            helper.success({uid: uid});
        });
    }else{
        helper.error(result);
    }
});

//POST 更新 /users/update
// body {uid:xxx,name:xxx,login_id:xxx,login_pwd:xxx}
router.post('/update', function (req, res, next) {
    var helper = new HttpHelper(req, res, next);
    var userDao = new UserDao(req.body);
    var result = userDao.check(['name','login_id','login_pwd']);
    if(result === true){
        // 更新成功返回uid
        userDao.update(function (uid) {
            helper.success({uid: uid});
        });
    }else{
        helper.error(result);
    }
});

module.exports = router;
