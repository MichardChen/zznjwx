+(function(){
	//请求列表数据
	var getListData = function(){
		var cookieParam = checkCookie();
		var teaId = document.location.href.substring(document.location.href.indexOf('?')+1);
		$.ajax({
			type:"get",
			url:REQUEST_URL+"wxmrest/queryWareHouseDetail",
			async:true,
			data:{
				"token":cookieParam.token,
				"mobile":cookieParam.mobile,
				"userId":cookieParam.userId,
				"teaId":teaId
			},
			dataType:"json",
			success:function(data){
				if(data.code == REQUEST_OK){
					console.log(data.data);
					createTeaDom(data.data.tea);
					createStorageList(data.data.warehouse);
				}else{
					mui.toast(data.message);
				}
			}
		});
	}
	
	getListData();
	
	var createTeaDom = function(data){
		var listWapper = $(".mui-table-view");
		var li = $('<li class="mui-table-view-cell"/>')
		var topPart = $('<div class="top-part"/>')
		var topPartContent = '<p class="tea-title">'+data.name+'</p><p class="mui-pull-right tea-num">总计：'+data.stock+data.size+'</p>';
		topPart.html(topPartContent);
		var bottomPart = $('<div class="bottom-part"/>');
		var bottomPartContent = '<span class="tea-tag">'+data.type+'</span>'
		bottomPart.html(bottomPartContent);
		li.append(topPart);
		li.append(bottomPart);
		listWapper.append(li);
	}
	
	var createStorageList = function(data){
		var listWapper = $(".mui-table-view");
		data.forEach(function(n){
			var li = $('<li class="mui-table-view-cell"/>')
			var title = $('<h3 class="storage-name">'+n.wareHouse+'</h3>')
			var sale = $('<div class="sale-box"/>');
			var saleHtml = '<span>出售中：'+n.saleQuality+'片</span><button class="mui-btn mui-btn-danger mui-pull-right">我要卖茶</button>';
			sale.html(saleHtml);
			var get = $('<div class="get-box"/>');
			var getHtml = '<span>可取数：'+n.canGetQuality+'片</span><button class="mui-btn mui-btn-success mui-pull-right">我要取茶</button>';
			get.html(getHtml);
			li.append(title,sale,get);
			listWapper.append(li);			
		})
	}
	
	mui(".mui-table-view").on("tap",".mui-btn-danger",function(){
			appAlert()
	})
	mui(".mui-table-view").on("tap",".mui-btn-success",function(){
			appAlert()
	})
		
})()
