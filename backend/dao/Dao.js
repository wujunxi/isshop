"use strict";
const ERR_BUSY = '系统繁忙，请稍后再试';

// 连接池
let _pool;

// 域
let fields = {
    page: '页码',
    size: '每页大小'
};

// 校验规则
let rules = {
    page: function () {
        if (!this.page) return `${fields.page}不能为空`;
        if (!/^\d+$/.test(this.page)) return `${fields.page}只能是正整数或0`;
        return true;
    },
    size: function () {
        if (!this.size) return `${fields.size}不能为空`;
        if (!/^\d+$/.test(this.size)) return `${fields.size}只能是正整数`;
        let n = parseInt(this.size);
        if (isNaN(n) || n < 1 || n > 50) return `${fields.size}最小为1，最大为50`;
        return true;
    }
};

class Dao {
    constructor() {
        // 默认页码
        this.page = 0;
        // 默认每页大小
        this.size = 10;
        this.pool = _pool;
    }

    static set pool(p) {
        _pool = p;
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

    /**
     * 子类继承父类字段，相同字段将被子类的覆盖
     * @private
     */
    __extend() {
        Object.assign(this.__fields, fields, this.__fields);
        Object.assign(this.__rules, rules, this.__rules);
    }

    /**
     * 载入obj，只赋值自有字段，不扩展
     * @param obj
     * @private
     */
    __load(obj) {
        if (!obj) return;
        for (let f in this.__fields) {
            if (obj[f]) {
                this[f] = obj[f];
            }
        }
    }

    /**
     * 检查字段
     * 子类要定义字段fields，校验规则rules
     * @param fields
     * @param isNullable 是否允许空
     * @returns {*}
     */
    check(fields, isNullable) {
        let checkFun, result;
        fields = fields || Object.keys(this.__fields);
        for (let f of fields) {
            if (isNullable && !this[f]) {
                continue;
            }
            if (this.__rules.hasOwnProperty(f)) {
                checkFun = this.__rules[f];
                result = checkFun.apply(this);
                if (result !== true) {
                    return result;
                }
            }
        }
        return true;
    }

    /**
     * 转义SQL
     * 将 $xxx 转义为对应的变量
     * 对于用{}括起来的部分，如果其中的 $xxx 有值，则置入，否则去除
     * 保留字符 $_limit 替换为 limit xx,xx
     * @param sqlStr
     * @returns {string|XML}
     */
    parseSql(sqlStr) {
        let self = this;
        let sql = sqlStr.replace('$_limit', function () { // 处理 $_limit
            return 'limit ' + self.pool.escape(+self.page * +self.size) + ',' + self.size;
        }).replace(/\{[^}]+\}/g, function (meta) { // 处理{}
            // 脱括号
            meta = meta.substring(1, meta.length - 1);
            // 检查是否有$xxx变量，有则替换显示，无则返回空字符串
            var k = meta.match(/\$(\w+)/);
            if (k && self[k[1]]) {
                return meta.replace(/\$\w+/, self.pool.escape(self[k[1]]));
            }
            return '';
        }).replace(/\$\w+/g, function (meta) { // 处理$xxx
            // 脱$
            var k = meta.substr(1);
            return self[k] ? self.pool.escape(self[k]) : '\'\'';
        });
        console.log(sqlStr);
        console.log(sql);
        return sql;
    }

    /**
     * 转义计数SQL
     * 将select xxx 语句转换为 select count(1) as total，并去掉尾部的 limit
     * @param sqlStr
     * @returns {string|XML}
     */
    parseCountSql(sqlStr) {
        let sql = 'select count(1) as total' + sqlStr.substr(sqlStr.indexOf(' from '));
        return this.parseSql(sql.replace('$_limit', ''));
    }

    /**
     * 插入数据
     * @param cb
     * @param sql
     */
    insert(cb,sql = this.sql.insert) {
        this.pool.getConnection((err, conn) => {
            if (err) {
                console.error(err);
                cb(ERR_BUSY);
                return;
            }
            conn.query(this.parseSql(sql), function (err, result) {
                conn.release();
                if (err) {
                    console.error(err);
                    cb(ERR_BUSY);
                    return;
                }
                if (result && result.affectedRows > 0) {
                    cb(null, {uid: result.insertId});
                } else {
                    cb('数据提交失败');
                }
            });
        })
    }

    /**
     * 删除数据
     * @param cb
     * @param sql
     */
    delete(cb, sql = this.sql.delete) {
        this.pool.getConnection((err, conn) => {
            if (err) {
                console.error(err);
                cb(ERR_BUSY);
                return;
            }
            conn.query(this.parseSql(sql), function (err, result) {
                conn.release();
                if (err) {
                    console.error(err);
                    cb(ERR_BUSY);
                    return;
                }
                if (result && result.affectedRows > 0) {
                    cb();
                } else {
                    cb('无数据');
                }
            });
        })
    }

    /**
     * 更新数据
     * @param cb 回调，成功返回
     * @param sql
     */
    update(cb, sql = this.sql.update) {
        this.pool.getConnection((err, conn) => {
            if (err) {
                console.error(err);
                cb(ERR_BUSY);
                return;
            }
            conn.query(this.parseSql(sql), function (err, result) {
                conn.release();
                if (err) {
                    console.error(err);
                    cb(ERR_BUSY);
                    return;
                }
                if (result && result.affectedRows > 0) {
                    cb();
                } else {
                    cb('数据更新失败');
                }
            });
        })
    }

    /**
     * 条件查询
     * 非空字段作为查询条件，支持分页
     * @param cb
     * @param sql
     */
    query(cb, sql = this.sql.query) {
        let self = this;
        self.pool.getConnection((err, conn) => {
            if (err) {
                console.error(err);
                cb(ERR_BUSY);
                return;
            }
            // 查询记录条数
            conn.query(self.parseCountSql(sql), function (err, rows) {
                if (err) {
                    conn.release();
                    console.error(err);
                    cb(ERR_BUSY);
                    return;
                }
                let total = 0;
                if (rows && rows.length > 0 && rows[0].total) {
                    total = rows[0].total;
                }
                // 如果记录条数为0，不做列表查询
                if (total == 0) {
                    conn.release();
                    cb(null, [], total);
                    return;
                }
                // 查询数据
                conn.query(self.parseSql(sql), function (err, rows) {
                    conn.release();
                    if (err) {
                        console.error(err);
                        cb(ERR_BUSY);
                        return;
                    }
                    if (rows && rows.length > 0) {
                        cb(null, rows, total);
                    } else {
                        cb(null, [], total);
                    }
                });
            });
        })
    }
}

module.exports = Dao;