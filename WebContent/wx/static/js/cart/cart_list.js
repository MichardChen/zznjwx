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
	var getCartData = function(obj){
		var cookieParam = checkCookie(login);
		$.ajax({
            url:REQUEST_URL+"wxmrest/queryBuyCartList",
            type:"get",
            data:{
				"token":cookieParam.token,
				"mobile":cookieParam.mobile,
				"userId":cookieParam.userId,
				"pageSize":obj.pageSize,
				"pageNum":obj.pageNum
			},
            dataType:"json",
            async:true,
            success:function(data){
                if(data.code == REQUEST_OK){
                	cartData = data.data.data;
                	console.log(data);
                	$('.product-num').text("("+data.data.buycartCount+")")
                	createListDom(cartData)
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
			var inputDiv = $('<div class="mui-checkbox mui-left "/>');
			var inputOption = $('<input type="checkbox" class="mui-checkbox mui-input-row product-option" data-id='+data[i].cartId+' data-price='+data[i].price+' data-num='+data[i].quality+'>');
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

	
	//切换列表模式
	var toggleModel = function(){
		mui('.mui-bar-nav').on('tap','.editor',function(){
			$(this).html("完成");
			$(this).removeClass('editor').addClass('complete');
			$('.order').css('display','none');
			$('.delete').css('display','flex');
			$('.mui-table-cell').find('input').prop('checked',false);
			$('.mui-table-view').html('');
			paramObj.fresh = true;
			loadList(paramObj);
		})
		mui('.mui-bar-nav').on('tap','.complete',function(){
			$(this).html("编辑");
			$(this).removeClass('complete').addClass('editor');
			$('.order').css('display','flex');
			$('.delete').css('display','none');
			$('.mui-table-cell').find('input').prop('checked',false);
			$('.mui-table-view').html('');
			paramObj.fresh = true;
			loadList(paramObj);
		})
	}
	
	//全选
	
	var allSelect = function(){
		mui('.cart-bar').on('change','input',function(){
			var flag = this.checked ? true : false;			
			if($('.mui-bar-nav button').hasClass('editor')){
				var price = 0;
				if(flag){
				$('.mui-table-view-cell').each(function(i,n){
					$(n).find('input').prop('checked',true);
					var productPrice = Number($(n).find('input').data('price'));
					var productNum = Number($(n).find('input').data('num'));
					price += productPrice*productNum;
					$('.order-btn').find('button').removeClass('mui-disabled');
					})
				}else{
					$('.mui-table-view-cell').each(function(i,n){
						$(n).find('input').prop('checked',false);
						price = 0;
						$('.order-btn').find('button').addClass('mui-disabled');
					})
				}
				$('.money').html('￥'+price);	
			}else{
				if(flag){
					$('.mui-table-view-cell').each(function(i,n){
					$(n).find('input').prop('checked',true);
					$('.delete-btn').find('button').removeClass('mui-disabled');
					})
				}else{
					$('.mui-table-view-cell').each(function(i,n){
						$(n).find('input').prop('checked',false);
						$('.delete-btn').find('button').addClass('mui-disabled');
					})
				}
			}
					
		})
	}
	
	//选择
	
	
	mui.ready(function(){
		toggleModel();
		allSelect();
	})
	
	
	
	
	
})()
