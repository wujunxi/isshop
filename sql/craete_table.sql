-- alter table test1 comment '修改后的表的注释';
-- alter table test1 modify column field_name int comment '修改后的字段注释';

-- grant select,insert,update,delete on xx_db.* to user@localhost;
-- show create table user_info;

-- source sql_file_path;
-- show index from user_info;

use isshop_db;
    drop table if exists user_info;
    create table user_info(
    uid int primary key auto_increment comment '用户id',
    name varchar(64) comment '用户名',
    login_id varchar(64) comment '登陆id',
    login_pwd varchar(128) comment '登陆密码',
    md5_key varchar(16) comment 'md5加密key',
    state tinyint(4) default 0 comment '状态 0-未激活 1-有效 2-冻结',
    create_time datetime default now() comment '创建时间',
    modify_time datetime default now() comment '修改时间'
) comment = '用户信息';

create unique index idx_login_id on user_info(login_id); -- 添加 login_id 唯一索引
create index idx_name on user_info(name); -- 添加 name 索引