//常量定义

var REQUEST_URL = 'http://www.yibuwangluo.cn/zznjwx/';
//var REQUEST_URL = 'http://192.168.1.91:8088/zznjwx/';
var REQUEST_OK = 5600;


//复用函数

	//密码设置为显示
	var setPasswordState = function(){
		var flag = $('.triggle-show').attr('data-status');
		if(flag !='noshow'){
			$('.triggle-show').attr('data-status','noshow');
			$('.triggle-show i').removeClass('icon-show');
			$('.triggle-show i').addClass('icon-noshow');
			$('.password-satus').attr('type','password');
		}else{
			$('.triggle-show').attr('data-status','show');
			$('.triggle-show i').removeClass('icon-noshow');
			$('.triggle-show i').addClass('icon-show');
			$('.password-satus').attr('type','text');
		}
	}
	mui('.page-container').on('click','.triggle-show',function(){
	setPasswordState();
	})
	
	function setCookie(cookieObj,exdays){
	    var d = new Date();
	    d.setTime(d.getTime()+(exdays*60*60*1000));
	    var expires = "expires="+d.toGMTString();
	    var jsonParam = JSON.stringify(cookieObj);
	    document.cookie = "userData="+jsonParam+";"+expires+";path=/";
	}
	
	function getCookie(){
		var cookieParam,name = "userData=" ;
	    var ca = document.cookie.split(';');
	    for(var i=0; i<ca.length; i++) {
	        var c = ca[i].trim();
	        if (c.indexOf(name)==0) { cookieParam = c.substring(name.length,c.length);}
	    }
	    return JSON.parse(cookieParam);
	}
	
	function checkCookie(fn){
	    var cookie = document.cookie
	    if (cookie!=""){
	       return getCookie();
	    }
	    else {
			fn();
	    }
	}

	function loadList(obj){
		var id = obj.id;
		var fn = obj.fn;
		mui.init({
			pullRefresh: {
				container: id,
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
				
		/**
		 * 下拉刷新具体业务实现
		 */
		var pageSize = 10;
		var pageNum = 1;
		
		function pulldownRefresh() {
			setTimeout(function() {	
				pageNum = 1;
				$('.mui-table-view').html("");
				obj.pageSize = pageSize;
				obj.pageNum = pageNum;
				fn(obj);
				mui(id).pullRefresh().endPulldownToRefresh(); //refresh completed
				pageNum++;
			}, 500);
		}
		var count = 0;
		
		/**
		 * 上拉加载具体业务实现
		 */
		function pullupRefresh() {
			setTimeout(function() {																
				if(obj.fresh){
					pulldownRefresh();
				}else{
					obj.pageSize = pageSize;
					obj.pageNum = pageNum;
					fn(obj);
					pageNum++;	
				}
			mui(id).pullRefresh().endPullupToRefresh(); //参数为true代表没有更多数据了。
			}, 500);
		}

		mui.ready(function() {
			mui(id).pullRefresh().pullupLoading();
		});
	}
