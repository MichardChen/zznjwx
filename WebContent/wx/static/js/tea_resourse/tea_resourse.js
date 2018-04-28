+(function(){
	
	//初始化mui
	mui.init({
		pullRefresh: {
			container: "#resourse-list",
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
			getListData(pageSize,pageNum);			
			mui("#resourse-list").pullRefresh().endPulldownToRefresh(); //refresh completed
			pageNum++;
		}, 500);
	}
	
	/**
	 * 上拉加载具体业务实现
	 */
	function pullupRefresh() {
		setTimeout(function() {	
		mui("#resourse-list").pullRefresh().endPullupToRefresh(); //参数为true代表没有更多数据了。
		getListData(pageSize,pageNum);
		pageNum++;		
		}, 500);
	}
	mui.ready(function(){
		mui("#resourse-list").pullRefresh().pullupLoading();
	})		
	
	//请求列表数据
	var getListData = function(pageSize,pageNum){
		var cookieParam = checkCookie();
		$.ajax({
			type:"get",
			url:REQUEST_URL+"wxmrest/queryTeaProperty",
			async:true,
			data:{
				"token":cookieParam.token,
				"mobile":cookieParam.mobile,
				"userId":cookieParam.userId,
				"pageSize":pageSize,
				"pageNum":pageNum
			},
			dataType:"json",
			success:function(data){
				if(data.code == REQUEST_OK){
					console.log(data.data);
					if(pageNum ==1 && data.data.tea.length == 0){
						createNoData();
					}else{
						createListDom(data.data.tea);
					}
					
				}else{
					mui.toast(data.message);
					setTimeout(function(){
						noLoginHandle();
					}, 2000);
				}
			}
		});
	}
	
	var createListDom = function(data){
		var listWapper = $(".mui-table-view");
		var li;
		data.forEach(function(n){
			li = $('<li class="mui-table-view-cell" data-teaId='+n.teaId+'/>')
			var topPart = $('<div class="top-part"/>')
			var topPartContent = '<p class="tea-title">'+n.name+'</p><p class="mui-pull-right tea-num">库存：'+n.stock+n.size+'</p>';
			topPart.html(topPartContent);
			var bottomPart = $('<div class="bottom-part"/>');
			var bottomPartContent = '<span class="tea-tag">'+n.type+'</span><a class="mui-pull-right">查看详情<i class="icon-next"></i></a>'
			bottomPart.html(bottomPartContent);
			li.append(topPart);
			li.append(bottomPart);
			listWapper.append(li);
		})
	}
	
	//构建缺省页
	
	var createNoData = function(){
		var table  = $('.mui-table-view');
		var li;
		li = $('<li class="no-product"/>')
		var noProductText = $("<p/>")
		noProductText.text("当前暂无仓储")
		li.html(noProductText);
		table.html(li);
	}
	
	mui(".header-nav").on("tap",".buy-tea",function(){
		var cookieParam = getCookie();  
    	$.ajax({
    		url:REQUEST_URL+'wxnonAuthRest/queryDocument',
    		type:"get",
    		dataType:"json",
    		async:true,
    		data:{
    			"token":cookieParam.token,
				"mobile":cookieParam.mobile,
				"userId":cookieParam.userId,
    			"typeCd":'060011'
    		},
    		success:function(data){
    			console.log(data);
    			var html = "<iframe src="+data.data.url+" scrolling=no width=100% height=300px></iframe>";
	        	jqalert({
			        content: html,
			        yestext: '同意并继续',
			        notext: '取消',
			        yesfn: function(){
			        	mui.openWindow({
			        		url:"../buytea/tea_list.html",
			        		id:'tea_list.html'
			        	})
			        }
			    })
    		}
    	})
	})
	
	mui(".header-nav").on("tap",".sale-tea",function(){
			appAlert()
	})
	
	mui(".header-nav").on("tap",".cancellations",function(){
			appAlert()
	})
	
	mui(".header-nav").on("tap",".records",function(){
			mui.openWindow({
				url:"../bill/bill_list.html",
				id:"bill_list.html"
			})
	})
	
	mui(".mui-content").on("tap",".mui-table-view-cell",function(){
			var teaId = $(this).data("teaid");
			mui.openWindow({
				url:"./tea_storage.html?"+teaId,
				id:"tea_storage.html"
			})
	})
	
})()
