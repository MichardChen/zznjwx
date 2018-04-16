$(function(){
	mui(".mui-table-view").on("tap",'.set-login-password',function(){
		mui.openWindow({
			url:'./set_loginpassword.html',
			id:'set_loginpassword.html'
		})
	})
})
