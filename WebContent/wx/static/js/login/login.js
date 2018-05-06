 //获取注册表单信息
+(function(){
	//提交注册
	var register = function(){
		var param = getRegisterParam();
		if(param.length !=3){
			return;
		}
		var openId = localStorage.openId;
		$.ajax({
			type:"post",
			url:REQUEST_URL+"wxnonAuthRest/register",
			async:true,
			data:{
				"code":param[1],
				"userPwd":md5(param[2]),
				"mobile":param[0],
				"openId":openId
			},
			dataType:'json',
			success:function(data){
				if(data == REQUEST_OK){
					console.log(data);
					mui.toast(data.message);
					mui.back();
				}else{
					console.log(data);
					mui.toast(data.message)
				}
			}
		});
	}
	//获取注册参数
	var getRegisterParam = function(){
		var flag = checkRegisterInput();
		var param = [];
		if(flag){
			mui("#register-form .require").each(function () {
				param.push(this.value);
			})
		}
		return param;
	}
	//校验注册输入框
	var checkRegisterInput = function(){
		var flag = true;
		$("#register-form .require").each(function () {
		  //若当前input为空，则alert提醒		  
		  	if(this.className.indexOf('register-phone')!= -1){
		  		if(!this.value||$.trim(this.value)==""){
		  			mui.toast("手机号码不能为空");
		  			return flag = false;
		  		}else{
		  			var phoneReg=/^[1][3,4,5,7,8][0-9]{9}$/;  
			         if (!phoneReg.test(this.value)) {  
		              mui.toast('请输入正确的手机号码') 
		              return flag = false;
				  	}
			    }
		  	}
		  	if(this.className.indexOf('register-msg-code')!=-1){
		  		if(!this.value||$.trim(this.value)==""){
			  		mui.toast("验证码不能为空")
			  		return flag = false;
		  		}/*else{
		  			var codeReg=/^[0-9]{6}$/;  
			         if (!codeReg.test(this.value)) {  
		              mui.toast('请输入正确的验证码') ;
		              return flag = false;
				  	}			    
		  		}*/
		  	}
		  	if(this.className.indexOf('register-password')!= -1){
		  		if(!this.value||$.trim(this.value)==""){
		  			mui.toast("密码不能为空")
		  			return flag = false;
		  		}
		  		if($.trim(this.value).length < 6){
		  			mui.toast("密码长度不能小于6位")
		  			return flag = false;
		  		}
		  	}		    		  			 
		});
		return flag;
	}
	//获取短信验证码
	var getMsgCode = function(){
		var phoneNum = mui('.register-phone')[0].value;
		if(phoneNum == ""){
			mui.toast('请输入手机号码')
		}else{
		  var phoneReg=/^[1][3,4,5,7,8][0-9]{9}$/;  
          if (!phoneReg.test(phoneNum)) {  
              mui.toast('请输入正确的手机号码') 
          } else {  
          	  phoneNum = encryptMobile(phoneNum);
              $.ajax({
          		url:REQUEST_URL+'wxnonAuthRest/getCheckCode',
          		data:{
          			'mobile':phoneNum
          		},
          		dataType:'json',
          		type:'get',
          		success:function(data){
          			if(data.code == REQUEST_OK){
          				mui.toast(data.message);
          				$(".get-msg").hide();      
          				var second = 60;
              			$(".countdown").html(second);
              			$(".countdown").show();
    					var timer = setInterval(function(){						
    						if(second == 0){
    	          				$(".get-msg").show();
    	          				$(".countdown").hide();
    	          				clearInterval(timer);
    	          				second=60;
    	          			}else{
    	          				second --;	
    							$(".countdown").html(second);
    	          			}
    					},1000)
          			}else{
          				mui.toast(data.message);
          			}
          		}
              })
          }  
		}
	}
	
	//登录部分
	var login = function(){
		var param = getLoginParam();
		if(param.length !=2){
			return;
		}
		var openId = localStorage.openId;
		$.ajax({
			type:"get",
			url:REQUEST_URL+"wxnonAuthRest/login",
			async:true,
			data:{
				"password":md5(param[1]),
				"mobile":param[0],
				"openId":openId
			},
			dataType:'json',
			success:function(data){
				if(data.code == REQUEST_OK){
					setCookie(data.data,10);
					mui.toast(data.message);
					setTimeout(function(){
						//mui.back();
						//没有登陆的情况，重新登陆后，不要返回之前的页面，不然会出现，再返回还是登陆页面，
						//h5跟原生不一样，没有关闭很多关联页面，所以直接重新登陆后，跳转到首页
						 mui.openWindow({
			                	url:INDEX_URL
			                })
					},500)					
				}else{
					mui.toast(data.message);
				}
			}
		});
	}
	
	
	//跳转网址
	var url = function(typeCd){
		$.ajax({
			type:"get",
			url:REQUEST_URL+"wxnonAuthRest/queryDocument",
			async:true,
			data:{
				'typeCd':typeCd
			},
			dataType:'json',
			success:function(data){
				if(data.code == REQUEST_OK){
					mui.openWindow({
				 		url:data.data.url,
				 		id:'documentfile.html'
				 	})
				}else{
					mui.toast(data.message);
				}
			}
		});
	}
	
	var getLoginParam = function(){
		var flag = checkLoginInput();
		var param = [];
		if(flag){
			$("#login-form .require").each(function () {
				param.push(this.value);
			})
		}
		return param;
	}
	var checkLoginInput = function(){
		var flag = true;
		$("#login-form .require").each(function () {
		  //若当前input为空，则alert提醒		  
		  	if(this.className.indexOf('login-phone')!= -1){
		  		if(!this.value||$.trim(this.value)==""){
		  			mui.toast("手机号码不能为空");
		  			return flag = false;
		  		}else{
		  			var phoneReg=/^[1][3,4,5,7,8][0-9]{9}$/;  
			         if (!phoneReg.test(this.value)) {  
		              mui.toast('请输入正确的手机号码') 
		              return flag = false;
				  	}
			    }
		  	}
		  	if(this.className.indexOf('login-password')!= -1){
		  		if(!this.value||$.trim(this.value)==""){
		  			mui.toast("密码不能为空")
		  			return flag = false;
		  		}
		  	}		
		})
		return flag;
	}
	mui('.page-container').on('click','.get-msg',function(){
		getMsgCode();
	})
	mui('.page-container').on('click','.register-btn',function(){
		register();
	})
	mui('.page-container').on('click','.login-btn',function(){
		login();
	})
	mui.plusReady(function() {
		alert('kfdsjfksd')
	})
	mui('.mui-text-row').on('tap','.register-file1',function(){
		url('060009');
	});

	mui('.page-container').on('click','.forget-password',function(){
		mui.openWindow({
			url:'./forget_password.html',			
			id:'forget_password.html',
			show:{
		      autoShow:true,//页面loaded事件发生后自动显示，默认为true
		      aniShow:"slide-in-right",//页面显示动画，默认为”slide-in-right“；
		      duration:100//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
		    }
		})
	})
})()
