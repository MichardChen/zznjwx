+(function(){
	
	var modifyPassword = function(oldPwd,newPwd){
		var cookieParam = getCookie();
		$.ajax({
			type:"post",
			url:REQUEST_URL+"wxmrest/modifyPwd",
			async:true,
			data:{
				"token":cookieParam.token,
				"mobile":cookieParam.mobile,
				"userId":cookieParam.userId,
				"oldPwd":md5(oldPwd),
				"newPwd":md5(newPwd)
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
	
	var checkPassword = function(){
		var oldPwd = $('.old-password').val();
		var newPwd  = $('.new-password').val();
		var flag = true;
		if(oldPwd == ""){
			mui.toast("请输入旧密码");
			return flag = false;
		}
		if(newPwd == ""){
			mui.toast("请输入新密码");
			return flag = false;
		}
		if(newPwd.length<6){
			mui.toast("新密码的长度不得少于6位");
			return flag = false;
		}
		var passwordReg = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,20}$/;
		
		if(flag){
			modifyPassword(oldPwd,newPwd);
		}		
	}
			
	mui('.mui-button-row').on('tap','.mui-btn',function(){
		checkPassword();		
	})
	
})()
