var express = require('express');
var router = express.Router();
var HttpHelper = require('../util/HttpHelper');

//ALL 注销 /logout
router.all('/', function (req, res, next) {
    var helper = new HttpHelper(req, res, next);
    req.session.destroy(function(err) {
        // cannot access session here
        if(err){
            helper.error('0007');
        }else{
            helper.success();
        }
    });
});

module.exports = router;