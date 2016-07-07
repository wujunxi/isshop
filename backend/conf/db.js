// conf/db.js
// MySQL数据库联接配置
module.exports = {
    mysql: {
        //debug:['ComQueryPacket', 'RowDataPacket'],
        debug:['ComQueryPacket'],
        host: '127.0.0.1',
        user: 'wujx',
        password: 'wujx',
        database:'isshop_db',
        port: 3306
    }
};