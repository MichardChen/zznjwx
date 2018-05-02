+(function(){
    //mui初始化
    mui.init({
    	subpages:[{
    		url:"./pages/index/subindex.html",
    		id:'subindex.html',
    		styles:{
		        bottom: '51px'
		      }
    	}]
    });        

    function GetQueryString(name){
         var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");  //寻找&+url参数名=参数值+&.&可以不存在
         var r = window.location.search.substr(1).match(reg);
         if(r!=null)return  unescape(r[2]); return null;
    }
    mui.ready(function(){
    	var code = GetQueryString('code');
    	if((code != '')&&(localStorage.openId == null || localStorage.openId == '')){
        	//获取code，传给后端，请求微信接口，获取用户基本信息，传给前端
        	$.ajax({
    			url:REQUEST_URL+"wxnonAuthRest/redirectAuth",
    			type:"get",
    			dataType:"json",
    			async:true,
    			data:{
    				"code":code
    			},
    			success:function(data){
    				if(data.code == REQUEST_OK){
    					var openid= data.data;
    					setLocalOpenId(openid);
    				}
    			},
    			error:function(msg){
    				console.log(msg);
    			}
    		})
    		
    	}
    	
		
    	mui('.mui-bar-tab').on('tap', 'a', function(e) {	
    		if($(this).hasClass('default-index')){
    			toggleTap(this);
    		}else{
    			toggleTap(this);
				checkCookie(login); 
    		}    		              		
        })
    	
    	var url = $('.mui-iframe-wrapper').find('iframe').attr('src')
    	
    	$('.mui-bar-tab').find('a').each(function(i,n){
    		var aUrl = $(n).attr('href');
    		if(url == aUrl){
    			$('.mui-bar-tab a').removeClass('mui-active');
    			$(n).addClass("mui-active");
    		}
    	})
    	
    });
   
	var login = function(){
		mui.openWindow({
    		url:"./pages/login/login.html",
    		id:"login.html",
    		show:{
		      autoShow:true,//页面loaded事件发生后自动显示，默认为true
		      aniShow:"slide-in-down",//页面显示动画，默认为”slide-in-right“；
		      duration:100//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
		    }
        })
	}
	var toggleTap = function(targetUrl){
		$('.mui-iframe-wrapper').find('iframe').attr('src',targetUrl);
		
	}
	
})()