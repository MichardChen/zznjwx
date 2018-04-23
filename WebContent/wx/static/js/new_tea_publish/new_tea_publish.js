+(function(){
	//请求数据
	var getNewTeaData = function(obj){
		//获取cookie
		var cookieParam = getCookie();
		//请求数据
		$.ajax({
			url:REQUEST_URL+"wxmrest/queryNewTeaSaleList",
			type:"get",
			dataType:"json",
			async:true,
			data:{
				"token":cookieParam.token,
				"mobile":cookieParam.mobile,
				"userId":cookieParam.userId,
				"pageSize":obj.pageSize,
				"pageNum":obj.pageNum
			},
			success:function(data){
				if(data.code == REQUEST_OK){
					var teaListData = data.data;
					console.log(teaListData);
					createListDom(teaListData.models);
				}else{
					mui.toast(data.message)
				}
			},
			error:function(msg){
				console.log(msg);
			}
		})
	}
	
	var createListDom = function(data){
		var table = $('.mui-table-view');
		var flag = table.find('.tea-publish-bar');
		if(flag.length == 0){
			var firstLi = $('<li class="mui-table-view-cell tea-publish-bar"/>');
			firstLi.html('<p class="desc-text">亲爱的茶友们，由云南同记倾心打造的“同记冰岛（生茶）”即将上市发行，敬请期待。本次预计发行300件茶品，传承古法，手工石磨，喝同记茶，享健康人生。</p>')
			table.append(firstLi);
		}
		data.forEach(function(n){
			var li = $('<li class="mui-table-view-cell"/>')
			var topImg = $('<div class="tea-img" data-teaid="'+n.teaId+'"/>');
			topImg.html('<img src='+n.img+' width=100%> ');
			var bottomText = $('<div class="tea-text"/>');
			var teaName = $('<div class="tea-name">'+n.name+'|库存'+n.stock+n.unit+'</div>');
			var teaStatus = $('<div class="tea-status '+ (n.status == 090002? "tea-publishing" : "tea-wait-publish")+'" data-tatus ='+n.status+'>'+n.statusName+'</div>')
			bottomText.append(teaName);
			bottomText.append(teaStatus);
			li.append(topImg);
			li.append(bottomText);
			table.append(li);
		})
	}
	var paramObj = {
		id:"#newtea-list",
		fn:getNewTeaData
	}
	loadList(paramObj);
	
	mui('.mui-table-view').on('tap',".mui-table-view-cell",function(){
		var teaId = $(this).find('.tea-img').data('teaid');
		mui.openWindow({
			url:"./tea_desc.html?"+teaId,
			id:"tea_desc.html"
		})
	})
	
	mui('.mui-bar-nav').on('tap',".mui-btn",function(){
		var cookieParam = getCookie();  
		$.ajax({
    		url:REQUEST_URL+'wxnonAuthRest/queryDocument',
    		type:"get",
    		dataType:"json",
    		data:{
    			"token":cookieParam.token,
				"mobile":cookieParam.mobile,
				"userId":cookieParam.userId,
    			"typeCd":'060001'
    		},
    		success:function(data){
    			console.log(data);
	            mui.openWindow({
					url:"./publish_desc.html?"+data.data.url,
					id:"publish_desc.html"
				})
    		}
    	})
		
	})
	
	
})()
