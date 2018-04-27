+(function(){
	
	var getbuyTeaData = function(obj){
		var cookieParam = getCookie();
		$.ajax({
			url:REQUEST_URL+"wxmrest/queryTeaAnalysis",
			type:"get",
			dataType:"json",
			async:true,
			data:{
				"token":cookieParam.token,
				"mobile":cookieParam.mobile,
				"userId":cookieParam.userId,
				'teaId':obj.teaId
			},
			success:function(data){
				if(data.code == REQUEST_OK){
					var teaData = data.data;
					console.log(teaData);
					var priceChartData = teaData.priceTrend;
					var amountChartData = teaData.bargainTrend;
					var descData = teaData.data;
					$('.amout').text(teaData.allQuality+"片");
					$('.price').text((teaData.allAmount == null ? 0 :teaData.allAmount)+"元");
					createChart("lineChart",priceChartData);
					createChart("amountChart",amountChartData);
					createTbody(descData);
				}else{
					mui.toast(data.message)
				}
			},
			error:function(msg){
				console.log(msg);
			}
		})
	}
	
	var id = parseInt(document.location.href.substr(document.location.href.indexOf("?")+1));
	
  	var paramObj = {
  		id:"#buytea-list",
  		fn:getbuyTeaData,
  		teaId:id 		
  	}
	
	getbuyTeaData(paramObj);
	
	
	
	
	var createChart = function(id,data){
		var x=[];y=[],lineData=[];
		var min=0,max;
		data.forEach(function(n){
			if(max==undefined){
				max = n.value;
			}else{
				if(n.value>=max){
					max = n.value;
				}
			}			
			lineData.push(n.value);
			x.push(n.key.substr(n.key.indexOf('-')+1));
		})
		
		var step = Math.round((max-min)/5);
		
		for(var i=0 ; i<5; i++){
			if(i==0){
				min=min;
			}else{
				min = min+step;	
			}			
			y.push(min);
		}
				
		var chartOption =  {
			grid: {
				x: 35,
				x2: 10,
				y: 30,
				y2: 25
			},
			calculable: false,
			xAxis: [{
				type: 'category',
				data: x
			}],
			yAxis: [{
				type: 'value',
				splitArea: {
					show: true
				},
				data:y
			}],
			series: [{
				name: '走势图',
				type: 'line',
				data: lineData
			}] 
		};
		
		var byId = function(id) {
		return document.getElementById(id);
	};	
	var lineChart = echarts.init(byId(id));
	lineChart.setOption(chartOption);
	}
	
	var createTbody = function(data){
		var tbody = $('.table-tbody');
		data.forEach(function(n){
			var tr = $("<tr/>")
			var td = "<td>"+n.date+"</td><td>"+n.amount+"</td><td>"+n.quality+"</td>"
			tr.html(td);
			tbody.append(tr);
		})
	}
	
})()
