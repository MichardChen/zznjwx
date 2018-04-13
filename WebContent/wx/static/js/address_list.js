+(function(){
	//获取cookie值
	var cookieParam = getCookie();
	//请求收货地址列表数据
	var getAddressData = function(pageSize,pageNum){
		var ListData;
		$.ajax({
			type:"get",
			url:REQUEST_URL+"wxmrest/queryMemberAddressList",
			data:{
				"token":cookieParam.token,
				"mobile":cookieParam.mobile,
				"userId":cookieParam.userId,
				"pageSize":pageSize,
				"pageNum":pageNum
			},
			async:false,
			dataType:"json",
			success:function(data){
				if(data.code == REQUEST_OK){
					ListData =  data.data;
				}else{
					return ;
				}
			}
		});
		return ListData;
	}
	mui.init({
		pullRefresh: {
			container: '#address-list',
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
			var data = getMessageData(pageSize,pageNum);
			for (var i = 0; i < data.messages.length; i++) {
				var li = $('<li class="mui-table-view-cell"/>')
				var titleBox = $('<div class="title-box"/>');
				var title = '<a class="title" href='+data.messages[i].shareUrl+'>'+data.messages[i].title+'</a>';
				var desc = '<div class="desc"><span class="message-type">'+data.messages[i].type+'</span></div>';				
				var time = '<div class="time"><span class="time">'+data.messages[i].date+'</span><span class="mui-pull-right">查看详情<i class="icon-next"></i></span></div>'
				titleBox.html(title+desc+time);
				//下拉刷新，新纪录插到最前面；
				li.append(titleBox);
				table.append(li);
			}
			mui('#messages-list').pullRefresh().endPulldownToRefresh(); //refresh completed
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
			mui('#messages-list').pullRefresh().endPullupToRefresh((++count > 2)); //参数为true代表没有更多数据了。
			var table = $('.mui-table-view');
			var data = getMessageData(pageSize,pageNum);
			for (var i = 0; i < data.messages.length; i++) {
				var li = $('<li class="mui-table-view-cell"/>')
				var titleBox = $('<div class="title-box"/>');
				var title = '<a class="title" href='+data.messages[i].shareUrl+'>'+data.messages[i].title+'</a>';
				var desc = '<div class="desc"><span class="information-type">'+data.messages[i].type+'</span></div>';
				var time = '<div class="time"><span class="time">'+data.messages[i].date+'</span><span class="mui-pull-right">查看详情<i class="icon-next"></i></span></div>'
				titleBox.html(title+desc+time);
				//上拉加载；
				li.append(titleBox);
				table.append(li);
			}
			pageNum++;
		}, 1500);
	}
	if (mui.os.plus) {
		mui.plusReady(function() {
			setTimeout(function() {
				mui('#messages-list').pullRefresh().pullupLoading();
			}, 1000);

		});
	} else {
		mui.ready(function() {
			mui('#messages-list').pullRefresh().pullupLoading();
		});
	}
	mui('.mui-table-view').on('tap','.mui-table-view-cell',function(){
		var url = $(this).find('a').attr('href');
		document.location.href=url;
	});	
})()
