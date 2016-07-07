"use strict";
let mysql = require('mysql');
let $conf = require('../conf/db');

// 连接池
let pool = mysql.createPool(Object.assign({},$conf.mysql));

class Dao {
    constructor(obj){
        obj = obj || {};
        this.page = obj.page || 0;
        this.size = obj.size || 10;
    }
    insert(cb){
        pool.getConnection((err,conn) => {
            if(err) throw err;
            conn.query(this.sql.insert,this.sql.insertParam,function(err,result){
                if(result && result.affectedRows > 0){
                    cb(result.insertId);
                }
            });
        })
    }
    delete(cb){
        pool.getConnection((err,conn) => {
            if(err) throw err;
            conn.query(this.sql.delete,this.sql.deleteParam,function(err,result){
                if(err) throw err;
                if(result && result.affectedRows > 0){
                    cb();
                }
            });
        })
    }
    update(cb){
        pool.getConnection((err,conn) => {
            if(err) throw err;
            conn.query(this.sql.update,this.sql.updateParam,function(err,result){
                if(err) throw err;
                if(result && result.affectedRows > 0){
                    cb();
                }
            });
        })
    }
    queryById(cb){
        pool.getConnection((err,conn) => {
            if(err) throw err;
            conn.query(this.sql.queryById,this.sql.queryByIdParam,function(err,rows,fields){
                console.log(fields);
                if(err) throw err;
                if(rows && rows.length > 0){
                    cb(rows[0]);
                }else{
                    cb();
                }
            });
        })
    }
    queryAll(cb){
        pool.getConnection((err,conn) => {
            if(err) throw err;
            conn.query(this.sql.queryAll,this.sql.queryAllParam,function(err,rows){
                if(err) throw err;
                if(rows && rows.length > 0){
                    cb(rows);
                }else{
                    cb([]);
                }
            });
        })
    }
    query(cb){
        pool.getConnection((err,conn) => {
            if(err) throw err;

            conn.query(this.sql.queryAll,this.sql.queryAllParam,function(err,rows){
                if(err) throw err;
                if(rows && rows.length > 0){
                    cb(rows);
                }else{
                    cb([]);
                }
            });
        })
    }
}

module.exports = Dao;