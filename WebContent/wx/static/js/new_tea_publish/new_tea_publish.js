+(function(){
	//初始化mui
	mui.init({
		pullRefresh: {
			container: "#newtea-list",
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
			getNewTeaData(pageSize,pageNum);			
			mui("#newtea-list").pullRefresh().endPulldownToRefresh(); //refresh completed
			pageNum++;
		}, 500);
	}
	
	/**
	 * 上拉加载具体业务实现
	 */
	function pullupRefresh() {
		setTimeout(function() {	
		mui("#newtea-list").pullRefresh().endPullupToRefresh(); //参数为true代表没有更多数据了。
		getNewTeaData(pageSize,pageNum);
		pageNum++;		
		}, 500);
	}
	mui.ready(function(){
		mui("#newtea-list").pullRefresh().pullupLoading();
	})		
	
	
	//请求数据
	var getNewTeaData = function(pageSize,pageNum){
		//请求数据
		$.ajax({
			url:REQUEST_URL+"wxmrest/queryNewTeaSaleList",
			type:"get",
			dataType:"json",
			async:true,
			data:{
				"pageSize":pageSize,
				"pageNum":pageNum
			},
			success:function(data){
				if(data.code == REQUEST_OK){
					var teaListData = data.data;
					console.log(teaListData);
					createListDom(teaListData.models);
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
	
	mui('.mui-table-view').on('tap',".mui-table-view-cell",function(){
		var teaId = $(this).find('.tea-img').data('teaid');
		mui.openWindow({
			url:"./tea_desc.html?"+teaId,
			id:"tea_desc.html"
		})
	})
	
	mui('.mui-bar-nav').on('tap',".mui-btn",function(){
		//var cookieParam = getCookie();  
		$.ajax({
    		url:REQUEST_URL+'wxnonAuthRest/queryDocument',
    		type:"get",
    		dataType:"json",
    		data:{
    			/*"token":cookieParam.token,
				"mobile":cookieParam.mobile,
				"userId":cookieParam.userId,*/
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
	
	mui('.mui-bar-tab').on('tap',".mui-btn",function(){
		var cookieParam = checkCookie(noLoginHandle);
		if(cookieParam){
			mui.openWindow({
				url:"../bill/bill_list.html?120001",
				id:"bill.html"
			})	
		}
		
		
	})
	
	
})()
