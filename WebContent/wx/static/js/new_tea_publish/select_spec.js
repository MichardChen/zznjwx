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
						/*mui.openWindow({
							url:data.data.payInfo.mwebUrl
						})*/
						//
						var appId=data.data.payInfo.appId;
						var timeStamp=data.data.payInfo.timeStamp;
						var nonceStr=data.data.payInfo.nonceStr;
						var prepayId=data.data.payInfo.prepayId;
						var paySign=data.data.payInfo.sign;
						function onBridgeReady(){
							   WeixinJSBridge.invoke(
							       'getBrandWCPayRequest', {
							           "appId":appId,     //公众号名称，由商户传入     
							           "timeStamp":timeStamp,         //时间戳，自1970年以来的秒数     
							           "nonceStr":nonceStr, //随机串     
							           "package":"prepay_id="+prepayId,     
							           "signType":"MD5",         //微信签名方式：     
							           "paySign":paySign //微信签名 
							       },
							       function(res){     
							           if(res.err_msg == "get_brand_wcpay_request:ok" ) {}     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
							       }
							   ); 
							}
							if (typeof WeixinJSBridge == "undefined"){
							   if( document.addEventListener ){
							       document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
							   }else if (document.attachEvent){
							       document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
							       document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
							   }
							}else{
							   onBridgeReady();
							}
					}else{
						mui.toast(data.message)
					}
				},
				error:function(msg){
					console.log(msg);
				}
			})
		})
		
	})
})()
