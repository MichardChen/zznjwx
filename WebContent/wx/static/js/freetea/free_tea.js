+(function(){
	
	//初始化mui
	mui.init({
		pullRefresh: {
			container: "#store-list",
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
			mui("#store-list").pullRefresh().endPulldownToRefresh(); //refresh completed
			pageNum++;
		}, 500);
	}
	
	/**
	 * 上拉加载具体业务实现
	 */
	function pullupRefresh() {
		setTimeout(function() {	
		mui("#store-list").pullRefresh().endPullupToRefresh(); //参数为true代表没有更多数据了。
		getListData(pageSize,pageNum);
		pageNum++;		
		}, 500);
	}
	mui.ready(function(){
		mui("#store-list").pullRefresh().pullupLoading();
	})		
	
	//请求列表数据
	var getListData = function(pageSize,pageNum){
		var cookieParam = checkCookie();
		var provinceId = $("#province").find("option:selected").val();
		var cityId = $("#city").find("option:selected").val();
		$.ajax({
			type:"get",
			url:REQUEST_URL+"wxmrest/queryTeaStoreList",
			async:true,
			data:{
				"token":cookieParam.token,
				"mobile":cookieParam.mobile,
				"userId":cookieParam.userId,
				"provinceId":provinceId,
				"cityId":cityId,
				"pageSize":10,
				"pageNum":1
			},
			dataType:"json",
			success:function(data){
				if(data.code == REQUEST_OK){
					console.log(data.data);
					if(pageNum ==1 && data.data.storeList.length == 0){
						createNoData();
					}else{
						createListDom(data.data.storeList);
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
			var leftImg = "<div class='store-img'><img src="+n.img+" width = 75px height=auto></div>";
			var right = $("<div class='store-desc'/>");
			var title = "<h3>"+n.businessTea+"</h3>";
			var address = "<p><span class='icon-address'>"+n.address+" 距离"+n.distance+"</p>";
			var teaDesc = "<p><span class='icon-bg'>"+n.name+"</p>";
			right.apend(title,address,teaDesc);
			li.append(leftImg,right);
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

	var createSelector = function(){
		var province = $("#province");
		var city = $("#city");
		cityData3.forEach(function(n){
			if(n.text == "全国"){
				var cities = n.children;
				var cityOption = "<option value="+cities[0].value+">"+cities[0].text+"</option>";
				city.html(cityOption);
			}
			var optionHtml = "<option value="+n.value+">"+n.text+"</option>";
			province.append(optionHtml);
		})
		
		province.on("change",function(){
			var value = $(this).find("option:selected").val();
			var arr = cityData3.filter(function(n){
				return n.value == value;
			})
			var cityArr = arr[0].children;
			var html = "";
			cityArr.forEach(function(n){
				html+="<option value="+n.value+">"+n.text+"</option>";
			})
			city.html(html);
		})		
	}

	mui.ready(function(){
		createSelector();
	})
})()
