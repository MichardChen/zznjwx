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
		createSelector();
	})		
	
	//获取地理位置信息
	var position = new Object();
	mapObj = new AMap.Map('iCenter');
	mapObj.plugin('AMap.Geolocation', function () {
	    geolocation = new AMap.Geolocation({
	        enableHighAccuracy: true,//是否使用高精度定位，默认:true
	        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
	        maximumAge: 0,           //定位结果缓存0毫秒，默认：0
	        convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
	        showButton: true,        //显示定位按钮，默认：true
	        buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
	        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
	        showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
	        showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
	        panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
	        zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
	    });
	    mapObj.addControl(geolocation);
	    geolocation.getCurrentPosition();
	    AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
	    AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
	});
	
	function onComplete(result){
		console.log(result);
		position.localLongtitude = result.position.lon;
		position.localLatitude = result.position.lat;
	}
	
	function onError(result){
		mui.alert(result.message);
	}
	
	//请求列表数据
	var getListData = function(pageSize,pageNum){
		var provinceId = $("#province").find("option:selected").val();
		var cityId = $("#city").find("option:selected").val();
		var cookieParam = typeof getCookie() ==="object" ? getCookie() : "" ;
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
				"pageSize":pageSize,
				"pageNum":pageNum,
				"localLongtitude":position.localLongtitude,
				"localLatitude":position.localLatitude
			},
			dataType:"json",
			success:function(data){
				if(data.code == REQUEST_OK){
					console.log(data.data);
					if(pageNum ==1 && data.data.storeList.length == 0){
						createNoData();
					}else{
						createListDom(data);
					}
					
				}else{
					mui.toast(data.message);
				}
			}
		});
	}
	
	var createListDom = function(data){
		var listWapper = $(".mui-table-view");
		var li;
		var storeList = data.data.storeList;
		var bindStoreFlg = data.data.bindStoreFlg;
		storeList.forEach(function(n){
			li = $('<li class="mui-table-view-cell" data-storeId='+n.storeId+'/>')
			var contentBox = $("<div class='store-content' data-storeId="+n.storeId+"/>");
			var leftImg = "<div class='store-img'><img src="+n.img+" width = 75 height=75></div>";
			var right = $("<div class='store-desc'/>");
			var title = "<h3>"+n.businessTea+"</h3>";
			var address = "<p><span class='icon-address'>"+n.address+" 距离"+n.distance+"</p>";
			var teaDesc = "<p><span class='icon-bg'>"+n.name+"</p>";
			right.append(title,address,teaDesc);
			contentBox.append(leftImg,right);
			li.append(contentBox);
			if(bindStoreFlg == 0){
				var btn = "<div class='mui-button-row'><button class='mui-btn mui-btn-block'><span class='icon-store-manage'></span>关联门店</button></div>";
				li.append(btn);
			}
			listWapper.append(li);
		})
		
	}
	
	//构建缺省页
	
	var createNoData = function(){
		var table  = $('.mui-table-view');
		var li;
		li = $('<li class="no-store"/>')
		var noProductText = $("<p/>")
		noProductText.text("此城市当前暂无门店")
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
			pageNum =1;
			pulldownRefresh();
			mui("#store-list").pullRefresh().refresh(true);
		})		
	}
	
	$("#city").on('change',function(){
		$(".mui-table-view").html("");
		pageNum =1;
		pulldownRefresh();
		mui("#store-list").pullRefresh().refresh(true);
	})

	mui('.mui-table-view').on('tap','.mui-btn',function(){
		var _this = this;
		mui.confirm("关联门店后，不能解绑，确认绑定？"," ",["取消","确定"],function(){
				var storeId = $(_this).parents('.mui-table-view-cell').data('storeid');
				var cookieParam = getCookie();
				$.ajax({
					type:"get",
					url:REQUEST_URL+"wxmrest/bindMember",
					async:true,
					data:{
						"token":cookieParam.token,
						"mobile":cookieParam.mobile,
						"userId":cookieParam.userId,
						"storeId":storeId
					},
					dataType:"json",
					success:function(data){
						if(data.code == REQUEST_OK){
							mui.toast(data.message);
							document.location.reload();
						}else{
							mui.toast(data.message);
						}
					}
				})
		})
	
	})
	mui('.mui-table-view').on("tap",".store-content",function(){
		var id = $(this).data('storeid');
		mui.openWindow({
			url:"../store/store_list_desc.html?"+id
		})
	})
	

})()
