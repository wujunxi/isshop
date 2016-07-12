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

    /**
     * MD5加密密码
     * @param pwd
     * @param key
     * @returns {*}
     */
    md5Pwd(pwd, key = '') {
        return crypto.createHash('md5').update(pwd + key).digest('hex');
    }

    /**
     * 生产随机串
     * @returns {string}
     */
    randomKey() {
        return crypto.randomBytes(4).toString('hex');
    }

    /**
     * 用户注册
     * @param obj
     * @param cb
     */
    register(obj, cb) {
        let self = this;
        let userDao = new UserDao(obj);
        // 校验入参
        let result = userDao.check(['name', 'login_id', 'login_pwd']);
        if (result !== true) {
            cb(result);
            return;
        }
        // 检查用户是否存在
        userDao.queryByLoginID(function (err, list, total) {
            if (err) {
                cb(err);
                return;
            }
            if (total > 0) {
                cb('用户已存在');
                return;
            }
            // 生成md5 key
            let key = self.randomKey();
            userDao.md5_key = key;
            userDao.login_pwd = self.md5Pwd(userDao.login_pwd, key);
            userDao.insert(cb)
        });
    }

    /**
     * 登陆判断
     * @param obj
     * @param cb
     */
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
            userDao.queryByLoginID(function (err, list, total) {
                if (err) {
                    cb(err);
                    return;
                }
                if (total == 0) {
                    cb('用户不存在');
                    return;
                }
                let row = list[0];
                let md5Pwd = self.md5Pwd(userDao.login_pwd, row.md5_key);
                if (row.login_pwd != md5Pwd) {
                    // 错误次数加一
                    client.set(userDao.login_id, ++v);
                    cb('密码有误');
                    return;
                }
                cb(null, row);
            });
        });
    }

    changePwd(obj, cb) {
        let self = this;
        if (!obj.new_login_pwd) {
            cb('新密码不能为空');
            return;
        }
        let userDao = new UserDao(obj);
        let result = userDao.check(['uid', 'login_pwd']);
        if (result !== true) {
            cb(result);
            return;
        }
        // 检查用户是否存在
        userDao.queryByID(function (err, list, total) {
            if (err) {
                cb(err);
                return;
            }
            if (total == 0) {
                cb('用户不存在');
                return;
            }
            let row = list[0];
            // 检查密码是否正确
            let md5Pwd = self.md5Pwd(userDao.login_pwd, row.md5_key);
            if (row.login_pwd != md5Pwd) {
                cb('密码有误');
                return;
            }
            // 更新密码
            userDao.login_pwd = self.md5Pwd(obj.new_login_pwd, row.md5_key);
            userDao.updateLoginPwd(cb);
        });

    }

    constructor() {

    }
}

module.exports = LoginService;