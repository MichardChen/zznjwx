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
					setTimeout(function(){
						noLoginHandle();
					}, 2000);
				}
			},
			error:function(msg){
				console.log(msg);
			}
		})
	}
	
	mui('.desc-btn').on('tap','.mui-pull-right',function(){
		$.ajax({
			type:"get",
			url:REQUEST_URL+"wxnonAuthRest/queryDocument",
			async:true,
			data:{
				'typeCd':'060006'
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
	});
	
	var createDom = function(data){
		$('.tea-img').html('<img src="'+data.img+'" width=100 height=55>')
		var html = '<div class="tea-name"><p>'+data.name+'</p><p class="tea-price mui-pull-right">￥'+data.price+'</p></div>'
				 + '<div class="tea-tags"><span class="tag">'+data.wareHouse+'</span><span class="tag">'+data.type+'</span><span class="mui-pull-right">1'+data.size+'</span></div>'
		$('.tea-text').html(html);
		$('.tea-size').html(data.size);
		$(".mui-table-view-cell").attr("data-teaid",data.id);
	}
	
	mui.ready(function(){
		getSpecData();
		
		mui(".buy-bar").on("tap",".add-cart",function(){
			var teaId = $('.mui-table-view-cell').data("teaid");
			var teaNum = $(".mui-input-numbox").val();
			if(teaNum == 0){
				return;
			}
			var cookieParam = getCookie();
			$.ajax({
				url:REQUEST_URL+"wxmrest/addBuyCart",
				type:"get",
				dataType:"json",
				async:true,
				data:{
					"token":cookieParam.token,
					"mobile":cookieParam.mobile,
					"userId":cookieParam.userId,
					"teaId":teaId,
					"quality":teaNum
				},
				success:function(data){
					if(data.code == REQUEST_OK){
						mui.toast(data.message)
					}else{
						mui.toast(data.message)
						setTimeout(function(){
							noLoginHandle();
						}, 2000);
					}
				},
				error:function(msg){
					console.log(msg);
				}
			})
		})
		
		mui(".buy-bar").on("tap",".buy-btn",function(){
			var teaId = $('.mui-table-view-cell').data("teaid");
			var teaNum = $(".mui-input-numbox").val();
			if(teaNum == 0){
				return;
			}
			var cookieParam = getCookie();
			$.ajax({
				url:REQUEST_URL+"wxmrest/getOrderPrePayInfo",
				type:"get",
				dataType:"json",
				async:true,
				data:{
					"token":cookieParam.token,
					"mobile":cookieParam.mobile,
					"userId":cookieParam.userId,
					"teaId":teaId,
					"quality":teaNum
				},
				success:function(data){
					if(data.code == REQUEST_OK){
						mui.toast(data.message)
						mui.openWindow({
							url:data.data.payInfo.mwebUrl
						})
					}else{
						mui.toast(data.message)
						setTimeout(function(){
							noLoginHandle();
						}, 2000);
					}
				},
				error:function(msg){
					console.log(msg);
				}
			})
		})
		
	})
})()
