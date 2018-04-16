+(function(){
	var getSpecData = function(){
		var teaId = document.location.href.substring(document.location.href.indexOf("?")+1);
		var cookieParam = getCookie();
		$.ajax({
			url:REQUEST_URL+"wxmrest/queryTeaSize",
			type:"get",
			dataType:"json",
			async:true,
			data:{
				"token":cookieParam.token,
				"mobile":cookieParam.mobile,
				"userId":cookieParam.userId,
				"teaId":teaId
			},
			success:function(data){
				if(data.code == REQUEST_OK){
					var teaDescData = data.data.tea;
					console.log(teaDescData);
					createDom(teaDescData)

				}else{
					mui.toast(data.message)
				}
			},
			error:function(msg){
				console.log(msg);
			}
		})
	}
	
	var createDom = function(data){
		$('.tea-img').html('<img src="'+data.img+'" width=100 height=55>')
		var html = '<div class="tea-name"><p>'+data.name+'</p><p class="tea-price mui-pull-right">￥'+data.price+'</p></div>'
				 + '<div class="tea-tags"><span class="tag">'+data.wareHouse+'</span><span class="tag">'+data.type+'</span><span class="mui-pull-right">1'+data.size+'</span></div>'
		$('.tea-text').html(html);
		$('.tea-size').html(data.size);
	}
	
	mui.ready(function(){
		getSpecData();
	})
})()
