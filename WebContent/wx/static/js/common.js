//常量定义

//var REQUEST_URL = 'http://www.yibuwangluo.cn/zznjwx/';
var REQUEST_URL = 'http://192.168.2.164:8080/zznjwx/';

var REQUEST_OK = 5600;


//复用函数

+(function(){
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
	
	
})()
