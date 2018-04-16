$(function(){
	mui('.mui-table-view').on('tap','.set-password',function(){
		mui.openWindow({
			url:'./set_password.html',
			id:'set_password.html'
		})
	})
	mui('.mui-table-view').on('tap','.feedback',function(){
		mui.openWindow({
			url:'./feedback.html',
			id:'feedback.html'
		})
	})
	
})
