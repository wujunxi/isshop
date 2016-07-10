require(['jquery','jquery.md5'],function($){
    $(function(){
        $("#btnLogin").click(function(){
            $.ajax({
                url:'/login',
                data:{
                    login_id:$("#tbID").val(),
                    login_pwd:$.md5($("#tbPwd").val())
                },
                dataType:'json',
                type:"post",
                success:function(result){
                    console.log(result);
                }
            });
        });
        $("#btnLogout").click(function(){
            $.get('/logout',function(result){
                console.log(result);
            });
        });
        $("#btnQuery").click(function(){
            $.ajax({
                url:'/users/get',
                data:{
                    uid:$("#tbUid").val(),
                    login_id:$("#tbLoginID").val(),
                    name:$("#tbName").val()
                },
                dataType:'json',
                type:"get",
                success:function(result){
                    console.log(result);
                    if(result.code == "00"){
                        console.table(result.data.list);
                    }
                }
            });
        });
        $("#btnAddUser").click(function(){
            var obj = {};
            $("#divAddUser").children('[name]').each(function(){
                var $this = $(this),
                    k = $this.attr("name");
                obj[k] = $this.val();
            });
            $.ajax({
                url:'/users/add',
                data:obj,
                dataType:'json',
                type:"post",
                success:function(result){
                    console.log(result);
                }
            });
        });
    });
});