+(function(){
	var getbuyTeaData = function(obj){
		var cookieParam = getCookie();
		$.ajax({
			url:REQUEST_URL+"wxmrest/queryBuyTeaList",
			type:"get",
			dataType:"json",
			async:true,
			data:{
				"token":cookieParam.token,
				"mobile":cookieParam.mobile,
				"userId":cookieParam.userId,
				'pageSize':obj.pageSize,
				'pageNum':obj.pageNum,
				'name':obj.name
			},
			success:function(data){
				if(data.code == REQUEST_OK){
					var teaListData = data.data.data;
					console.log(teaListData);
					createList(teaListData)
				}else{
					mui.toast(data.message)
				}
			},
			error:function(msg){
				console.log(msg);
			}
		})
	}
	var createList = function(data){
		var listWrapper = $('.mui-table-view');
		data.forEach(function(n){
			var li = $('<li class="mui-table-view-cell" data-id='+n.id+'/>');
			var topDiv = $('<div class="top-div"/>');
			var bottomDiv = $('<div class="bottom-div"/>');
			var topHtml = '<div class="tea-img"><img src='+n.img+' width=100 height=60></div><div class="tea-text"><p class="tea-name">'+n.name+'</p><span class="tea-tag">'+n.type+'</span></div>'
			topDiv.html(topHtml);
			var bottomHtml = '<p class="tea-price">参考价格<span class="price">￥'+n.price+'/'+n.size+'</span></p>';
			bottomDiv.html(bottomHtml);
			li.append(topDiv,bottomDiv);
			listWrapper.append(li);
		})
	}
	
	var paramObj = {
		id:"#buytea-list",
		fn:getbuyTeaData,
	}
	
	loadList(paramObj);
	
	$('.mui-table-view').on("tap",'.mui-table-view-cell',function(){
		var id = $(this).data('id');
		mui.openWindow({
			url:'./tea_analyze.html?'+id,
			id:"tea_analyze.html",
    		show:{
		      autoShow:true,//页面loaded事件发生后自动显示，默认为true
		      aniShow:"slide-in-right",//页面显示动画，默认为”slide-in-right“；
		      duration:100//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
		    }
		})
	})
	
	
	mui.ready(function(){
		$('.mui-input-clear').on('keyup',function(){
			var key = this.value;
			paramObj.name = key;
			paramObj.fresh = true;
			loadList(paramObj);
		})
	})
	
	
})()
