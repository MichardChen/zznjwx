+(function(){
    //mui初始化
    mui.init({
    	subpages:[{
    		url:"./pages/index/subindex.html",
    		id:'subindex.html',
    		styles:{
		        bottom: '51px'
		      }
    	}]
    });        

    mui.ready(function(){
    	//获取code
    	$.ajax({
			url:"https://open.weixin.qq.com/connect/oauth2/authorize",
			type:"get",
			dataType:"json",
			async:true,
			data:{
				"appid":'wxfb13c4770990aeed',
				"redirect_uri":encodeURIComponent('https://www.yibuwangluo.cn/zznjwx/wxnonAuthRest/redirectAuth'),
				"response_type":'code',
				"scope":'snsapi_base',
				"state":'STATE#wechat_redirect'
			},
			success:function(data){
				if(data.code == REQUEST_OK){
					if(pageNum==1&&data.data.messages.length == 0){
						createNoData();
						mui("#messages-list").pullRefresh().endPullupToRefresh(true);
					}else{
						var messageData = data.data;
						createListDom(messageData);
					}					
				}else{
					mui.toast(data.message)
					setTimeout(function(){
						noLoginHandle();
					}, 2000);
				}
			},
			error:function(msg){
				console.log(msg);
			}
		})
		
    	mui('.mui-bar-tab').on('tap', 'a', function(e) {	
    		if($(this).hasClass('default-index')){
    			toggleTap(this);
    		}else{
    			toggleTap(this);
				checkCookie(login); 
    		}    		              		
        })
    	
    	var url = $('.mui-iframe-wrapper').find('iframe').attr('src')
    	
    	$('.mui-bar-tab').find('a').each(function(i,n){
    		var aUrl = $(n).attr('href');
    		if(url == aUrl){
    			$('.mui-bar-tab a').removeClass('mui-active');
    			$(n).addClass("mui-active");
    		}
    	})
    	
    });
   
	var login = function(){
		mui.openWindow({
    		url:"./pages/login/login.html",
    		id:"login.html",
    		show:{
		      autoShow:true,//页面loaded事件发生后自动显示，默认为true
		      aniShow:"slide-in-down",//页面显示动画，默认为”slide-in-right“；
		      duration:100//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
		    }
        })
	}
	var toggleTap = function(targetUrl){
		$('.mui-iframe-wrapper').find('iframe').attr('src',targetUrl);
		
	}
	
})()