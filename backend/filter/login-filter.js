var express = require('express');
var router = express.Router();
var Helper = require("../util/HttpHelper");

/**
 * 登陆过滤器
 */
router.all('*',function(req,res,next){
    var helper = new Helper(req,res,next);
    // 检查是否有uid，没有则认为是非法登录
    if(req.session.uid && req.session.uid != ""){
        next();
    }else{
        helper.error("0004");
    }
});

module.exports = router;