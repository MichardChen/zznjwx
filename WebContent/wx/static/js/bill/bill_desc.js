+(function(){
	
	//请求数据
	
	var param = document.location.href.indexOf('?')== -1 ? "": document.location.href.substring(document.location.href.indexOf('?')+1);
	
	var paramArr = param.split("&");
	
	var billId = paramArr[0];
	
	var typeCd = paramArr[1];
	
	
	var getBillData = function(pageNum,obj){
		var cookieParam = getCookie();
		$.ajax({
			url:REQUEST_URL+"wxmrest/queryCheckOrderDetail",
			type:"get",
			dataType:"json",
			async:true,
			data:{
				"token":cookieParam.token,
				"mobile":cookieParam.mobile,
				"userId":cookieParam.userId,
				"id":billId,
				"typeCd":typeCd
			},
			success:function(data){
				if(data.code == REQUEST_OK){
					console.log(data);	
					var billDesc = data.data.data;
					$(".bill-type").html(billDesc.type);
					$(".bill-desc-text").html(billDesc.moneys);
					$('.bill-time-desc').html(billDesc.date);
					$(".bill-note-text").html(billDesc.content)
				}else{
					mui.toast(data.message);
					setTimeout(function(){
						noLoginHandle();
					}, 2000);
				}
			},
			error:function(msg){
				console.log(msg);
			}
		})
	}
	
	mui.ready(function(){
		getBillData()
	})
	
	
	
	
	
	
	
	
})()
