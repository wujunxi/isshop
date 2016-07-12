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
    'delete': 'delete from user_info where uid = $uid',
    update: 'update user_info set name = $name, login_pwd = $login_pwd, md5_key = $md5_key, modify_time = now() where uid = $uid',
    updateLoginPwd: 'update user_info set login_pwd = $login_pwd, modify_time = now() where uid = $uid',
    query: 'select * from user_info where 1=1 {and uid=$uid} {and name=$name} {and login_id=$login_id} $_limit',
    queryByID: 'select * from user_info where uid = $uid',
    queryByLoginID: 'select * from user_info where login_id = $login_id'
};

class UserDao extends Dao {

    queryByID(cb) {
        this.query(cb,this.sql.queryByID);
    }

    queryByLoginID(cb){
        this.query(cb, this.sql.queryByLoginID);
    }

    updateLoginPwd(cb){
        this.update(cb,this.sql.updateLoginPwd);
    }

    constructor(obj) {
        super();
        super.__extend();
        super.__load(obj);
    }

    get sql() {
        return sql;
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