+(function(){
	
	var login = function(){
		mui.openWindow({
    		url:"../login/login.html",
    		id:"login.html",
    		show:{
		      autoShow:true,//页面loaded事件发生后自动显示，默认为true
		      aniShow:"slide-in-down",//页面显示动画，默认为”slide-in-right“；
		      duration:100//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
		    }
        })
	}
	//请求列表数据
	var getListData = function(obj){
		var cookieParam = checkCookie();
		$.ajax({
			type:"get",
			url:REQUEST_URL+"wxmrest/queryTeaProperty",
			async:true,
			data:{
				"token":cookieParam.token,
				"mobile":cookieParam.mobile,
				"userId":cookieParam.userId,
				"pageSize":obj.pageSize,
				"pageNum":obj.pageNum
			},
			dataType:"json",
			success:function(data){
				if(data.code == REQUEST_OK){
					console.log(data.data);
					createListDom(data.data.tea);
				}else{
					mui.toast(data.message);
					login();
				}
			}
		});
	}
	
	var createListDom = function(data){
		var listWapper = $(".mui-table-view");
		var li;
		if(data.length == 0){
			li = $('<li class="mui-table-view-cell no-product"/>')
			var noProductText = $("<p/>")
			noProductText.text("当前暂无仓储")
			li.html(noProductText);
			listWapper.html(li);
		}else{
			data.forEach(function(n){
				li = $('<li class="mui-table-view-cell"/>')
				var topPart = $('<div class="top-part"/>')
				var topPartContent = '<p class="tea-title">'+n.name+'</p><p class="mui-pull-right tea-num">库存：'+n.warehouse+n.size+'</p>';
				topPart.html(topPartContent);
				var bottomPart = $('<div class="bottom-part"/>');
				var bottomPartContent = '<span class="tea-tag">'+n.type+'</span><a class="mui-pull-right">查看详情<i class="icon-next"></i></a>'
				bottomPart.html(bottomPartContent);
				li.append(topPart);
				li.append(bottomPart);
				listWapper.append(li);
			})
		}
	}
	var paramObj = {
		id:"#resourse-list",
		fn:getListData
	}
	loadList(paramObj);
})()
