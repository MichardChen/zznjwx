+(function(){
	mui.init();
	var getData = function(){
		$.ajax({
			url:"",
			type:"get",
			dataType:"json",
			data:{},
			success:function(data){
				if(data.code == REQUEST_OK){
					
				}else{
					mui.toast(data.message);
				}
			}
		})
	}
	var fillData = function(data){
		
	}
	mui(".mui-content").on('tap','.modify-Head-portrait',function(){
		mui.alert("调用摄像头接口")
	})
	mui(".mui-content").on('tap','.modify-genter',function(){
		mui('.mui-popover').popover('toggle',document.getElementById("openPopover"));
	})
	mui(".mui-content").on('tap','.modify-Head-portrait',function(){
		mui.alert("调用摄像头接口")
	})
	mui(".mui-content").on('tap','.modify-Head-portrait',function(){
		mui.alert("调用摄像头接口")
	})
	mui(".mui-content").on('tap','.modify-Head-portrait',function(){
		mui.alert("调用摄像头接口")
	})
	mui(".mui-content").on('tap','.modify-Head-portrait',function(){
		mui.alert("调用摄像头接口")
	})
	
})()
