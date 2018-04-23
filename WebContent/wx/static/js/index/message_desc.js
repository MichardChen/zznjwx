+(function(){
	var msgid = document.location.href.indexOf('?')== -1 ? "": document.location.href.substring(document.location.href.indexOf('?')+1);
	var cookieParam = getCookie();
	$.ajax({
		type:"get",
		url:REQUEST_URL+"wxmrest/queryMessageListDetail",
		async:true,
		data:{
			"token":cookieParam.token,
			"mobile":cookieParam.mobile,
			"userId":cookieParam.userId,
			"messageId":msgid
		},
		success:function(data){
			console.log(data);
			if(data.code == REQUEST_OK){
				var messageDetail = data.data.messageDetail;
				$('.tea-name').html(messageDetail.title);
				$('.price').html(messageDetail.price);
				$('.count').html(messageDetail.quality);
				$('.total-price').html(messageDetail.bargainAmount);
				$('.total-pay').html(messageDetail.payAmount);
				$('.cretae-time').html(messageDetail.createTime);
				$('.pay-time').html(messageDetail.payTime);
			}
		}
	});	
})()
