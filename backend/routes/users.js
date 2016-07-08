var express = require('express');
var router = express.Router();
var UserDao = require('../dao/UserDao');
var HttpHelper = require('../util/HttpHelper');

//GET 条件查询 /users/get?uid=xxx&name=xxx&login_id=xxx
router.get('/get', function (req, res, next) {
    var helper = new HttpHelper(req, res, next);
    var userDao = new UserDao(req.query);
    userDao.query(function (list, total) {
        helper.success({total: total, page: userDao.page, size: userDao.size, list: list});
    });
});

//GET 查询全部 /users/getAll
router.get('/getAll', function (req, res, next) {
    var helper = new HttpHelper(req, res, next);
    var userDao = new UserDao(req.query);
    userDao.queryAll(function (list, total) {
        helper.success({total: total, page: userDao.page, size: userDao.size, list: list});
    });
});

//GET 根据ID查询 /users/getById?uid=xxx
router.get('/getById', function (req, res, next) {
    var helper = new HttpHelper(req, res, next);
    helper.checkParam({
        uid: /^\d+$/
    }, function () {
        var userDao = new UserDao(req.query);
        userDao.queryById(function (userObj) {
            helper.success(userObj);
        });
    });
});

//POST 添加 /users/add?name=xxx&login_id=xxx&login_pwd=xxx
router.all('/add', function (req, res, next) {
    var helper = new HttpHelper(req, res, next);
    helper.checkParam({
        name: /^[a-zA-Z0-9_]{4,10}$/,
        login_id: /^[a-zA-Z0-9_]{4,18}$/,
        login_pwd: /^[a-zA-Z0-9_]{4,18}$/
    }, function () {
        var userDao = new UserDao(req.query);
        userDao.insert(function (uid) {
            helper.success({uid: uid});
        });
    });
});

//POST 删除 /users/delete?uid=xxx
router.all('/delete', function (req, res, next) {
    var helper = new HttpHelper(req, res, next);
    helper.checkParam({
        uid: /^\d+$/
    }, function () {
        var userDao = new UserDao(req.query);
        userDao.delete(function (uid) {
            helper.success({uid: uid});
        });
    });
});

//POST 更新 /users/update?uid=xxx&name=xxx&login_id=xxx&login_pwd=xxx
router.all('/update', function (req, res, next) {
    var helper = new HttpHelper(req, res, next);
    helper.checkParam({
        uid: /^\d+$/,
        name: /^[a-zA-Z0-9_]{4,10}$/,
        login_pwd: /^[a-zA-Z0-9_]{4,18}$/
    }, function () {
        var userDao = new UserDao(req.query);
        userDao.update(function (uid) {
            helper.success({uid: uid});
        });
    });
});

module.exports = router;
