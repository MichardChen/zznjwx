+(function(){
    //请求首页的数据
    var getSubIndexData = function(){
        var indexData;
        $.ajax({
            url:REQUEST_URL+"wxnonAuthRest/index",
            type:"get",
            dataType:"json",
            async:false,
            success:function(data){
                if(data.code == REQUEST_OK){
                    indexData = data.data;
                }else{
                    mui.toast(data.message)
                }
            }
        })
        return indexData;
    };

    //构建轮播dom
    var createSlide = function(){
        var SliderData = getSubIndexData().carousel;
        var Slider = $("#slider");
        var sliderBox = $("<div class='mui-slider-group mui-slider-loop'/>");
        var dotsbox = $("<div class='mui-slider-indicator'/>");
        $(SliderData).each(function(i,n){
            var sliderItem,dot;
            if(i == 0){
                sliderItem = $("<div class='mui-slider-item mui-slider-item-duplicate'/>")
                dot = $("<div class='mui-indicator mui-active'/>")
            }else{
                sliderItem = $("<div class='mui-slider-item'/>")
                dot = $("<div class='mui-indicator'/>")
            }
            var a  = $("<a href='#'/>")
            a.html("<img src="+n.imgUrl+">");
            sliderItem.html(a);
            sliderBox.append(sliderItem);
            dotsbox.append(dot);
        })
        Slider.append(sliderBox,dotsbox);
    }
    //构建列表dom
    var createList = function(){
    	var data = getSubIndexData();
    	var table = $('.mui-table-view');
    	for (var i = 0; i < data.news.length; i++) {
			var li = $('<li class="mui-table-view-cell"/>')
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
     //初始化
     mui.ready(function(){
        createSlide();
        createList();
        mui("#slider").slider({ //自动轮播
            interval: 5000
        })  
    })

})()

