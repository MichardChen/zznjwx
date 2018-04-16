+(function(){

    //mui初始化
    mui.init();

    //数据填充

    var createDom = function(data){
        var store = data.store;
        var evaluateList = data.evaluateList;
        var storeName = store.name;
        var storeAddress = store.address;
        var storeImgs = store.imgs;
        $('.store-address .name').html(storeName);
        $('.store-address .address-desc').html(storeAddress);
        

    }

    //请求数据

    var getStoreData = function(){
        //获取cookie参数
        var cookieParam = checkCookie();
        $.ajax({
            url:REQUEST_URL+"wxmrest/queryMemberStoreDetail",
            type:"get",
            data:{
				"token":cookieParam.token,
				"mobile":cookieParam.mobile,
				"userId":cookieParam.userId,
			},
            dataType:"json",
            async:true,
            success:function(data){
                if(data.code == REQUEST_OK){
                    console.log(data);
                    var personal_data = data.data.member;
                    filledPersonalData(personal_data);    
                }else{
                    mui.toast(data.message);
                }               
            }
        })
    }



})()