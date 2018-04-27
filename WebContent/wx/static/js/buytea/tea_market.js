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
	var id = parseInt(document.location.href.substr(document.location.href.indexOf("?")+1));
	var paramObj = {
  		teaId:id,
  		priceFlg:2,
  		wareHouseId:0,
  		quality:2,
  		size:150001
  	}
	
	function pulldownRefresh() {
		setTimeout(function() {	
			pageNum = 1;
			$('.mui-table-view').html("");			
			getbuyTeaData(pageSize,pageNum,paramObj);			
			mui("#buytea-list").pullRefresh().endPulldownToRefresh(); //refresh completed
			pageNum++;
		}, 500);
	}
	
	/**
	 * 上拉加载具体业务实现
	 */
	function pullupRefresh(obj) {
		setTimeout(function() {	
		mui("#buytea-list").pullRefresh().endPullupToRefresh(); //参数为true代表没有更多数据了。
		getbuyTeaData(pageSize,pageNum,paramObj);
		pageNum++;		
		}, 500);
	}
	
	mui.ready(function(){
		mui("#buytea-list").pullRefresh().pullupLoading();
	})		
	
	var getbuyTeaData = function(pageSize,pageNum,obj){
		var cookieParam = getCookie();
		$.ajax({
			url:REQUEST_URL+"wxmrest/queryTeaList",
			type:"get",
			dataType:"json",
			async:true,
			data:{
				"token":cookieParam.token,
				"mobile":cookieParam.mobile,
				"userId":cookieParam.userId,
				'pageSize':pageSize,
				'pageNum':pageNum,
				'teaId':obj.teaId,
				'priceFlg':obj.priceFlg,
				'wareHouseId':obj.wareHouseId,
				'quality':obj.quality,
				'size':obj.size
			},
			success:function(data){
				if(data.code == REQUEST_OK){
					console.log(data);
					var descUrl = data.data.descUrl;
					var teaListData = data.data.data;
					$('#paramInput').val(descUrl);
					createListDom(teaListData)
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
		var list = $(".tea-list");
		data.forEach(function(n){
			var li = $("<div class='mui-table-view-cell' data-id="+n.id+"/>");
			var namediv = $("<div class='tea-name'/>");
			var teaName = "<span class='name'>"+n.name+"</span><span class='mui-pull-right tea-price'>"+n.price+"/"+n.size+"</span>";
			namediv.html(teaName);
			var tagDiv = $("<div class='tag-box'/>")
			var tagHtml = "<span class='tea-tag'>"+n.wareHouse+"</span><span class='tea-tag'>"+n.type+"</span><span class='mui-pull-right tea-num'>X"+n.stock+n.size+"</span>";
			tagDiv.html(tagHtml);
			li.append(namediv,tagDiv);
			list.append(li);
		})
	}
	
	mui('.mui-bar').on('tap','.piece-size',function(){
		var size = $(this).data('size');
		var priceFlag = $('.options .price .mui-active').data('priceFlag');
		var quality = $('.options .count .mui-active').data('quality');
		paramObj.priceFlg = priceFlag;
		paramObj.quality = quality;
		paramObj.size = size;
		$('.mui-table-view').html('');
		pageNum =1;
		pullupRefresh(paramObj);
		mui("#buytea-list").pullRefresh().refresh(true);
	})
	mui('.mui-bar').on('tap','.filter-option',function(e){
		$('.options').toggle();
	})
	mui('.options').on('tap','.price span',function(){
		$(".price span").removeClass('mui-active');
		$(this).addClass('mui-active');
	})
	mui('.options').on('tap','.count span',function(){
		$(".count span").removeClass('mui-active');
		$(this).addClass('mui-active');
	})
	
	mui('.options').on('tap','.reset',function(){
		$(".price span").removeClass('mui-active');
		$(".price span").eq(0).addClass('mui-active');
		$(".count span").removeClass('mui-active');
		$(".count span").eq(0).addClass('mui-active');
	})
	
	mui('.options').on('tap','.sure',function(){
		var size = $('.piece-size.mui-active').data('size');
		var priceFlag = $('.options .price .mui-active').data('priceFlag');
		var quality = $('.options .count .mui-active').data('quality');
		paramObj.priceFlg = priceFlag;
		paramObj.quality = quality;
		paramObj.size = size;
		$('.options').slideUp();
		$('.mui-table-view').html('');
		pageNum =1;
		pullupRefresh(paramObj);
		mui("#buytea-list").pullRefresh().refresh(true);
	
	})
	
	mui(".mui-table-view").on("tap",".mui-table-view-cell",function(){
		var teaId = $(this).data("id");
		mui.openWindow({
			url:"../../new_tea_publish/select_spec.html?"+teaId,
			id:"select_spec.html"
		})
		
	})
	
	
})()
