'use strict';
let crypto = require('crypto');
let UserDao = require('../dao/UserDao');
let redis = require('redis'),
    client = redis.createClient();
let $conf = require('../conf');

client.on("error", function (err) {
    console.error("Redis Error :" + err);
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

    register(obj,cb){
        let self = this;
        let userDao = new UserDao(obj);
        // 校验入参
        let result = userDao.check(['name', 'login_id', 'login_pwd']);
        if (result !== true) {
            cb(result);
            return;
        }
        // 检查用户是否存在
        userDao.queryByLoginID(function (userObj) {
            if (userObj) {
                cb('用户已存在');
                return;
            }
            // 生成md5 key
            let key = self.randomKey();
            userDao.md5_key = key;
            userDao.login_pwd = self.md5Pwd(userDao.login_pwd, key);
            userDao.insert(function (uid) {
                cb(null,{uid: uid});
            })
        });
    }

    checkLogin(obj, cb) {
        let self = this;
        let userDao = new UserDao(obj);
        let result = userDao.check(['login_id', 'login_pwd']);
        if (result !== true) {
            cb(result);
            return;
        }
        // 检查登录限制
        client.get(userDao.login_id, function (err, v = 0) {
            if (!err && v >= $conf.loginErrorLimit) {
                cb('密码错误次数达到上限');
                return;
            }
            // 检查用户是否存在
            userDao.queryByLoginID(function (userObj) {
                if (!userObj) {
                    cb('用户不存在');
                    return;
                }
                let md5Pwd = self.md5Pwd(userDao.login_pwd, userObj.md5_key);
                if (userObj.login_pwd != md5Pwd) {
                    // 错误次数加一
                    client.set(userDao.login_id, ++v);
                    cb('密码有误');
                    return;
                }
                cb(null,userObj);
            });
        });
    }
}

module.exports = LoginService;