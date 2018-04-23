+(function($){
		
	mui.init({
		pullRefresh: {
			
			container:"#bill-wrapper",
			
			down: {				
				contentdown : "下拉可以刷新",
      			contentover : "释放立即刷新",
      			contentrefresh : "正在刷新...",
				callback: pulldownRefresh
			},
			up: {
				auto:true,
				contentrefresh: '正在加载...',
				callback: pullupRefresh
			}
		}
	})
	
	//日期控件	
	var calendar = function(){
		var currentYear = new Date().getFullYear();
		var currentMonth = new Date().getMonth()+1<10 ? "0"+(new Date().getMonth()+1) : new Date().getMonth()+1;
		$('.year-num').html(currentYear);
		$(".month-num").html(currentMonth);
		var currentShowYear = $('.year-num').html();
		var prevYear = currentShowYear-1;
		var nextYear = parseInt(currentShowYear)+1;		
		var yearHtml = '<a class="year-item">'+prevYear+'</a><a class="year-item mui-active">'+currentYear+'</a><a class="year-item">'+nextYear+'</a>';
		$('.year-select').html(yearHtml);
		var monthbox = $('.month-select');
		var top = $('<div class="month-option"/>');
		var bottom = $('<div class="month-option"/>');
		monthbox.append(top,bottom);
		var month;
		for(var i=1;i<=12;i++){
			if(i<10){
				if(i == currentMonth){
					month = $("<a class='month-item mui-active'><span>"+('0'+i)+"</span></a>");
				}else{
					month = $("<a class='month-item'><span>"+('0'+i)+"</span></a>");
				}
				
			}else{
				if(i == currentMonth){
					month = $("<a class='month-item mui-active'><span>"+i+"</span></a>");
				}else{
					month = $("<a class='month-item'><span>"+i+"</span></a>");
				}
			}			
			if(i<=6){				
				top.append(month);
			}else{
				bottom.append(month); 
			}
		}
		mui('.nav-item').on('tap','.prev-month',function(){
			var month = parseInt($('.month-num').html());
			$('.month-num').html(month-1 < 1 ? 12 :(month-1 < 10 ? '0'+(month-1):month-1));
			if($('.month-num').html() == 12){
				$('.year-num').html($('.year-num').html()-1);
			}
			freshView()
		})
		mui('.nav-item').on('tap','.next-month',function(){
			var month = parseInt($('.month-num').html());
			$('.month-num').html(month+1 > 12 ? '0'+1 : (month+1 < 10 ? '0'+(month+1):month+1));
			if($('.month-num').html() == 1){
				$('.year-num').html(parseInt($('.year-num').html())+1);
			}
			freshView()
		})
		mui('.nav-item').on('tap','.year',function(){
			$('.year-select').slideDown();
		})
		mui('.nav-item').on('tap','.month',function(){
			$('.month-select').slideDown();
		})
		mui('.year-select').on('tap','a',function(){			
			$('a').removeClass("mui-active");
			$(this).addClass("mui-active");
			$('.year-select').slideUp();
			$('.year-num').html($(this).html());
			var currentShowYear = $('.year-num').html();
			var prevYear = currentShowYear-1;
			var nextYear = parseInt(currentShowYear)+1;
			var yearHtml = '<a class="year-item">'+prevYear+'</a><a class="year-item mui-active">'+currentShowYear+'</a><a class="year-item">'+nextYear+'</a>';
			$('.year-select').html(yearHtml);
			freshView()
		})
		mui('.month-select').on('tap','a',function(){			
			$('a').removeClass("mui-active");
			$(this).addClass("mui-active");
			$('.month-select').slideUp();
			$('.month-num').html($(this).find('span').html());
			freshView()
		})
		
	}
		
	var getBillData = function(obj){
		var cookieParam = getCookie();
		$.ajax({
			url:REQUEST_URL+"wxmrest/queryRecord",
			type:"get",
			dataType:"json",
			async:true,
			data:{
				"token":cookieParam.token,
				"mobile":cookieParam.mobile,
				"userId":cookieParam.userId,
				'pageSize':10,
				'pageNum':obj.pageNum,
				'typeCd':obj.typeCd,
				'date':obj.dateStr
			},
			success:function(data){
				if(data.code == REQUEST_OK){
					var billData = data.data.logs;
					console.log(billData);
					if(billData.length == 0){
						mui("#bill-wrapper").pullRefresh().endPullupToRefresh(true);
					}else{
						createListDom (billData);
					}					
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
		var listWrapper = $(".mui-table-view");
		data.forEach(function(n){
			var listItem = $('<div class="mui-table-view-cell"/>');
			var content = $('<table class="bill-content"/>');
			var contentHtml = '<tr><td class="bill-type">'+n.type+'</td><td class="bill-content">'+n.moneys+'</td></tr>';
			var descHtml =  '<tr><td class="bill-time">'+n.date+'</td><td class="bill-desc-content">'+n.content+'</td></tr>';
			content.append(contentHtml,descHtml);
			listItem.append(content);
			listWrapper.append(listItem);
		})
	}
	
	var pageNum = 1;
	
	function freshView(){
		$(".mui-table-view").html("");
		var type = $(".options").find('.mui-active').data('type');
		var dateStr = $('.year-num').html()+"-"+$('.month-num').html();	
		pageNum =1;
		pullupRefresh();
		mui("#bill-wrapper").pullRefresh().refresh(true);
	}
	
	function pulldownRefresh(){
		setTimeout(function(){
			$(".mui-table-view").html("");
			var type = $(".options").find('.mui-active').data('type');
			var dateStr = $('.year-num').html()+"-"+$('.month-num').html();	
			var pageNum =1;
			var paramObj = {
				dateStr:dateStr,
				typeCd:type,
				pageNum:pageNum
			}			
			getBillData(paramObj);
			mui("#bill-wrapper").pullRefresh().endPulldownToRefresh();
		},500);
	}
		
	function pullupRefresh(){
		setTimeout(function(){
			var type = $(".options").find('.mui-active').data('type');
			var dateStr = $('.year-num').html()+"-"+$('.month-num').html();	
			var paramObj = {
				dateStr:dateStr,
				typeCd:type,
				pageNum:pageNum
			}			
			getBillData(paramObj);
			pageNum++;
			mui("#bill-wrapper").pullRefresh().endPulldownToRefresh();
		},500);
	}
				
	mui.ready(function(){
		calendar();
		
		mui("#bill-wrapper").pullRefresh().pullupLoading();
		var typeCd = document.location.href.substring(document.location.href.indexOf('?')+1); 
		
		$(".options li").each(function(i,n){
			if($(n).data("type")==typeCd){
				$(".options li").removeClass("mui-active");
				$(n).addClass("mui-active");
			}
		})
		
		
		$(".mui-bar-nav").on("tap",".mui-btn",function(){
			$(".options").slideDown();
		})
		$(".options").on("tap","li",function(){
			$('li').removeClass("mui-active");
			$(this).addClass("mui-active");
			$(".options").slideUp();
			freshView();
		})		
	})
	
})(jQuery)
