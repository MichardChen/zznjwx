+(function(){
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
            storeHtml = '<div class="buytea-record" data-id=120001>'
                      + '<a><i class="icon-record"></i>买茶记录</a>'
                      + '</div>'
                      + '<div class="gettea-record" data-id=120004>'
                      + '<a><i class="icon-time"></i>取茶记录</a>'
                      + '</div>';
            $('.bottom-part').html(storeHtml);
        }else{
            storeHtml = '<div class="vip-manage">'
                      + '<a><i class="icon-members"></i>会员管理</a>'
                      + '</div>'
                      + '<div class="store-manage">'
                      + '<a><i class="icon-store-manage"></i>店铺管理</a>'
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
                }               
            }
        })
    };
       
    mui.ready(function(){
        getPersonalData();

        mui(".mine-list").on("tap",".my-acount",function(){
            appAlert()
        })

        mui(".mine-list").on("tap",".my-card",function(){
            appAlert()
        })

        mui(".mine-list").on("tap",".invoice",function(){
          appAlert()
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
		mui(".mine-list").on("tap",".contact",function(){
            mui.openWindow({
        		url:"./subpages/contact_us.html",
        		id:"contact_us.html"
        	})
        })
		mui(".mine-list").on("tap",".my-bill",function(){
           mui.openWindow({
           	  url:"../bill/bill_list.html",
           	  id:"bill_list.html"
           })
        })
		mui(".mine-list").on("tap",".contact",function(){
           mui.openWindow({
           	  url:"./subpages/contact_us.html",
           	  id:"contact_us.html"
           })
        })
		mui(".mine-list").on("tap",".my-store",function(){
           mui.openWindow({
           	  url:"../store/store_desc.html",
           	  id:"stores_desc.html"
           })
        })
		
		mui(".header-card").on("tap",".vip-manage",function(){
            appAlert()
        })
		mui(".header-card").on("tap",".store-manage",function(){
           appAlert()
        })
		mui(".header-card").on("tap",".buytea-record",function(){
		   var billType = $(this).data("id");
           mui.openWindow({
           	  url:"../bill/bill_list.html?"+billType,
           	  id:"bill_list.html"
           })
        })
		mui(".header-card").on("tap",".gettea-record",function(){
		   var billType = $(this).data("id");
           mui.openWindow({
           	  url:"../bill/bill_list.html?"+billType,
           	  id:"bill_list.html"
           })
        })
		
		mui(".mine-list").on("tap",".share",function(){
           mui.openWindow({
           	  url:"http://www.yibuwangluo.cn/zznjwx/h5/download.jsp"
           })
        })
		
    })
})()