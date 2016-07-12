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
    userDao.query(function (err, list, total) {
        if (err) {
            helper.error(err);
        } else {
            helper.success({total: total, page: userDao.page, size: userDao.size, list: list});
        }
    });
});

//GET 查询全部 /users/getAll
router.get('/getAll', function (req, res, next) {
    var helper = new HttpHelper(req, res, next);
    var userDao = new UserDao(req.query);
    // 查询成功返回记录列表及记录总数
    userDao.queryAll(function (err, list, total) {
        if (err) {
            helper.error(err);
        } else {
            helper.success({total: total, page: userDao.page, size: userDao.size, list: list});
        }
    });
});

//GET 根据ID查询 /users/getById?uid=xxx
router.get('/getById', function (req, res, next) {
    var helper = new HttpHelper(req, res, next);
    var userDao = new UserDao(req.query);
    // 校验入参
    var result = userDao.check(['uid']);
    if (result !== true) {
        helper.error(result);
        return;
    }
    // 查询成功返回记录对象
    userDao.queryById(function (err, userObj) {
        if (err) {
            helper.error(err);
        } else {
            helper.success(userObj);
        }
    });
});

//POST 添加 /users/add
// body {name:xxx,login_id:xxx,login_pwd:xxx}
router.post('/add', function (req, res, next) {
    var helper = new HttpHelper(req, res, next);
    var userDao = new UserDao(req.body);
    // 校验入参
    var result = userDao.check(['name', 'login_id', 'login_pwd']);
    if (result !== true) {
        helper.error(result);
        return;
    }
    // 插入成功返回uid
    userDao.insert(function (err, resultObj) {
        if (err) {
            helper.error(err);
        } else {
            helper.success(resultObj);
        }
    });
});

//POST 删除 /users/delete
// body {uid:xxx}
router.post('/delete', function (req, res, next) {
    var helper = new HttpHelper(req, res, next);
    var userDao = new UserDao(req.body);
    var result = userDao.check(['uid']);
    if (result !== true) {
        helper.error(result);
        return;
    }
    userDao.delete(function (err) {
        if (err) {
            helper.error(err);
        } else {
            helper.success();
        }
    });
});

//POST 更新 /users/update
// body {uid:xxx,name:xxx,login_id:xxx,login_pwd:xxx}
router.post('/update', function (req, res, next) {
    var helper = new HttpHelper(req, res, next);
    var userDao = new UserDao(req.body);
    var result = userDao.check(['name', 'login_id', 'login_pwd']);
    if (result !== true) {
        helper.error(result);
        return;
    }
    userDao.update(function (err) {
        if (err) {
            helper.error(err);
        } else {
            helper.success();
        }
    });
});

module.exports = router;
