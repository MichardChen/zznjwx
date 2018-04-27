+(function(){
	//初始化mui
	mui.init({
		pullRefresh: {
			container: "#fresh-news",
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
			getInformationData(pageSize,pageNum);			
			mui("#fresh-news").pullRefresh().endPulldownToRefresh(); //refresh completed
			pageNum++;
		}, 500);
	}
	
	/**
	 * 上拉加载具体业务实现
	 */
	function pullupRefresh() {
		setTimeout(function() {	
		mui("#fresh-news").pullRefresh().endPullupToRefresh(); //参数为true代表没有更多数据了。
		getInformationData(pageSize,pageNum);
		pageNum++;		
		}, 500);
	}
	mui.ready(function(){
		mui("#fresh-news").pullRefresh().pullupLoading();
	})		

	//请求数据
	var getInformationData = function(pageSize,pageNum){
		$.ajax({
			url:REQUEST_URL+"wxnonAuthRest/queryNewsList",
			type:"get",
			dataType:"json",
			async:true,
			data:{
				"pageSize":pageSize,
				"pageNum":pageNum
			},
			success:function(data){
				if(data.code == REQUEST_OK){
					console.log(data);
					if(pageNum ==1 && data.data.news.length == 0){
						createNoData();
					}else{
						var informationData = data.data;
						createDom(informationData);
					}					
				}else{
					mui.toast(data.message)
				}
			}
		})
	}
	//构建列表dom
	var createDom = function(data){
		var table = $('.mui-table-view');
		for (var i = 0; i < data.news.length; i++) {
			var li = $('<li class="mui-table-view-cell"/>')
			var titleBox = $('<div class="title-box"/>');
			var imgBox = $('<div class="img-box"/>');
			imgBox.html('<img src="'+data.news[i].img+'" width=100 height=60>');
			var title = '<a class="title" href='+data.news[i].shareUrl+'>'+data.news[i].title+'</a>';
			var desc = '<div class="desc"><span class="information-type">'+data.news[i].type+'</span><span class="time">'+data.news[i].date+'</span></div>';
			titleBox.html(title+desc);
			//下拉刷新，新纪录插到最前面；
			li.append(titleBox);
			li.append(imgBox);
			table.append(li);
		}
	}
	
	//构建缺省页
	
	var createNoData = function(){
		var table  = $('.mui-table-view');
		var li;
		li = $('<li class="no-product"/>')
		var noProductText = $("<p/>")
		noProductText.text("当前暂无资讯")
		li.html(noProductText);
		table.html(li);
	}
	
	
	mui('.mui-table-view').on('tap','.mui-table-view-cell',function(){
		var url = $(this).find('a').attr('href');
		mui.openWindow({
    		url:url,
    		show:{
		      autoShow:true,//页面loaded事件发生后自动显示，默认为true
		      aniShow:"slide-in-right",//页面显示动画，默认为”slide-in-right“；
		      duration:100//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
		    }
    	})
	});
})()
