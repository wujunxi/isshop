var express = require('express');
var router = express.Router();
var UserDao = require('../dao/UserDao');

//GET /users/get?uid=&login_id=
router.get('/get', function (req, res, next) {
    var userDao = new UserDao(req.query);
    userDao.query(function (list, total) {
        res.json({
            code: "200",
            msg: "success",
            data: {total: total, page: userDao.page, size: userDao.size, list: list}
        });
    });
});

//GET /users/getAll
router.get('/getAll', function (req, res, next) {
    var userDao = new UserDao(req.query);
    userDao.queryAll(function (list, total) {
        res.json({
            code: "200",
            msg: "success",
            data: {total: total, page: userDao.page, size: userDao.size, list: list}
        });
    });
});

//GET /users/getById?uid=&
router.get('/getById', function (req, res, next) {
    var userDao = new UserDao(req.query);
    userDao.queryById(function (userObj) {
        res.json({code: "200", msg: "success", data: userObj});
    });
});

//POST /users/add?name=&login_id=&login_pwd=
router.all('/add', function (req, res, next) {
    var userDao = new UserDao(req.query);
    userDao.insert(function (uid) {
        res.json({code: "200", msg: "success", data: {uid: uid}});
    });
});

//POST /users/delete?uid=
router.all('/delete', function (req, res, next) {
    var userDao = new UserDao(req.query);
    userDao.delete(function (uid) {
        res.json({code: "200", msg: "success", data: {uid: uid}});
    });
});

//POST /users/update?uid=&name=&login_id=&login_pwd=
router.all('/update', function (req, res, next) {
    var userDao = new UserDao(req.query);
    userDao.update(function (uid) {
        res.json({code: "200", msg: "success", data: {uid: uid}});
    });
});

module.exports = router;
