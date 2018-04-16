+(function(){
	
	var getbuyTeaData = function(obj){
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
				'pageSize':obj.pageSize,
				'pageNum':obj.pageNum,
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
	
	var id = parseInt(document.location.href.substr(document.location.href.indexOf("?")+1));
	
  	var paramObj = {
  		id:"#buytea-list",
  		fn:getbuyTeaData,
  		teaId:id,
  		priceFlg:2,
  		wareHouseId:0,
  		quality:2,
  		size:150001
  	}
	
	loadList(paramObj);
	
	$('.mui-bar').on('tap','.piece-size',function(){
		var size = $(this).data('size');
		var priceFlag = $('.options .price .mui-active').data('priceFlag');
		var quality = $('.options .count .mui-active').data('quality');
		paramObj.priceFlg = priceFlag;
		paramObj.quality = quality;
		paramObj.size = size;
		paramObj.fresh = true;
		loadList(paramObj);
	})
	$('.mui-bar').on('tap','.filter-option',function(e){
		$('.options').toggle();
	})
	$('.options').on('tap','.price span',function(){
		$(".price span").removeClass('mui-active');
		$(this).addClass('mui-active');
	})
	$('.options').on('tap','.count span',function(){
		$(".count span").removeClass('mui-active');
		$(this).addClass('mui-active');
	})
	
	$('.options').on('tap','.reset',function(){
		$(".price span").removeClass('mui-active');
		$(".price span").eq(0).addClass('mui-active');
		$(".count span").removeClass('mui-active');
		$(".count span").eq(0).addClass('mui-active');
	})
	
	$('.options').on('tap','.sure',function(){
		var size = $('.piece-size.mui-active').data('size');
		var priceFlag = $('.options .price .mui-active').data('priceFlag');
		var quality = $('.options .count .mui-active').data('quality');
		paramObj.priceFlg = priceFlag;
		paramObj.quality = quality;
		paramObj.size = size;
		paramObj.fresh = true;
		loadList(paramObj);
	})
	
	
})()
