+(function(){
    //mui初始化
    mui.init({
    	subpages:[{
    		url:"./pages/subindex.html",
    		id:'subindex.html',
    		styles:{
		        bottom: '51px'
		      }
    	}]
    });        
    var aniShow = {};
    mui.ready(function(){
    	mui('.mui-bar-tab').on('tap', 'a', function(e) {
    		var targetTabClass = e.target.className;
    		console.log(e.target);
    		if(targetTabClass.indexOf("mui-active")!==-1){
    			return;
    		}
    		console.log(targetTabClass);
    		var targetClass = targetTabClass.substring()
           	var tabActive = $(e.target).find("a").attr('href');
			checkCookie(toggleTap,login);               		
        })
    });
    //自定义事件，模拟点击“首页选项卡”
    document.addEventListener('gohome', function() {
        var defaultTab = document.getElementById("defaultTab");
        //模拟首页点击
        mui.trigger(defaultTab, 'tap');
        //切换选项卡高亮
        var current = document.querySelector(".mui-bar-tab>.mui-tab-item.mui-active");
        if (defaultTab !== current) {
            current.classList.remove('mui-active');
            defaultTab.classList.add('mui-active');
        }
    });
	var login = function(){
		mui.openWindow({
    		url:"./pages/login.html",
    		id:"login.html",
    		show:{
		      autoShow:true,//页面loaded事件发生后自动显示，默认为true
		      aniShow:"slide-in-down",//页面显示动画，默认为”slide-in-right“；
		      duration:100//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
		    }
        })
	}
	var toggleTap = function(targetUrl){
		mui.openWindow({
    		url:targetUrl,
    		id:"login.html",
    		styles:{
			        bottom: '51px'
			   },
    		show:{
		      autoShow:true,//页面loaded事件发生后自动显示，默认为true
		      aniShow:"slide-in-right",//页面显示动画，默认为”slide-in-right“；
		      duration:animationTime//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
		    }
        })
	}
})()