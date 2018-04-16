+(function(){
	var login = function(){
		mui.openWindow({
    		url:"../login/login.html",
    		id:"login.html",
    		show:{
		      autoShow:true,//页面loaded事件发生后自动显示，默认为true
		      aniShow:"slide-in-down",//页面显示动画，默认为”slide-in-right“；
		      duration:100//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
		    }
        })
	}
	var getCartData = function(pageSize,pageNum){
		var cookieParam = checkCookie(login);
		$.ajax({
            url:REQUEST_URL+"wxmrest/queryBuyCartList",
            type:"get",
            data:{
				"token":cookieParam.token,
				"mobile":cookieParam.mobile,
				"userId":cookieParam.userId,
				"pageSize":pageSize,
				"pageNum":pageNum
			},
            dataType:"json",
            async:true,
            success:function(data){
                if(data.code == REQUEST_OK){
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
			}
	}
	
	var paramObj = {
		id:"#cart-list",
		fn:getCartData
	}
	
	loadList(paramObj);
	
})()
