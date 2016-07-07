"use strict";
let Dao = require('./Dao');
class UserDao extends Dao{
    constructor(name,login_id,login_pwd,md5_key){
        this.name = name;
        this.login_id = login_id;
        this.login_pwd = login_pwd;
        this.md5_key = md5_key;
    }
    get sql(){
        return {
            insert:'insert into user_info (name,login_id,login_pwd,md5_key)values(?,?,?,?)',
            insertArray:[this.name,this.login_id,this.login_pwd,this.md5_key],
            update:'update user_info set name = ?, login_id = ?,login_pwd = ?,md5_key = ?,modify_time = now() where uid = ?',
            'delete':'delete from user_info where uid = ?',
            queryById:'select * from user_info where uid = ?',
            queryAll:'select * from user_info'
        };
    }
}

module.exports = UserDao;