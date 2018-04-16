+(function(){
    //请求首页的数据
    var getSubIndexData = function(){
        $.ajax({
            url:REQUEST_URL+"wxnonAuthRest/index",
            type:"get",
            dataType:"json",
            async:true,
            success:function(data){
                if(data.code == REQUEST_OK){
                    var indexData = data.data;
                    createSlide(indexData);
                    createList(indexData);
                }else{
                    mui.toast(data.message)
                }
            },
            error:function(err){
            	console.log(err);
            }
        })
    };

 //构建轮播dom
    var createSlide = function(data){
        var SliderData = data.carousel;
        var Slider = $("#slider");
        var sliderBox = $("<div class='mui-slider-group mui-slider-loop'/>");
        var dotsbox = $("<div class='mui-slider-indicator'/>");
        $(SliderData).each(function(i,n){
            var sliderItem =  $("<div class='mui-slider-item'/>");
            var dot;
            if(i == 0){
                dot = $("<div class='mui-indicator mui-active'/>")
            }else{
                dot = $("<div class='mui-indicator'/>")
            }
            var a  = $("<a href='#'/>")
            a.html("<img src="+n.imgUrl+">");
            sliderItem.html(a);
            sliderBox.append(sliderItem);
            dotsbox.append(dot);
        })
        Slider.append(sliderBox,dotsbox);
        var lastItem = $('.mui-slider-item:first-child').clone(true);
        lastItem.addClass('mui-slider-item-duplicate');
         $('.mui-slider-group').append(lastItem);
		var firstItem = $('.mui-slider-item:last-child').clone(true);
        firstItem.addClass('mui-slider-item-duplicate');
        $('.mui-slider-group').prepend(firstItem);
        
         mui("#slider").slider({ //自动轮播
            interval: 5000
        })  
    }
  
    //构建列表dom
    var createList = function(data){
    	var table = $('.mui-table-view');
    	for (var i = 0; i < data.news.length; i++) {
			var li = $('<li class="mui-table-view-cell information"/>')
			var titleBox = $('<div class="title-box"/>');
			var imgBox = $('<div class="img-box"/>');
			imgBox.html('<img src="'+data.news[i].img+'" width=100 height=60>');
			var title = '<a class="title" href='+data.news[i].shareUrl+'>'+data.news[i].title+'</a>';
			var desc = '<div class="desc"><span class="information-type">'+data.news[i].type+'</span><span class="time">'+data.news[i].date+'</span></div>';
			titleBox.html(title+desc);
			//下拉刷新，新纪录插到最前面；
			li.append(titleBox);
			li.append(imgBox);
			table.append(li);
		}
    }
    
    var login = function(){
		mui.openWindow({
    		url:"../login/login.html",
    		id:"login.html",
    		show:{
		      autoShow:true,//页面loaded事件发生后自动显示，默认为true
		      aniShow:"slide-in-down",//页面显示动画，默认为”slide-in-right“；
		      duration:100//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
		    }
        })
	}
     //初始化
     mui.ready(function(){
        getSubIndexData();       
        mui('.mui-bar').on('click','.icon-box',function(){
        	var cookie = checkCookie(login);
        	if(cookie){
        		mui.openWindow({
        			url:"./message.html",
		    		id:"message.html",
		    		show:{
				      autoShow:true,//页面loaded事件发生后自动显示，默认为true
				      aniShow:"slide-in-right",//页面显示动画，默认为”slide-in-right“；
				      duration:100//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
				    }
        		})
        	}
        })
        mui('.mui-table-view-cell').on('tap','.more',function(){
        	mui.openWindow({
        		url:"./information.html",
	    		id:"information.html",
	    		show:{
			      autoShow:true,//页面loaded事件发生后自动显示，默认为true
			      aniShow:"slide-in-right",//页面显示动画，默认为”slide-in-right“；
			      duration:100//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
			    }
        	})
        })
        
        mui('.mui-table-view').on('tap','.information',function(){
        	var url = $(this).find('a').attr('href');
        	mui.openWindow({
        		url:"./information_desc.html?"+url,
	    		id:"information.html",
	    		show:{
			      autoShow:true,//页面loaded事件发生后自动显示，默认为true
			      aniShow:"slide-in-right",//页面显示动画，默认为”slide-in-right“；
			      duration:100//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
			    }
        	})
        	
        })
        
        mui('.nav-bar').on('tap','.tea-publish',function(){
        	var cookieParam = checkCookie(login);
        	var html = "<iframe src='./message.html'></iframe>";
		        	 jqalert({
				        content: html,
				        yestext: '同意并继续',
				        notext: '取消',
				        yesfn:function(){
				        	mui.openWindow({
				        		url:"../new_tea_publish/new_tea_publish.html",
				        		id:'new_tea_publish.html'
				        	})
				        }
				    })
        	/*$.ajax({
        		url:REQUEST_URL+'wxnonAuthRest/queryDocument',
        		type:"get",
        		dataType:"json",
        		data:{
        			"token":cookieParam.token,
					"mobile":cookieParam.mobile,
					"userId":cookieParam.userId,
        			"typeCd":'060011'
        		},
        		success:function(data){
        			console.log(data);
        			
        		}
        	})*/
        	
        })
         mui('.nav-bar').on('tap','.buy-tea',function(){
        	var cookieParam = checkCookie(login);
        	var html = "<iframe src='./message.html'></iframe>";
		        	 jqalert({
				        content: html,
				        yestext: '同意并继续',
				        notext: '取消',
				        yesfn:function(){
				        	mui.openWindow({
				        		url:"../buytea/tea_list.html",
				        		id:'tea_list.html'
				        	})
				        }
				    })
        	/*$.ajax({
        		url:REQUEST_URL+'wxnonAuthRest/queryDocument',
        		type:"get",
        		dataType:"json",
        		data:{
        			"token":cookieParam.token,
					"mobile":cookieParam.mobile,
					"userId":cookieParam.userId,
        			"typeCd":'060011'
        		},
        		success:function(data){
        			console.log(data);
        			
        		}
        	})*/
        	
        })
    })

})()

