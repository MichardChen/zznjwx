+(function(){
	//请求数据
	var getInformationData = function(pageSize,pageNum){
		var informationData;
		$.ajax({
			url:REQUEST_URL+"wxnonAuthRest/queryNewsList",
			type:"get",
			dataType:"json",
			async:false,
			data:{
				"pageSize":pageSize,
				"pageNum":pageNum
			},
			success:function(data){
				if(data.code == REQUEST_OK){
					informationData = data.data;
				}else{
					mui.toast(data.message)
				}
			}
		})
		return informationData;
	}
	
	mui.init({
		pullRefresh: {
			container: '#fresh-news',
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
	
	
	/**
	 * 下拉刷新具体业务实现
	 */
	function pulldownRefresh() {
		setTimeout(function() {	
			var table = $('.mui-table-view');
			table.html('');
			var pageSize = 10;
			var pageNum = 1;
			var data = getInformationData(pageSize,pageNum);
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
			mui('#fresh-news').pullRefresh().endPulldownToRefresh(); //refresh completed
		}, 1500);
	}
	var count = 0;
	var pageSize = 10;
	var pageNum = 1;
	/**
	 * 上拉加载具体业务实现
	 */
	function pullupRefresh() {
		setTimeout(function() {
			mui('#fresh-news').pullRefresh().endPullupToRefresh((++count > 2)); //参数为true代表没有更多数据了。
			var table = $('.mui-table-view');
			var data = getInformationData(pageSize,pageNum);
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
			pageNum++;
		}, 1500);
	}
	if (mui.os.plus) {
		mui.plusReady(function() {
			setTimeout(function() {
				mui('#fresh-news').pullRefresh().pullupLoading();
			}, 1000);

		});
	} else {
		mui.ready(function() {
			mui('#fresh-news').pullRefresh().pullupLoading();
		});
	}
	mui('.mui-table-view').on('tap','.mui-table-view-cell',function(){
		var url = $(this).find('a').attr('href');
		document.location.href=url;
	});
})()
