"use strict";
let Dao = require('./Dao');
class UserDao extends Dao {
    constructor(obj) {
        obj = obj || {};
        super(obj);
        this.uid = obj.uid;
        this.name = obj.name;
        this.login_id = obj.login_id;
        this.login_pwd = obj.login_pwd;
        this.md5_key = obj.md5_key;
    }

    get sql() {
        return {
            insert: 'insert into user_info (name,login_id,login_pwd,md5_key)values(?,?,?,?)',
            insertParam: [this.name, this.login_id, this.login_pwd, this.md5_key],
            update: 'update user_info set name = ?, login_id = ?,login_pwd = ?,md5_key = ?,modify_time = now() where uid = ?',
            updateParam:[this.name,this.login_id,this.login_pwd,this.md5_key,this.uid],
            'delete': 'delete from user_info where uid = ?',
            deleteParam:[this.uid],
            queryById: 'select * from user_info where uid = ?',
            queryByIdParam:[this.uid],
            queryAll: 'select * from user_info limit ?,?',
            queryAllParam:[+this.page * this.size,+this.size]
        };
    }
}

module.exports = UserDao;