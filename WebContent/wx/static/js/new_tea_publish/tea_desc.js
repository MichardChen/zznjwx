+(function(){
	var teaId = document.location.href.substring(document.location.href.indexOf("?")+1);
	var getTeaDescData = function(){		
		$.ajax({
			url:REQUEST_URL+"wxmrest/queryNewTeaById",
			type:"get",
			dataType:"json",
			async:true,
			data:{
				"id":teaId
			},
			success:function(data){
				if(data.code == REQUEST_OK){
					var teaDescData = data.data.tea;
					var status = teaDescData.status;
					console.log(teaDescData);
					createSlide(teaDescData);
					createCard(teaDescData);
					if(status == 090001 || status == 090003 || status == 090004){
						$('.buy-btn').addClass('mui-disabled');
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
	}
	
	 //构建轮播dom
    var createSlide = function(data){
        var SliderData = data.img;
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
            a.html("<img src="+n+">");
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
    
    //构建描述dom
    var createCard = function(data){
    	var teaName = '<span class="tea-name">'+data.name+'</span><span class="tea-num mui-pull-right">库存:'+data.stock+data.unit+'</span>'
    	$('.tea-name-box').html(teaName);
    	var teaPrice = '<span class="tea-price">'+data.price+'</span><span class="mui-pull-right tea-Num-desc">'+data.size2+'</span>';
    	$('.tea-price-box').html(teaPrice);
    	var teaDesc = '<h3>正品</h3><p>'+data.comment+'</p>';
    	$('.mui-card-footer').html(teaDesc);
    	//$('#tea-desc').attr('src',data.descUrl);
    	var imgs = data.descUrl;
    	var imgsArrya = "";
    	if(imgs){
    		var arras = imgs.split(",");
    		for(var arr in arras){
    			var ig = arras[arr];
    			if(ig){
    				imgsArrya = imgsArrya + "<img src='"+ig+"' style=\"width: 100%;\"><br/>";
    			}
    		}
    	}
    	$("#tabItem1").html(imgsArrya);
    	var tablecontent = '<tr><td width=100>品牌</td><td>'+data.brand+'</td></tr>'
    					 + '<tr><td width=100>名称</td><td>'+data.name+'</td></tr>'
    					 + '<tr><td width=100>产地</td><td>'+data.productPlace+'</td></tr>'
    					 + '<tr><td width=100>类型</td><td>'+data.type+'</td></tr>'
    					 + '<tr><td width=100>出品商</td><td>'+data.makeBusiness+'</td></tr>'
    					 + '<tr><td width=100>出产商</td><td>'+data.productBusiness+'</td></tr>'
    					 + '<tr><td width=100>生产日期</td><td>'+data.birthday+'</td></tr>'
    					 + '<tr><td width=100>规格</td><td>'+data.size+'</td></tr>'
    					 + '<tr><td width=100>出厂总量</td><td>'+data.amount+'</td></tr>'
    					 + '<tr><td width=100>发行单价</td><td>'+data.price+'</td></tr>'
    					 + '<tr><td width=100>发行时间</td><td>'+data.saleTime+'</td></tr>';
    	$('.mui-table').html(tablecontent);
    					 
    }	
    
    var setIframeHeight = function(iframe) {
		if (iframe) {
			var iframeWin = iframe.contentWindow || iframe.contentDocument.parentWindow;
			if (iframeWin.document.body) {
				iframe.height = iframeWin.document.documentElement.scrollHeight || iframeWin.document.body.scrollHeight;
			}
		}
	};

    mui(".mui-bar-tab").on("tap",".service",function(){
    	mui.confirm("","400 611 9529",["取消","呼叫"]);
    })
    
    mui(".mui-bar-tab").on("tap",".buy-btn",function(){
    	mui.openWindow({
    		url:'./select_spec.html?'+teaId,
    		id:'select_spec.html'
    	})
    })
    
	mui.ready(function(){
		getTeaDescData();
	})
	
})()
