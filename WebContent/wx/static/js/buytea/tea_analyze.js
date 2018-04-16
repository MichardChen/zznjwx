$(function(){
	var id = parseInt(document.location.href.substr(document.location.href.indexOf("?")+1));
	$('#subpages').attr('src','./subpages/tea_market.html?'+id);
	
	$('.mui-bar').on('tap','.mui-control-item',function(){
		$('#subpages').attr('src',this+'?'+id);
	})
	var timer=setTimeout(function(){
		var descUrl = $(window.frames["subpages"].document).find("#paramInput").val();
		$('#descUrl').val(descUrl);
		if(descUrl){
			clearTimeout(timer);
		}
		console.log(descUrl);
	},1000)
	
})