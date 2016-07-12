var express = require('express');
var router = express.Router();
var HttpHelper = require('../util/HttpHelper');

// 注销
// ALL  /logout
router.all('/', function (req, res, next) {
    var helper = new HttpHelper(req, res, next);
    req.session.destroy(function(err) {
        if(err){
            helper.code('0007');
        }else{
            helper.success();
        }
    });
});

module.exports = router;