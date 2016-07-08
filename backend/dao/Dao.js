"use strict";
let mysql = require('mysql');
let $conf = require('../conf/db');

// 连接池
let pool = mysql.createPool(Object.assign({}, $conf.mysql));

class Dao {
    constructor(obj) {
        obj = obj || {};
        this.page = obj.page || 0;
        this.size = obj.size || 10;
        this.pool = pool;
    }

    insert(cb) {
        this.pool.getConnection((err, conn) => {
            if (err) throw err;
            conn.query(this.sql.insert, this.sql.insertParam, function (err, result) {
                if (result && result.affectedRows > 0) {
                    cb(result.insertId);
                }
            });
        })
    }

    delete(cb) {
        this.pool.getConnection((err, conn) => {
            if (err) throw err;
            conn.query(this.sql.delete, this.sql.deleteParam, function (err, result) {
                if (err) throw err;
                if (result && result.affectedRows > 0) {
                    cb();
                }
            });
        })
    }

    update(cb) {
        this.pool.getConnection((err, conn) => {
            if (err) throw err;
            conn.query(this.sql.update, this.sql.updateParam, function (err, result) {
                if (err) throw err;
                if (result && result.affectedRows > 0) {
                    cb();
                }
            });
        })
    }

    queryById(cb) {
        this.pool.getConnection((err, conn) => {
            if (err) throw err;
            conn.query(this.sql.queryById, this.sql.queryByIdParam, function (err, rows) {
                conn.release();
                if (err) {
                    throw err;
                }
                if (rows && rows.length > 0) {
                    cb(rows[0]);
                } else {
                    cb();
                }
            });
        })
    }

    queryAll(cb) {
        var self = this;
        self.pool.getConnection((err, conn) => {
            if (err) throw err;
            // 查询记录条数
            conn.query(self.sql.countAll, function (err, rows) {
                if (err) {
                    conn.release();
                    throw err;
                }
                let total = 0;
                if (rows && rows.length > 0 && rows[0].total) {
                    total = rows[0].total;
                }
                // 查询数据
                conn.query(self.sql.queryAll, self.sql.queryAllParam, function (err, rows) {
                    conn.release();
                    if (err) throw err;
                    if (rows && rows.length > 0) {
                        cb(rows, total);
                    } else {
                        cb([], total);
                    }
                });
            });
        })
    }

    query(cb) {
        let self = this;
        self.pool.getConnection((err, conn) => {
            if (err) throw err;
            // 查询记录条数
            conn.query(self.sql.countQuery, function (err, rows) {
                if (err) {
                    conn.release();
                    throw err;
                }
                let total = 0;
                if (rows && rows.length > 0 && rows[0].total) {
                    total = rows[0].total;
                }
                // 查询数据
                conn.query(self.sql.query, function (err, rows) {
                    conn.release();
                    if (err) throw err;
                    if (rows && rows.length > 0) {
                        cb(rows,total);
                    } else {
                        cb([],total);
                    }
                });
            });
        })
    }
}

module.exports = Dao;