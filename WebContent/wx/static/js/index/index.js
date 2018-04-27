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