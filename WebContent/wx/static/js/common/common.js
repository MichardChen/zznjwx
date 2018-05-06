//常量定义

var REQUEST_URL = 'http://www.yibuwangluo.cn/zznjwx/';
var LOGIN_URL = "http://www.yibuwangluo.cn/zznjwx/wx/pages/login/login.html";
var INDEX_URL = "http://www.yibuwangluo.cn/zznjwx/wx/index.html";
//var REQUEST_URL = 'http://192.168.1.91:8088/zznjwx/';
//var LOGIN_URL = "http://192.168.0.102:8080/pages/login/login.html";
//var INDEX_URL = "http://192.168.0.102:8080/index.html";

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
	    d.setTime(d.getTime()+(exdays*60*60*1000));
	    var expires = "expires="+d.toGMTString();
	    var jsonParam = JSON.stringify(cookieObj);
	    document.cookie = "userData="+jsonParam+";"+expires+";path=/";
	}
	
	function getCookie(){
		var cookieParam,name = "userData=" ;
	    var ca = document.cookie.split(';');
	    for(var i=0; i<ca.length; i++) {
	        var c = ca[i].trim();
	        if (c.indexOf(name)==0) { cookieParam = c.substring(name.length,c.length);}
	    }
	    return cookieParam == undefined ? "" : JSON.parse(cookieParam);
	}
	
	function checkCookie(fn){
	    var cookie = document.cookie
	    if (cookie!=""){
	       return getCookie();
	    }
	    else {
			fn();
	    }
	}
	
	 function delAllCookie(){    
          setCookie("",-1);
      } 


	function appAlert(){
		var btnArray = ['取消', '确定'];
        mui.confirm('请下载掌上茶宝APP进行操作', '', btnArray, function(e) {
            if (e.index == 1) {
                mui.openWindow({
                	url:'http://a.app.qq.com/o/simple.jsp?pkgname=com.tea.tongji'
                })
            }
        })
	}
	
	function noLoginHandle(){
        mui.openWindow({
        	url:LOGIN_URL
        })
	}
	
	var old_back = mui.back;
	mui.back = function(){	
		document.location.reload()
		mui.openWindow({
			url:document.referrer
		})
		setTimeout(function(){
			 old_back(); 
		},500)	    	
	}
	
	function setLocalStorage(arg){
		if (typeof(Storage) !== "undefined") {
		    // Store
		    localStorage.remind = arg;
		} else {
		    mui.alert('浏览器不支持localStorage')
		}
	}
	
	function setLocalOpenId(params){
		if (typeof(Storage) !== "undefined") {
		    // Store
		    localStorage.openId = params;
		} else {
		    mui.alert('浏览器不支持localStorage')
		}
	}
