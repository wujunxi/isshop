"use strict";
let Dao = require('./Dao');
let comm = require('../util/common');

// 字段
let fields = {
    uid: '用户编码',
    name: '用户名',
    login_id: '账号',
    login_pwd: '密码',
    md5_key: 'MD5 Key',
    state: '状态'
};

// 字段校验规则
let rules = {
    uid: function () {
        if (!this.uid) return `${fields.uid}不能为空`;
        if (!/^\d+$/.test(this.uid)) return `${fields.uid}只能由数字组成`;
        return true;
    },
    name: function () {
        return comm.checkName(this.name);
    },
    login_id: function () {
        if (!this.login_id) return `${fields.login_id}不能为空`;
        if (!/^[0-9a-zA-Z]{6,32}$/.test(this.login_id))
            return `${fields.login_id}只能由字母和数字组成，最少6位，最长32位`;
        return true;
    },
    login_pwd: function () {
        if (!this.login_pwd) return `${fields.login_pwd}不能为空`;
        return true;
    }
};

// SQL
const sql = {
    insert: 'insert into user_info (name,login_id,login_pwd,md5_key)values($name,$login_id,$login_pwd,$md5_key)',
    update: 'update user_info set name = $name, login_pwd = $login_pwd, md5_key = $md5_key, modify_time = now() where uid = $uid',
    'delete': 'delete from user_info where uid = $uid',
    queryById: 'select * from user_info where uid = $uid',
    queryAll: 'select * from user_info $_limit',
    query: 'select * from user_info where 1=1 {and uid=$uid} {and name=$name} {and login_id=$login_id} $_limit',
    checkLogin: 'select * from user_info where login_id = $login_id'
};

class UserDao extends Dao {
    constructor(obj) {
        super();
        super.__extend();
        super.__load(obj);
    }

    get sql() {
        return sql;
    }

    /**
     * 登录检测
     * @param cb
     */
    checkLogin(cb) {
        let self = this;
        self.pool.getConnection((err, conn) => {
            if (err) throw err;
            conn.query(self.parseSql(self.sql.checkLogin), function (err, rows) {
                conn.release();
                if (err) throw err;
                if (rows && rows.length > 0) {
                    cb(rows[0]);
                } else {
                    cb();
                }
            });
        });
    }

    get __fields() {
        return fields;
    }

    set __fields(f) {
        fields = f;
    }

    get __rules() {
        return rules;
    }

    set __rules(r) {
        rules = r;
    }
}

module.exports = UserDao;