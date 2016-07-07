var express = require('express');
var router = express.Router();
var com = require("../util/common");

/**
 * 登陆过滤器
 */
router.all('*',function(req,res,next){
    com.set(req,res,next);
    // 检查是否有uid，没有则认为是非法登录
    if(req.session.uid && req.session.uid != ""){
        next();
    }else{
        com.error("0004");
    }
});

module.exports = router;