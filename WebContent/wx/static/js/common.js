//常量定义

var REQUEST_URL = 'http://www.yibuwangluo.cn/zznjwx/';

var REQUEST_OK = 5600;


//复用函数

	//密码设置为显示
	var setPasswordState = function(){
		var flag = $('.triggle-show').attr('data-status');
		if(flag !='noshow'){
			$('.triggle-show').attr('data-status','noshow');
			$('.triggle-show i').removeClass('icon-show');
			$('.triggle-show i').addClass('icon-noshow');
			$('.password-satus').attr('type','password');
		}else{
			$('.triggle-show').attr('data-status','show');
			$('.triggle-show i').removeClass('icon-noshow');
			$('.triggle-show i').addClass('icon-show');
			$('.password-satus').attr('type','text');
		}
	}
	mui('.page-container').on('click','.triggle-show',function(){
	setPasswordState();
	})
	
	function setCookie(cookieObj,exdays){
	    var d = new Date();
	    d.setTime(d.getTime()+(exdays*24*60*60*1000));
	    var expires = "expires="+d.toGMTString();
	    var jsonParam = JSON.stringify(cookieObj);
	    document.cookie = "userData="+jsonParam+";"+expires;
	}
	
	function getCookie(){
		var cookieParam,name = "userData=" ;
	    var ca = document.cookie.split(';');
	    for(var i=0; i<ca.length; i++) {
	        var c = ca[i].trim();
	        if (c.indexOf(name)==0) { cookieParam = c.substring(name.length,c.length);}
	    }
	    return JSON.parse(cookieParam);
	}
	
	function checkCookie(fn,fn1){
	    var user=getCookie("username");
	    if (user!=""){
	        fn();
	    }
	    else {
	        fn1();
	    }
	}
