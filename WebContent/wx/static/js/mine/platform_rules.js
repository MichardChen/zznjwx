+(function(){
	//请求文档内容
	var cookieParam = getCookie();
	 $.ajax({
        url:REQUEST_URL+"wxnonAuthRest/getDocumentList",
        type:"get",
        data:{
			"token":cookieParam.token,
			"mobile":cookieParam.mobile,
			"userId":cookieParam.userId,
			"typeCd":'060003'
		},
        dataType:"json",
        async:true,
        success:function(data){
            if(data.code == REQUEST_OK){
                console.log(data);
                var documents = data.data.documents; 
                createDom(documents);
            }else{
                mui.toast(data.message);
            }               
        }
    })
	 
	 //构造dom
	 var createDom = function(data){
	 	var listBox = $(".mui-table-view");
	 	data.forEach(function(n){
	 		var listItem = $("<div class='mui-table-view-cell'/>");
	 		var innerContent = "<a href = '"+n.documentUrl+"'>"+n.title+"</a>";
	 		listItem.html(innerContent);
	 		listBox.append(listItem);
	 	})
	 }
	 
	 mui(".mui-table-view").on("tap",".mui-table-view-cell",function(){
	 	var url = $(this).find("a").attr("href");
	 	var title = $(this).find("a").html();
	 	mui.openWindow({
	 		url:'./documentfile.html?'+url+'&'+title,
	 		id:'documentfile.html'
	 	})
	 })
})()
