"use strict";
let mysql = require('mysql');
let $conf = require('../conf/db');

// 连接池
let pool = mysql.createPool(Object.assign({},$conf.mysql));

class Dao {
    insert(cb){
        pool.getConnection(function(err,conn){
            conn.query(this.sql.insert,this.sql.insertArray,function(err,result){
                if(result){
                    console.log(result);
                }
            });
        })
    }
}

module.exports = Dao;