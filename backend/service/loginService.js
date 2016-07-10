'use strict';
let crypto = require('crypto');

module.exports = {
    md5Pwd:function(pwd,key = ''){
        return crypto.createHash('md5').update(pwd+key).digest('hex');
    },
    randomKey:function(){
        return crypto.randomBytes(4).toString('hex');
    }
};