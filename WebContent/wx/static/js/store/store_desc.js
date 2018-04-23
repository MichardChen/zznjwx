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
	
	var createsliderDom = function(data){
		var slider = $('.mui-slider-group');
		data.forEach(function(n){
			var img = '<a><img src="'+n+'" width=75 height=75 ></a>';
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
			var userimg = '<a class="user-img"><img src='+n.icon+' width=50 height=50></a>';
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
        zoom: 18 //地图显示的缩放级别
	    });
	    //添加点标记，并使用自己的icon
	    new AMap.Marker({
	        map: map,
			position: [longitude, latitude],
	        icon: new AMap.Icon({            
	            size: new AMap.Size(40, 50),  //图标大小
	            image: "http://webapi.amap.com/theme/v1.3/images/newpc/way_btn2.png",
	            imageOffset: new AMap.Pixel(0, -60)
	        })        
	    });
	}
	
	
})()
