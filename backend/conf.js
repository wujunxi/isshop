"use strict";
let _env = 'dev';
let mysql = {},
    session = {},
    log = {};

// 日志打印配置 combined/common/dev/short
log.default =
log.dev = 'dev';
log.test = 'combined';

// MySQL数据库联接配置
mysql.default =
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
session.default =
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
    loginErrorLimit:3, // 登录错误次数限制
    set env(v){
        let envs = ['dev','pro','test'];
        if(envs.indexOf(v) != -1){
            _env = v;
        }
    },
    get mysql(){
        return mysql[_env] || mysql['default'];
    },
    get session(){
        return session[_env] || mysql['default'];
    },
    get log(){
        return log[_env] || log['default'];
    }
};