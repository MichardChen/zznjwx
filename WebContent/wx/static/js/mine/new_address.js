+(function(){
	
	mui.init();
	//三级联动
	
	mui.ready(function(){
		
		var _getParam = function(obj, param) {
			return obj[param] || '';
		};
		//级联示例
		var cityPicker3 = new mui.PopPicker({
			layer: 3
		});
		cityPicker3.setData(cityData3);
		var showCityPickerinput = document.getElementById('address');
		showCityPickerinput.addEventListener('tap', function(event) {
			cityPicker3.show(function(items) {
				showCityPickerinput.value = _getParam(items[0], 'text') + " " + _getParam(items[1], 'text') + " " + _getParam(items[2], 'text');
				//返回 false 可以阻止选择框的关闭
				//return false;
				showCityPickerinput.setAttribute("data-id",_getParam(items[0], 'value') + ";" + _getParam(items[1], 'value') + ";" + _getParam(items[2], 'value'))
			});
		}, false);
		
		//字段数据收集，校验
		
		var collectParam = function(){
			var name = document.querySelector(".name").value;
			var phone = document.querySelector('.phone').value;
			var linkage = document.querySelector('#address').value;
			var address_desc = document.querySelector('.address-desc').value;
			if(name == ""){
				mui.confirm("请输入收货人姓名");
				return;
			}
			if(phone == ""){
				mui.confirm("请输入联系电话");
				return;
			}
			if(linkage ==""){
				mui.confirm("请选择省市区");
				return;
			}
			if(address_desc == ""){
				mui.confirm("请输入详细地址");
				return;
			}
			var linkAgeId = document.querySelector('#address').getAttribute("data-id");
			var linkAgeIdArr = linkAgeId.split(";");
			if(linkAgeIdArr.length !== 0){
				var provinceId = linkAgeIdArr[0];
				var cityId = linkAgeIdArr[1];
				var districtId = linkAgeIdArr[2];
			}
			var inputSelect = document.querySelector(".mui-radio");
			var flg = inputSelect.checked ? 1 : 0;
			var cookieParam = getCookie();
			
			$.ajax({
				url:REQUEST_URL + "wxmrest/saveAddress",
				type:"post",
				data:{
					"token":cookieParam.token,
					"mobile":cookieParam.mobile,
					"userId":cookieParam.userId,
					"provinceId":provinceId,
					"cityId":cityId,
					"linkMan":name,
					"mobile":phone,
					"districtId":districtId,
					"address":address_desc,
					"flg":flg
				},
				dataType:"json",
				async:true,
				success:function(data){
					if(data.code == REQUEST_OK){
						mui.toast(data.message);
						setTimeout(function(){
							mui.back();
						}, 2000);
					}else{
						mui.toast(data.message);
					}
				}
			})
			
			
			
		}
		
		mui(".mui-bar-nav").on("tap",".mui-btn",function(){
			collectParam();
		})
		
		mui(".mui-checkbox").on("change",".mui-radio",function(){
			var flag = this.checked ? true : false;
			if(flag){
				mui.confirm("确定设置为默认收货地址？","提示",["取消","确定"]);
			}else{
				mui.confirm("确定取消设置默认地址","提示",["取消","确定"]);
			}
		})
		
	})	
})()
