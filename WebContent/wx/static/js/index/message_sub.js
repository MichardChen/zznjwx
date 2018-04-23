+(function(){
	
	
	var getMessageData = function(obj){
		//获取cookie
		var cookieParam = getCookie();
		//请求数据
		$.ajax({
			url:REQUEST_URL+"wxmrest/queryMessageList",
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
					var messageData = data.data;
					createListDom(messageData);
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
		console.log(data);
		var table = $('.mui-table-view');
		for (var i = 0; i < data.messages.length; i++) {
			var li = $('<li class="mui-table-view-cell" data-messageid='+data.messages[i].id+'/>')
			var titleBox = $('<div class="title-box"/>');
			var title = '<a class="title" >'+data.messages[i].type+'</a>';
			var desc = '<div class="desc"><span class="message-type">'+data.messages[i].title+'</span></div>';				
			var time = '<div class="time"><span class="time">'+data.messages[i].date+'</span><span class="mui-pull-right">查看详情<i class="icon-next"></i></span></div>'
			titleBox.html(title+desc+time);
			//下拉刷新，新纪录插到最前面；
			li.append(titleBox);
			table.append(li);
		}
	}
	
	var paramObj = {
		id:'#messages-list',
		fn:getMessageData
	}
	
	loadList(paramObj);
	
	mui('.mui-table-view').on('tap','.mui-table-view-cell',function(){
		var msgid = $(this).data("messageid");
		mui.openWindow({
    		url:"./message_desc.html?"+msgid,
    		id:"message.html",
    		show:{
		      autoShow:true,//页面loaded事件发生后自动显示，默认为true
		      aniShow:"slide-in-right",//页面显示动画，默认为”slide-in-right“；
		      duration:100//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
		    }
    	})
	});
})()

