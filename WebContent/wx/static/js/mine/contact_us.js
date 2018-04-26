+(function(){
    //mui初始化
    mui.init();
    //请求获取我的页面数据
    var getPersonalData = function(){
        //获取cookie参数
        var cookieParam = checkCookie();
        $.ajax({
            url:REQUEST_URL+"wxnonAuthRest/contactUs",
            type:"get",
            dataType:"json",
            async:true,
            success:function(data){
                if(data.code == REQUEST_OK){
                    console.log(data);
                    var contact_data = data.data;
                    console.log(contact_data);
                    var icon = '<img src='+contact_data.appLogo+' width=70 height=70>';
                    $(".app-logo").html(icon);
                    $(".phone").html(contact_data.phone);
                    $('.wechat').html(contact_data.wx);
                    $('.email').html("tongji1688@163.com");
                    $('.website').html(contact_data.netUrl);
   					
                }else{
                    mui.toast(data.message);
                }               
            }
        })
    };      
    mui.ready(function(){
        getPersonalData();
    })
})()