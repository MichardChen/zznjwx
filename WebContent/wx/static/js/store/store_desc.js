+(function(){
	//请求列表数据
	var getListData = function(){
		var cookieParam = checkCookie();
		$.ajax({
			type:"get",
			url:REQUEST_URL+"wxmrest/queryMemberStoreDetail",
			async:true,
			data:{
				"token":cookieParam.token,
				"mobile":cookieParam.mobile,
				"userId":cookieParam.userId
			},
			dataType:"json",
			success:function(data){
				if(data.code == REQUEST_OK){
					console.log(data.data);
					var store = data.data.store;
					var evaluateList = data.data.evaluateList;
					$(".phone").attr("data-mobile",store.mobile);
					$('.store-name').html(store.name);
					$(".address-desc").html(store.address);
					createsliderDom(store.imgs);
					$('.bussiness-time').html("营业时间：周一到周日 "+store.businessFromTime+"--"+store.businessToTime);
					$('.store-desc').html(store.storeDesc);
					createEvaluateList(evaluateList);
					createMap(store);
				}else{
					mui.toast(data.message);
				}
			}
		});
	}
	
	getListData();
	
	
	//初始化配置
	$.ajax({
		url : REQUEST_URL + "wxmrest/getData1",
		type : "get",
		dataType : "json",
		async : true,
		data : {},
		success : function(data) {
			if (data.code == REQUEST_OK) {
				var timestamp = data.data.timestamp;
				var appId = data.data.appId;
				var nonceStr = data.data.nonceStr;
				var signature = data.data.signature;
				//alert(timestamp+","+appId+","+nonceStr+","+signature);
				//JSSDK配置参数 通过config接口注入权限验证配置
				wx.config({
					debug : false,
					appId : appId,
					timestamp : timestamp,
					nonceStr : nonceStr,
					signature : signature,
					jsApiList : [ 'checkJsApi', 'onMenuShareTimeline',
							'onMenuShareAppMessage', 'onMenuShareQQ',
							'onMenuShareWeibo', 'hideMenuItems',
							'showMenuItems', 'hideAllNonBaseMenuItem',
							'showAllNonBaseMenuItem', 'translateVoice',
							'startRecord', 'stopRecord', 'onRecordEnd',
							'playVoice', 'pauseVoice', 'stopVoice',
							'uploadVoice', 'downloadVoice', 'chooseImage',
							'previewImage', 'uploadImage', 'downloadImage',
							'getNetworkType', 'openLocation',
							'getLocation', 'hideOptionMenu',
							'showOptionMenu', 'closeWindow', 'scanQRCode',
							'chooseWXPay', 'openProductSpecificView',
							'addCard', 'chooseCard', 'openCard' ]
				});
			}
		},
		error : function(msg) {
			//console.log(msg);
		}
	})

	var createsliderDom = function(data){
		var slider = $('.mui-slider-group');
		data.forEach(function(n){
			var img = '<a><img src="'+n+'" width=75 height=75 data-preview-src=""  data-preview-group="1"></a>';
			slider.append(img);
		})
	}
	
	var computedStar = function(scroe){
		var html="";
		for(var i =1;i<=5;i++){
			if(i<=scroe){
				html+='<span class="icon-star"></span>';
			}else{
				html+='<span class="icon-star-c"></span>';
			}
		}
		return html;
	}
	
	var createEvaluateList = function(data){
		var list = $('.evaluate-content');
		data.forEach(function(n){
			var li = $('<li/>');
			var user = $('<div class="user"/>');
			var userimg = '<a class="user-img"><img src='+n.icon+' width=50 height=50 ></a>';
			var userName = '<div class="user-desc"><h3>'+n.userName+'</h3><p class="evaluate">评分 '+computedStar(n.point)+'<span class="mui-pull-right">'+n.createDate+'</span></p></div>';
			user.html(userimg+userName);
			var evaluate = $('<p class="valuate-text">'+n.comment+'</p>')
			li.append(user,evaluate);
			list.append(li);			
		})		
	}
	
	var createMap = function(data){
		var latitude = data.latitude;
		var longitude = data.longitude;
		
		var map = new AMap.Map("map", {
        resizeEnable: true,
        center: [longitude, latitude],//地图中心点
        zoom: 18 //地图显示的缩放级别,
	    });
	    
	    //添加点标记，并使用自己的icon
	    var marker = new AMap.Marker({
	        map: map,
			position: [longitude, latitude],
	        icon: new AMap.Icon({            
	            size: new AMap.Size(30, 63),  //图标大小
	            image: "http://app.tongjichaye.com:88/common/location.png",
	            imageOffset: new AMap.Pixel(0, 0)
			}),
			label: {
				offset: new AMap.Pixel(-75, -40),//修改label相对于maker的位置
				content: "<div class='goMap'><div class='store-address'><strong>"+$('.store-name').html()+"</strong><br>"+$(".address-desc").html()+"</div><button class='go-map'>去导航</button></div>"
			}         
	    });
	    
		marker.on('click',function(e){
			$('.amap-marker-label').show()
			mui('.amap-marker-label').on("tap",'.go-map',function(){
				wx.openLocation({
					latitude : latitude,
					longitude : longitude,
					name : $('.store-name').html(), //要写引号
					address : $(".address-desc").html(), //要写引号
					scale : 15,
					infoUrl : "http://www.baidu.com" //要写引号
				}); 
				
				/*mui.openWindow({
					url:'http://uri.amap.com/navigation?to='+longitude+','+latitude+','+$(".address-desc").html()+'&via='+longitude+','+latitude+'&mode=car&src=nyx_super'
				})*/
			})	      
		})
		
    
		AMap.plugin(['AMap.ToolBar','AMap.Scale'],function(){
			var toolBar = new AMap.ToolBar();
			var scale = new AMap.Scale();
			map.addControl(toolBar);
			map.addControl(scale);
		})  
	    
	}
	
	mui(".mui-table-view-cell").on('tap','.phone',function(){
		var mobile = $(this).attr("data-mobile");
		mui.confirm(mobile,' ',["取消","呼叫"]);
	})
	
	mui.previewImage();
	
	

})()

wx.ready(function() {});
wx.error(function(res) {alert(res.errMsg);});
