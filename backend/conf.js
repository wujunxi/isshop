"use strict";
let _env = 'dev';
let mysql = {},session = {};

// MySQL数据库联接配置
mysql.dev = {
    //debug:['ComQueryPacket', 'RowDataPacket'],
    debug: ['ComQueryPacket'],
    host: '127.0.0.1',
    user: 'wujx',
    password: 'wujx',
    database: 'isshop_db',
    port: 3306
};
mysql.test = {
    //debug:['ComQueryPacket', 'RowDataPacket'],
    debug: ['ComQueryPacket'],
    host: '127.0.0.1',
    user: 'isshop_oper',
    password: 'Isshop_oper123',
    database: 'isshop_db',
    port: 3306
};

// session 配置
session.dev =
session.test = {
    key: 'sessionID',
    secret: 'isshop',
    cookie: {maxAge: 1800000}, // 30 minutes = 1000 * 60 * 30
    resave: true,
    saveUninitialized: false
};

// 配置文件
module.exports = {
    set env(v){
        let envs = ['dev','pro','test'];
        if(envs.indexOf(v) != -1){
            _env = v;
        }
    },
    get mysql(){
        return mysql[_env];
    },
    get session(){
        return session[_env];
    }
};