'use strict';
let crypto = require('crypto');
let UserDao = require('../dao/UserDao');
let redis = require('redis'),
    client = redis.createClient();
let $conf = require('../conf');

client.on("error", function (err) {
    console.log("Redis Error :" + err);
});

class LoginService {
    constructor() {

    }

    md5Pwd(pwd, key = '') {
        return crypto.createHash('md5').update(pwd + key).digest('hex');
    }

    randomKey() {
        return crypto.randomBytes(4).toString('hex');
    }

    checkLogin(obj, cb) {
        let self = this;
        let userDao = new UserDao(obj);
        let result = userDao.check(['login_id', 'login_pwd']);
        if (result !== true) {
            cb(null, result);
            return;
        }
        // 检查登录限制
        client.get(userDao.login_id, function (err, v = 0) {
            console.log(err, v);
            if (!err && v >= $conf.loginErrorLimit) {
                cb(null, '密码错误次数达到上限');
                return;
            }
            // 检查用户是否存在
            userDao.queryByLoginID(function (userObj) {
                if (!userObj) {
                    cb(null, '用户不存在');
                    return;
                }
                let md5Pwd = self.md5Pwd(userDao.login_pwd, userObj.md5_key);
                if (userObj.login_pwd != md5Pwd) {
                    // 错误次数加一
                    client.set(userDao.login_id, ++v);
                    cb(null, '密码有误');
                    return;
                }
                cb(userObj);
            });
        });
    }
}

module.exports = LoginService;