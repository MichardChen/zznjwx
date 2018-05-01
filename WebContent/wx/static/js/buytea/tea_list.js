+(function(){
	//初始化mui
	mui.init({
		pullRefresh: {
			container: "#buytea-list",
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
			getbuyTeaData(pageSize,pageNum);			
			mui("#buytea-list").pullRefresh().endPulldownToRefresh(); //refresh completed
			pageNum++;
		}, 500);
	}
	
	/**
	 * 上拉加载具体业务实现
	 */
	function pullupRefresh(name) {
		setTimeout(function() {	
		mui("#buytea-list").pullRefresh().endPullupToRefresh(); //参数为true代表没有更多数据了。
		getbuyTeaData(pageSize,pageNum,name);
		pageNum++;		
		}, 500);
	}
	mui.ready(function(){
		mui("#buytea-list").pullRefresh().pullupLoading();
	})		
	
	var getbuyTeaData = function(pageSize,pageNum,name){
		//var cookieParam = getCookie();
		$.ajax({
			url:REQUEST_URL+"wxmrest/queryBuyTeaList",
			type:"get",
			dataType:"json",
			async:true,
			data:{
				/*"token":cookieParam.token,
				"mobile":cookieParam.mobile,
				"userId":cookieParam.userId,*/
				'pageSize':pageSize,
				'pageNum':pageNum,
				'name':name
			},
			success:function(data){
				if(data.code == REQUEST_OK){
					var teaListData = data.data.data;
					console.log(teaListData);
					createList(teaListData)
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
	
	$('.mui-input-clear').on('keyup',function(){
		$('.mui-table-view').html('');
		var key = this.value;
		pageNum =1;
		pullupRefresh(key);
		mui("#buytea-list").pullRefresh().refresh(true);
	})

	
})()
