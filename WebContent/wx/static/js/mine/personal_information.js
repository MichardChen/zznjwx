+(function(){
	mui.init();
	var getData = function(){
		var cookieParam = getCookie();
		$.ajax({
			url:REQUEST_URL+"wxmrest/queryPersonData",
			type:"get",
			dataType:"json",
			data:{
				"token":cookieParam.token,
				"mobile":cookieParam.mobile,
				"userId":cookieParam.userId,
			},
			success:function(data){
				if(data.code == REQUEST_OK){
					console.log(data);
					var personalData = data.data.member;
					fillData(personalData);
				}else{
					mui.toast(data.message);
				}
			}
		})
	}
	var fillData = function(data){
		$("#personal-img").attr('src',data.icon);
		$(".phone-num").html(data.mobile);
		$('.gender').html(data.sex == 0 ? "女":"男");
		$('.wxNo').html(data.wxNo == null ? "" : data.wxNo);
		$('.QQNo').html(data.qqNo == null ? "" : data.qqNo);
		$('.nickname').html(data.nickName);
	}

	mui.ready(function(){
		getData();
		mui(".mui-content").on('tap','.modify-Head-portrait',function(){
			mui.alert("调用摄像头接口")
		})
		mui(".mui-content").on('tap','.modify-genter',function(){
			var html='<div class="mui-input-row mui-radio mui-left"><label>男</label><input name="radio1" value=1 type="radio"></div>'
					+'<div class="mui-input-row mui-radio mui-left"><label>女</label><input name="radio1" value=0 type="radio"></div>'
			var btnArr = ['取消','确定'];
			mui.confirm(html,"请选择您的性别",btnArr,function(e){
				var sex = $('input[type=radio]:checked').val();
				var cookieParam = getCookie();
				if (e.index == 1){
					$.ajax({
						type:"post",
						url:REQUEST_URL+"wxmrest/modifySex",
						data:{
							"token":cookieParam.token,
							"mobile":cookieParam.mobile,
							"userId":cookieParam.userId,
							"sex":sex
						},
						dataType:"json",
						async:true,
						success:function(data){
							if(data.code == REQUEST_OK){
								mui.toast("保存成功");
								$('.gender').html(sex == 0 ? "女":"男");
							}else{
								mui.toast(data.message);
							}
						}
					});
				}else{
					return;
				}
				
			})
		})
		mui(".mui-content").on('tap','.modify-wechat',function(){
			var wxNo = $('.wxNo').html();
			mui.openWindow({
				url:'./subpages/modify_wechat.html?'+wxNo,
				id:'modify_wechat.html'
			})
		})
		mui(".mui-content").on('tap','.modify-QQ',function(){
			var QQNo = $('.QQNo').html();
			mui.openWindow({
				url:'./subpages/modify_QQ.html?'+QQNo,
				id:'modify_QQ.html'
			})
		})
		mui(".mui-content").on('tap','.modify-nickname',function(){
			mui.openWindow({
				url:'./subpages/modify_nickname.html',
				id:'modify_nickname.html'
			})
		})
		mui(".mui-content").on('tap','.modify-certification',function(){
			mui.alert("调用摄像头接口")
		})
		mui(".mui-content").on('tap','.modify-address',function(){
			mui.openWindow({
				url:'./subpages/address_list.html',
				id:'address_list.html'
			})
		})
	})	
})()
