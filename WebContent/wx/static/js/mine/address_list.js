+(function(){
	//初始化mui
	mui.init({
		pullRefresh: {
			container: "#address_list",
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
			getAddressData(pageSize,pageNum);			
			mui("#address_list").pullRefresh().endPulldownToRefresh(); //refresh completed
			pageNum++;
		}, 500);
	}
	
	/**
	 * 上拉加载具体业务实现
	 */
	function pullupRefresh() {
		setTimeout(function() {	
		mui("#address_list").pullRefresh().endPullupToRefresh(); //参数为true代表没有更多数据了。
		getAddressData(pageSize,pageNum);
		pageNum++;		
		}, 500);
	}
	mui.ready(function(){
		mui("#address_list").pullRefresh().pullupLoading();
	})		
	
	
	//获取cookie值
	var cookieParam = getCookie();
	//请求收货地址列表数据
	var getAddressData = function(pageSize,pageNum){
		$.ajax({
			type:"get",
			url:REQUEST_URL+"wxmrest/queryMemberAddressList",
			data:{
				"token":cookieParam.token,
				"mobile":cookieParam.mobile,
				"userId":cookieParam.userId,
				"pageSize":pageSize,
				"pageNum":pageNum
			},
			async:false,
			dataType:"json",
			success:function(data){
				if(data.code == REQUEST_OK){
					var ListData =  data.data.address;
					console.log(ListData);
					if(pageNum==1 && ListData.length == 0){
						$('.no-address').show();
						$('#address_list').hide();
					}else{
						$('.no-address').hide();
						$('#address_list').show();
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
