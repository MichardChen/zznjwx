+(function(){
	
	var getCartData = function(){
		var cookieParam = getCookie();
		var cartId = document.location.href.substring(document.location.href.indexOf("?")+1);
		$.ajax({
            url:REQUEST_URL+"wxmrest/queryAddOrderList",
			type:"get",
			data:{
				"token":cookieParam.token,
				"mobile":cookieParam.mobile,
				"userId":cookieParam.userId,
				"buyCartIds":cartId
			},
            dataType:"json",
            async:true,
            success:function(data){
                if(data.code == REQUEST_OK){
                	console.log(data);
                	cartData = data.data.data;
                	createListDom(cartData);
                }else{               	
                    mui.toast(data.message);
                    login();
                }               
            }
        })
	}
	
	var createListDom = function(data){
		var table = $('.mui-table-view');
		var totalprice = 0;
		for (var i = 0; i < data.length; i++) {
			var li = $('<li class="mui-table-view-cell"/>')
			var topDiv = $('<div class="top-part"/>');
			var imgdiv= $('<div class="product-img"/>');
			var productImg = $('<img width=100 height=60>').attr('src',data[i].img);
			imgdiv.html(productImg);
			var productContent = $('<div class="product-content"/>');
			var productName = $('<div class="product-name"/>');
			var productPrice = $('<div class="product-price"/>');
			var name = '<p class="name">'+data[i].name+'</p><p class="product-label mui-pull-right"><span>'+data[i].warehouse+'</span><span>'+data[i].type+'</span></p>' 
			var price = '<p class="price">'+data[i].price+'/'+data[i].size+'</p><p class="product-num mui-pull-right">X'+data[i].quality+'</p>';
			productName.html(name);
			productPrice.html(price);
			productContent.append(productName);
			productContent.append(productPrice);
			topDiv.append(productImg);
			topDiv.append(productContent);
			var bottomDiv = $('<div class="bottom-part mui-clearfix"/>');
			var inputDiv = $('<div class="total-money"/>');
			var inputOption = $('<span class="mui-pull-right">合计：￥'+data[i].price*data[i].quality+'</span>');
			inputDiv.html(inputOption);
			bottomDiv.html(inputDiv);
			li.append(topDiv);
			li.append(bottomDiv);			
			table.append(li);
			totalprice += data[i].price*data[i].quality
		}
		$(".money").html("￥"+totalprice);
		
	}

	mui(".place-order-bar").on("tap",".buy-btn",function(){
		var teaId = $('.mui-table-view-cell').data("teaid");
		var cookieParam = getCookie();
		$.ajax({
			url:REQUEST_URL+"wxmrest/getBuyCartPrePayInfo",
			type:"get",
			dataType:"json",
			async:true,
			data:{
				"token":cookieParam.token,
				"mobile":cookieParam.mobile,
				"userId":cookieParam.userId,
				"teas":teaId,
			},
			success:function(data){
				if(data.code == REQUEST_OK){
					mui.toast(data.message)
					mui.openWindow({
						url:data.data.payInfo.mwebUrl
					})
				}else{
					mui.toast(data.message)
				}
			},
			error:function(msg){
				console.log(msg);
			}
		})
	})

	mui.ready(function(){
		getCartData();
	})

})()
