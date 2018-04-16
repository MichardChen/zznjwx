+(function(){
	
	var login = function(){
		mui.openWindow({
    		url:"../login/login.html",
    		id:"login.html",
    		show:{
		      autoShow:true,//页面loaded事件发生后自动显示，默认为true
		      aniShow:"slide-in-down",//页面显示动画，默认为”slide-in-right“；
		      duration:100//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
		    }
        })
	}
    //mui初始化
    mui.init();
     //数据回填

    var filledPersonalData = function(data){
        var nickname = data.nickName;
        var mobile = data.mobile;
        var imgUrl = data.icon;
        var QQ = data.qqNo;
        var WX = data.wxNo;
        var Sex = data.sex;
        var storeFlg = data.storeFlg;
        var portrait = $('<img width=55 height=55>');
        portrait.attr('src',imgUrl);
        $('.Head-portrait').html(portrait);
        $('.name p').text(nickname);
        var storeHtml;
        if(storeFlg == 0){
            storeHtml = '<div class="buytea-record">'
                      + '<a href=""><i class="icon-record"></i>买茶记录</a>'
                      + '</div>'
                      + '<div class="gettea-record">'
                      + '<a href=""><i class="icon-time"></i>取茶记录</a>'
                      + '</div>';
            $('.bottom-part').html(storeHtml);
        }else{
            storeHtml = '<div class="vip-manage">'
                      + '<a href=""><i class="icon-members"></i>会员管理</a>'
                      + '</div>'
                      + '<div class="store-manage">'
                      + '<a href=""><i class="icon-store-manage"></i>店铺管理</a>'
                      + '</div>';
            $('.bottom-part').html(storeHtml);
        }
    }

    //请求获取我的页面数据
    var getPersonalData = function(){
        //获取cookie参数
        var cookieParam = checkCookie();
        $.ajax({
            url:REQUEST_URL+"wxmrest/queryPersonData",
            type:"get",
            data:{
				"token":cookieParam.token,
				"mobile":cookieParam.mobile,
				"userId":cookieParam.userId,
			},
            dataType:"json",
            async:true,
            success:function(data){
                if(data.code == REQUEST_OK){
                    console.log(data);
                    var personal_data = data.data.member;
                    filledPersonalData(personal_data);    
                }else{
                    mui.toast(data.message);
                    login();
                }               
            }
        })
    };
       
    mui.ready(function(){
        getPersonalData();

        mui(".mine-list").on("tap",".my-acount",function(){
            mui.toast("下载客户端app，查看账户！")
        })

        mui(".mine-list").on("tap",".my-card",function(){
            mui.toast("下载客户端app，查看账户！")
        })

        mui(".mine-list").on("tap",".invoice",function(){
            mui.toast("下载客户端app，查看账户！")
        })
        mui('.header-card').on('tap','.modify',function(){
        	mui.openWindow({
        		url:"./personal_information.html",
        		id:"personal_information.html"
        	})
        })
		mui('.header-card').on('tap','.icon-setter',function(){
        	mui.openWindow({
        		url:"./subpages/setter.html",
        		id:"setter.html.html"
        	})
        })
		mui(".mine-list").on("tap",".help",function(){
            mui.openWindow({
        		url:"./subpages/useful_help.html",
        		id:"useful_help.html"
        	})
        })
		mui(".mine-list").on("tap",".contract",function(){
            mui.openWindow({
        		url:"./subpages/platform_rules.html",
        		id:"platform_rules.html"
        	})
        })
    })
})()