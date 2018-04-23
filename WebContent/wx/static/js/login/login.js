 //获取注册表单信息
+(function(){
	//提交注册
	var register = function(){
		var param = getRegisterParam();
		if(param.length !=3){
			return;
		}
		$.ajax({
			type:"post",
			url:REQUEST_URL+"wxnonAuthRest/register",
			async:true,
			data:{
				"code":param[1],
				"userPwd":md5(param[2]),
				"mobile":param[0]
			},
			dataType:'json',
			success:function(data){
				if(data == QEQUEST_OK){
					console.log(data);
					mui.toast("注册成功！")
					mui.back();
				}else{
					mui.toast("注册失败，请核对信息重新注册！")
					$("#register-form .require").each(function () {
						this.value = "";
					})
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
		  			mui.toast("手机号码不能为空！");
		  			return flag = false;
		  		}else{
		  			var phoneReg=/^[1][3,4,5,7,8][0-9]{9}$/;  
			         if (!phoneReg.test(this.value)) {  
		              mui.toast('请输入正确的手机号码！') 
		              return flag = false;
				  	}
			    }
		  	}
		  	if(this.className.indexOf('register-msg-code')!=-1){
		  		if(!this.value||$.trim(this.value)==""){
			  		mui.toast("验证码不能为空！")
			  		return flag = false;
		  		}else{
		  			var codeReg=/^[0-9]{6}$/;  
			         if (!codeReg.test(this.value)) {  
		              mui.toast('请输入正确的验证码！') ;
		              return flag = false;
				  	}			    
		  		}
		  	}
		  	if(this.className.indexOf('register-password')!= -1){
		  		if(!this.value||$.trim(this.value)==""){
		  			mui.toast("密码不能为空！")
		  			return flag = false;
		  		}else{
		  			var passwordReg = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,20}$/;
		  			if (!passwordReg.test(this.value)) {  
		              mui.toast('请输入正确的密码格式！') ;
		              return flag = false;
				  	}
		  		}
		  	}		    		  			 
		});
		return flag;
	}
	//获取短信验证码
	var getMsgCode = function(){
		var phoneNum = mui('.register-phone')[0].value;
		if(phoneNum == ""){
			mui.toast('请输入手机号码！')
		}else{
		  var phoneReg=/^[1][3,4,5,7,8][0-9]{9}$/;  
          if (!phoneReg.test(phoneNum)) {  
              mui.toast('请输入正确的手机号码！') 
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
          			}else{
          				mui.toast('短信已发送，请注意查看信息！');
          			}
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
		$.ajax({
			type:"get",
			url:REQUEST_URL+"wxnonAuthRest/login",
			async:true,
			data:{
				"password":md5(param[1]),
				"mobile":param[0]
			},
			dataType:'json',
			success:function(data){
				if(data.code == REQUEST_OK){
					setCookie(data.data,10);
					mui.toast("登录成功！")
					setTimeout(function(){
						mui.back();
					},500)					
				}else{
					mui.toast("账号密码错误，请重新输入！")
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
		  			mui.toast("手机号码不能为空！");
		  			return flag = false;
		  		}else{
		  			var phoneReg=/^[1][3,4,5,7,8][0-9]{9}$/;  
			         if (!phoneReg.test(this.value)) {  
		              mui.toast('请输入正确的手机号码！') 
		              return flag = false;
				  	}
			    }
		  	}
		  	if(this.className.indexOf('login-password')!= -1){
		  		if(!this.value||$.trim(this.value)==""){
		  			mui.toast("密码不能为空！")
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
