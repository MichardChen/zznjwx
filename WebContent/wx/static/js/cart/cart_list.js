+(function(){
	
	//初始化mui
	mui.init({
		pullRefresh: {
			container: "#cart-list",
			down: {
				contentdown : "下拉可以刷新",
      			contentover : "释放立即刷新",
      			contentrefresh : "正在刷新...",
				callback: pulldownRefresh
			},
			up: {
				contentrefresh: '正在加载...',
				callback: pullupRefresh
			}
		}
	});
	
	var pageSize = 10;
	var pageNum =1;
	
	function pulldownRefresh() {
		setTimeout(function() {	
			pageNum = 1;
			$('.mui-table-view').html("");			
			getCartData(pageSize,pageNum);			
			mui("#cart-list").pullRefresh().endPulldownToRefresh(); //refresh completed
			pageNum++;
		}, 500);
	}
	
	/**
	 * 上拉加载具体业务实现
	 */
	function pullupRefresh(name) {
		setTimeout(function() {	
		mui("#cart-list").pullRefresh().endPullupToRefresh(); //参数为true代表没有更多数据了。
		getCartData(pageSize,pageNum);
		pageNum++;		
		}, 500);
	}
	mui.ready(function(){
		mui("#cart-list").pullRefresh().pullupLoading();
	})		
	
	
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
                	console.log(data);
                	if(pageNum == 1 && cartData.length == 0){
                		 $('#cart-list').hide();
                		 $(".cart-bar").hide();
                		 $('.editor').hide();
                		 $('.default-page').show();
                	}else{
                		$('.product-num').text("("+data.data.buycartCount+")")
                		$('#cart-list').show();
                		$(".cart-bar").show();
                		$('.editor').show();
                		$('.default-page').hide();
                		createListDom(cartData)
                	}               	
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
	
	//切换列表模式
	var toggleModel = function(){
		mui('.mui-bar-nav').on('tap','.editor',function(){
			$(this).html("完成");
			$(this).removeClass('editor').addClass('complete');
			$('.order').css('display','none');
			$('.delete').css('display','flex');
			$('.mui-table-cell').find('input').prop('checked',false);
			$('.mui-table-view').html('');
			pageNum =1;
			pullupRefresh();
			mui("#cart-list").pullRefresh().refresh(true);
		})
		mui('.mui-bar-nav').on('tap','.complete',function(){
			$(this).html("编辑");
			$(this).removeClass('complete').addClass('editor');
			$('.order').css('display','flex');
			$('.delete').css('display','none');
			$('.mui-table-cell').find('input').prop('checked',false);
			$('.mui-table-view').html('');
			pageNum =1;
			pullupRefresh();
			mui("#cart-list").pullRefresh().refresh(true);
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
	mui(".mui-table-view").on("change","input[type=checkbox]",function(){
		var flag = this.checked ? true : false;
		var option = $(".mui-table-view").find("input[type=checkbox]:checked");
		if($('.mui-bar-nav button').hasClass('editor')){
			var price =parseInt($('.money').attr("data-money"));
			if(flag){			
				var productPrice = parseInt($(this).data('price'));
				var productNum = parseInt($(this).data('num'));
				price += productPrice*productNum;
				if(option.length==1){
					$('.order-btn').find('button').removeClass('mui-disabled');
				}
			}else{
				
				if(option.length==0){
					price = 0;
					$('.order-btn').find('button').addClass('mui-disabled');
				}else{
					price = parseInt($('.money').attr("data-money"))-parseInt($(this).data('price'))*parseInt($(this).data('num'));
				}					
			}
			$('.money').html('￥'+price).attr('data-money',price);
		}else{
			if(flag){
				if(option.length==1){
				$('.delete-btn').find('button').removeClass('mui-disabled');
				}
			}else{
				if(option.length==0){
				$('.delete-btn').find('button').addClass('mui-disabled');
				}
			}
		}
	})
	
	//删除购物车
	
	mui(".mui-bar-tab").on("tap",".delete-btn",function(){
		var deleteOptions = $(".mui-table-view").find("input[type=checkbox]:checked");
		var cartId = "";
		if(deleteOptions){
			for(var i=0;i<deleteOptions.length;i++){
				if(cartId == ""){
					cartId = $(deleteOptions[i]).data("id");
				}else{
					cartId +=","+$(deleteOptions[i]).data("id");
				}
			}
		}
		var cookieParam = getCookie();
		$.ajax({
            url:REQUEST_URL+"wxmrest/deleteBuyCart",
            type:"post",
            data:{
				"token":cookieParam.token,
				"mobile":cookieParam.mobile,
				"userId":cookieParam.userId,
				"buyCartIds":cartId
			},
            dataType:"json",
            async:true,
            success:function(data){
               if(data.code==REQUEST_OK){
               	    mui.toast(data.message);
               	    for(var i=0;i<deleteOptions.length;i++){
               	    	$(deleteOptions[i]).parents('.mui-table-view-cell').remove();
               	    }
               }else{
               		mui.toast(data.message);
               		setTimeout(function(){
						noLoginHandle();
					}, 2000);
               }
            }
        })
	})
	

	toggleModel();
	allSelect();
	mui(".mui-bar-tab").on("tap",".order-btn",function(){
		var cartSelect = $(".mui-table-view-cell").find("input[type=checkbox]:checked");
		var cartId="";
		console.log(typeof(cartSelect));
		for(var i=0;i<cartSelect.length;i++){
			if(cartId == ""){
				cartId = $(cartSelect[i]).data("id");
			}else{
				cartId+="-" + $(cartSelect[i]).data("id");
			}
		}
		if(cartId !== ""){
			mui.openWindow({
				url:"./place_order.html?"+cartId,
				id:"place_order.html"
			})
		}
		
	})
	
	mui('.default-page').on("tap",'.go',function(){
		mui.openWindow({
			url:'../buytea/tea_list.html'
		})
	})		
})()
