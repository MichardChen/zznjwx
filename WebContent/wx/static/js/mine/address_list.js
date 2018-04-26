+(function(){
	//获取cookie值
	var cookieParam = getCookie();
	//请求收货地址列表数据
	var getAddressData = function(obj){
		$.ajax({
			type:"get",
			url:REQUEST_URL+"wxmrest/queryMemberAddressList",
			data:{
				"token":cookieParam.token,
				"mobile":cookieParam.mobile,
				"userId":cookieParam.userId,
				"pageSize":obj.pageSize,
				"pageNum":obj.pageNum
			},
			async:false,
			dataType:"json",
			success:function(data){
				if(data.code == REQUEST_OK){
					var ListData =  data.data.address;
					console.log(ListData);
					if(ListData.length == 0){
						noAddressView()
					}else{
						createListDom(ListData)
					}					
				}else{
					return ;
				}
			}
		});
	}
	
	var createListDom = function(data){
		var table = $('.mui-table-view');
		data.forEach(function(n){
			var li = $('<li class="mui-table-view-cell"/>')
			var titleBox = $('<div class="name-box"/>');			
			var name = '<span class="personal_name">'+n.linkMan+'</span><span class="personal_tel">'+n.linkTel+'</span><div class="mui-pull-right"><a class="editor" data-id ='+n.addressId+'><i class="icon-eidt"></i>编辑</a><a class="delete" data-id ='+n.addressId+'><i class="icon-trash"></i>删除</a></div>';
			var desc = '<div class="address">'+(n.defaultFlg == 1 ? '<span class="default">默认</span>' : "" )+'<span class="address-desc">'+n.address+'</span></div>';				
			titleBox.html(name);
			//下拉刷新，新纪录插到最前面；
			li.append(titleBox,desc);
			table.append(li);
		})
	}
	
	var noAddressView = function(){
		var table = $('.mui-table-view');
		var li = $('<li class="mui-table-view-cell no-address"/>')
		var p = "<p>暂无收货地址</p>"
		li.html(p);
		table.append(li);
	}
	
	var paramObj = {
		id:"#address_list",
		fn:getAddressData
	}
	
	loadList(paramObj);
	
	mui('.mui-bar-tab').on('tap','.mui-btn',function(){
		
		mui.openWindow({
			url:'./new_address.html',
			id:'new_address.html'
		})
	})

	mui('.mui-table-view').on('tap','.editor',function(){
		var addressId = $(this).data("id");
		mui.openWindow({
			url:'./modify_address.html?'+addressId,
			id:'modify_address.html'
		})
	});	
	
	mui('.mui-table-view').on('tap','.delete',function(){
		var _this = this;
		var addressId = $(this).data("id");
		mui.confirm("确认删除该收货地址么？","提示",["取消","确认"],function(){
			$.ajax({
				url:REQUEST_URL + "wxmrest/deleteAddress",
				type:"post",
				data:{
					"token":cookieParam.token,
					"mobile":cookieParam.mobile,
					"userId":cookieParam.userId,
					"id":addressId
				},
				dataType:"json",
				async:true,
				success:function(data){
					if(data.code == REQUEST_OK){
						mui.toast(data.message);
						$(_this).parents(".mui-table-view-cell").remove();
					}else{
						mui.toast(data.message);
					}
				}
			})
		})
		
	});	
	
})()
