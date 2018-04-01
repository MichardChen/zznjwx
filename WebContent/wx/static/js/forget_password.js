+(function(){
	//提交重新设置密码
	var resetPassword = function(){
		var param = getResetParam();
		if(param.length !=3){
			return;
		}
		$.ajax({
			type:"post",
			url:REQUEST_URL+"wxnonAuthRest/saveForgetPwd",
			async:true,
			data:{
				"code":param[1],
				"userPwd":md5(param[2]),
				"mobile":param[0]
			},
			dataType:'json',
			success:function(data){
				if(data == REQUEST_OK){
					mui.toast(data.message)
				}else{
					mui.toast(data.message)
					$("#register-form .require").each(function () {
						this.value = "";
					})
				}
			}
		});
	}
	//获取重设密码参数
	var getResetParam = function(){
		var flag = checkResetInput();
		var param = [];
		if(flag){
			mui("#forget-password-form .require").each(function () {
				param.push(this.value);
			})
		}
		return param;
	}
	//校验忘记密码输入框
	var checkResetInput = function(){
		var flag = true;
		$("#forget-password-form .require").each(function () {
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
		  	if(this.className.indexOf('reset-msg-code')!=-1){
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
		  	if(this.className.indexOf('reset-password')!= -1){
		  		if(!this.value||$.trim(this.value)==""){
		  			mui.toast("新密码不能为空！")
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
          		url:REQUEST_URL+'wxnonAuthRest/getForgetCheckCode',
          		data:{
          			'mobile':phoneNum
          		},
          		dataType:'json',
          		type:'get',
          		success:function(data){
          			if(data.code == REQUEST_OK){
          				mui.toast(data.message);
          			}else{
          				mui.toast(data.message);
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
	mui('.page-container').on('click','.get-msg',function(){
		getMsgCode();
	})
	mui('.page-container').on('click','.reset-password-btn ',function(){
		resetPassword();
	})
})()
