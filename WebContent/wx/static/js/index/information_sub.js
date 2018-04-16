+(function(){
	//请求数据
	var getInformationData = function(obj){
		$.ajax({
			url:REQUEST_URL+"wxnonAuthRest/queryNewsList",
			type:"get",
			dataType:"json",
			async:true,
			data:{
				"pageSize":obj.pageSize,
				"pageNum":obj.pageNum
			},
			success:function(data){
				if(data.code == REQUEST_OK){
					var informationData = data.data;
					createDom(informationData);
				}else{
					mui.toast(data.message)
				}
			}
		})
	}
	
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
	
	var paramObj = {
		id:"#fresh-news",
		fn:getInformationData
	}

	loadList(paramObj);
	
	mui('.mui-table-view').on('tap','.mui-table-view-cell',function(){
		var url = $(this).find('a').attr('href');
		mui.openWindow({
    		url:"../information_desc.html?"+url,
    		id:"information.html",
    		show:{
		      autoShow:true,//页面loaded事件发生后自动显示，默认为true
		      aniShow:"slide-in-right",//页面显示动画，默认为”slide-in-right“；
		      duration:100//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
		    }
    	})
	});
})()
