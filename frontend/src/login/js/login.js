require(['jquery', 'jquery.md5'], function ($) {

    function getFormObj(selector) {
        var obj = {};
        $(selector).children('[name]').each(function () {
            var $this = $(this),
                k = $this.attr("name");
            obj[k] = $this.val();
        });
        return obj;
    }

    $(function () {
        // 注册
        $("#btnRegisterUser").click(function () {
            var obj = getFormObj("#formRegisterUser");
            obj.login_pwd = $.md5(obj.login_pwd);
            $.ajax({
                url: '/register',
                data: obj,
                dataType: 'json',
                type: "post",
                success: function (result) {
                    console.log(result);
                }
            });
        });
        // 登陆
        $("#btnLogin").click(function () {
            var obj = getFormObj("#formLogin");
            obj.login_pwd = $.md5(obj.login_pwd);
            $.ajax({
                url: '/login',
                data: obj,
                dataType: 'json',
                type: "post",
                success: function (result) {
                    console.log(result);
                }
            });
        });
        // 注销
        $("#btnLogout").click(function () {
            $.get('/logout', function (result) {
                console.log(result);
            });
        });
        // 修改密码
        $("#btnModifyPwd").click(function () {
            var obj = getFormObj("#formModifyPwd");
            obj.login_pwd = $.md5(obj.login_pwd);
            obj.new_login_pwd = $.md5(obj.new_login_pwd);
            $.ajax({
                url: '/users/modify_pwd',
                data: obj,
                dataType: 'json',
                type: "post",
                success: function (result) {
                    console.log(result);
                }
            });
        });
        // 查询用户
        $("#btnQueryUser").click(function () {
            var obj = getFormObj("#formQueryUser");
            $.ajax({
                url: '/users/get',
                data: obj,
                dataType: 'json',
                type: "get",
                success: function (result) {
                    console.log(result);
                    if (result.code == "00") {
                        console.table(result.data.list);
                    }
                }
            });
        });
        // 增加用户
        $("#btnAddUser").click(function () {
            var obj = getFormObj("#formAddUser");
            $.ajax({
                url: '/users/add',
                data: obj,
                dataType: 'json',
                type: "post",
                success: function (result) {
                    console.log(result);
                }
            });
        });
        // 删除用户
        $("#btnDeleteUser").click(function () {
            var obj = getFormObj("#formDeleteUser");
            $.ajax({
                url: '/users/delete',
                data: obj,
                dataType: 'json',
                type: "post",
                success: function (result) {
                    console.log(result);
                }
            });
        });
        // 更新用户
        $("#btnUpdateUser").click(function () {
            var obj = getFormObj("#formUpdateUser");
            $.ajax({
                url: '/users/update',
                data: obj,
                dataType: 'json',
                type: "post",
                success: function (result) {
                    console.log(result);
                }
            });
        });
    });
});