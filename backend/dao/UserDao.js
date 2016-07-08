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
            update: 'update user_info set name = ?, login_pwd = ?,md5_key = ?,modify_time = now() where uid = ?',
            updateParam: [this.name, this.login_pwd, this.md5_key, this.uid],
            'delete': 'delete from user_info where uid = ?',
            deleteParam: [this.uid],
            queryById: 'select * from user_info where uid = ?',
            queryByIdParam: [this.uid],
            queryAll: 'select * from user_info limit ?,?',
            queryAllParam: [+this.page * this.size, +this.size],
            countAll: 'select count(1) as total from user_info',
            query: (() => {
                let sql = 'select * from user_info where 1=1',
                    index = +this.page * this.size,
                    size = this.size;
                if (this.uid) sql += ' and uid=' + this.pool.escape(this.uid);
                if (this.name) sql += ' and name=' + this.pool.escape(this.name);
                if (this.login_id) sql += ' and login_id=' + this.pool.escape(this.login_id);
                sql += ' limit ' + this.pool.escape(index) + ',' + this.pool.escape(size);
                return sql;
            })(),
            countQuery: (() => {
                let sql = 'select count(1) as total from user_info where 1=1';
                if (this.uid) sql += ' and uid=' + this.pool.escape(this.uid);
                if (this.name) sql += ' and name=' + this.pool.escape(this.name);
                if (this.login_id) sql += ' and login_id=' + this.pool.escape(this.login_id);
                return sql;
            })(),
            checkLogin:'select * from user_info where login_id = ? and login_pwd = ?',
            checkLoginParam:[this.login_id,this.login_pwd]
        };
    }
    checkLogin(cb){
        let self = this;
        self.pool.getConnection((err, conn) => {
            if(err) throw err;
            conn.query(this.sql.checkLogin,this.sql.checkLoginParam,function(err, rows){
                conn.release();
                if(err) throw err;
                if (rows && rows.length > 0) {
                    cb(rows[0]);
                }else{
                    cb();
                }
            });
        });
    }
}

module.exports = UserDao;