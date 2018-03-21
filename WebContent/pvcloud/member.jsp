<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<!DOCTYPE html>
<html>
<head>
<title>用户管理</title>
<%@include file="../common/header.jsp"%>
<link href="${CONTEXT_PATH}/assets/css/animate.css" rel="stylesheet">
<link type="image/x-icon" rel="shortcut icon" href="${CONTEXT_PATH}/assets/img/tjico.ico" />
<link href="${CONTEXT_PATH}/assets/css/starCore.css" rel="stylesheet">
<link href="${CONTEXT_PATH}/assets/css/common.css" rel="stylesheet">
<script src="${CONTEXT_PATH}/assets/lib/jquery-2.1.1.min.js"></script>
<script src="${CONTEXT_PATH}/assets/js/common.js"></script>
<script type="text/javascript">
var str='${message}';
if(str!=''){
  alert(str);
}

function loadProject(data){
	if(data==0){
		$(".modal-title").html("新增");
	}else{
		$(".modal-title").html("修改");
	}
	$.ajax({
		url : "${CONTEXT_PATH}/memberInfo/alter",
		data : {id:data},
		dataType : "html",
		success : function(result){
			$('.modal-body').html(result);
		}
	});
}
function loadProject1(data){
	$(".modal-title").html("查看");
	$.ajax({
		url : "${CONTEXT_PATH}/memberInfo/see",
		data : {id:data},
		dataType : "html",
		success : function(result){
			$('.modal-body').html(result);
		}
	});
}

function openStore1(data){
	$(".modal-title").html("新增");
	$.ajax({
		url : "${CONTEXT_PATH}/storeInfo/addStoreInit",
		data : {id:data},
		dataType : "html",
		success : function(result){
			$('#model3').html(result);
		}
	});
}

function openStore2(data){
	if(data==0){
		$(".modal-title").html("新增");
	}else{
		$(".modal-title").html("修改");
	}
	$.ajax({
		url : "${CONTEXT_PATH}/storeInfo/alter",
		data : {'id':data},
		dataType : "html",
		success : function(result){
			$('#model4').html(result);
		}
	});
}
function check(){
	
	//门店名称
	var storeName = $("#storeName1").val();
	if(storeName == ""){
		 alert("请输入门店名称");
		 return false;
	}
	//所属地区
	/* var province = $("#province").val();
	var city = $("#city").val();
	var district = $("#district").val();
	if(province == "" || province == 0 || city == "" || city == 0 || district == "" || district == 0){
		 alert("请选择所属地区");
		 return false;
	} */
	var cityDistrict = $("#cityDistrict").val();
	if(cityDistrict == ""){
		 alert("请输入所属地区");
		 return false;
	}
	//门店地址
	var address = $("#address").val();
	if(address == ""){
		 alert("请输入门店地址");
		 return false;
	}
	//经纬度
	var longtitude = $("#longtitude").val();
	var latitude = $("#latitude").val();
	if(longtitude == "" || latitude == ""){
		 alert("请输入经纬度");
		 return false;
	}
	//主营茶叶
	var bussineeTea = $("#bussineeTea").val();
	if(bussineeTea == ""){
		 alert("请输入主营茶叶");
		 return false;
	}
	//营业时间
	var bussineeFromTime = $("#fromTime").val();
	var bussineeToTime = $("#toTime").val();
	if(bussineeFromTime == "" || bussineeToTime == ""){
		 alert("请输入营业时间");
		 return false;
	}
	//联系电话
	var mobile = $("#mobile1").val();
	if(mobile == ""){
		 alert("请输入联系电话");
		 return false;
	}
	//门店详情
	/* var storeDetail = $("#storeDetail").val();
	if(storeDetail == ""){
		 alert("请输入门店详情");
		 return false;
	} */
	//至少输入一张图片	
	var img1 = $("#img1").val();
	var img2 = $("#img2").val();
	var img3 = $("#img3").val();
	var img4 = $("#img4").val();
	var img5 = $("#img5").val();
	var img6 = $("#img6").val();
	if((img1 == "") && (img2 == "")  && (img3 == "") && (img4 == "") && (img5 == "") && (img6 == "")){
		 alert("请至少输入一张图片");
		 return false;
	}
	$("#saveBtn").attr("disabled","true");
	return true;
}
function exportData(){
	if(confirm('确认要导出数据?')){
		var cname = $("#cname").val();
		var mobile = $("#mobile").val();
		var type = $("#type").val();
		var storeName = $("#storeName").val();
		var status = $("#status").val();
		var params = "?cname="+cname+"&cmobile="+mobile+"&type="+type+"&storeName="+storeName+"&status="+status;
		window.location.href="${CONTEXT_PATH}/memberInfo/exportData"+params;
	}else{
		return false;
	}
}
</script>
<style>
.ys1{
	height:30px;
}
.ys2{
	background-image:url("${CONTEXT_PATH}/image/search.png");
	width:43px;
	height:32px;
	border:0;
}
.ys3{
	width:80px;
	height:32px;
	border:1px solid #dddddd;
	background-color:#0099cc;
	color:#fff;
}
a:hover{
	text-decoration:none!important;
}
.control-group td{
	border:0!important;
}
.span a{
	color:black!important;
}
.btn-color{
	background-color:transparent;
	border:0;
}
th{
	white-space:nowrap;
	text-align: left;
}
td{
	white-space:nowrap;
	border:0!important;
	text-align: left;
}
.table thead tr{
	background-color:#F5F6FA;
	color:#999;
}
.table thead tr a{
	color:#999;
}
.table thead tr a:hover{
	text-decoration:underline!important;
}
#botton a{
	color:#000;
}
.table tbody{
	margin-top:5px;
}
.bOrder:hover{
	background-color:#e4f6f6;
}
.bg{
	background-color:#e4f6f6;
}
.fl{
	float:left;
}
</style>
</head>
<body class="fixed-nav fixed-sidebar">
<div id="wrapper">
	<div id="page-wrapper" class="gray-bg dashbard-1" style="background-color:#fff;margin-top:50px;text-align: center;">
		<div class="wrapper wrapper-content animated" style="text-align: center;">
    	<div class="" style="width:100%;color:black;font-size:15px;height:40px;line-height:40px;background: #87CEFA;text-align: center;">
	  <%--   	<div class="fl"><img src="${CONTEXT_PATH }/image/picturesfolder.ico" style="width:50px; height:50px;"/></div> --%>
	   		<div style="font-size: 30px;color: white;font-weight: bold;">用户信息</div>
	   </div>
    	<hr/>	
    <div class="span" style="width:100%;color:black;font-size:12px;border:2px solid #dadada;">
   		<div class="" style="margin-top:15px;margin-bottom:15px;">
    		<form method="post" action="${CONTEXT_PATH}/memberInfo/queryByConditionByPage" class="form-horizontal">
    			<div style="" class="form-group">
    				<label class="col-sm-1 col-xs-1 col-md-1 control-label">注册手机</label>
	    			<div class="col-sm-2 col-xs-2 col-md-2">	
	    				<input type="text" class="form-control" name="mobile" id="mobile" value="${cmobile}"/>
    				</div>
    				<label class="col-sm-1 col-xs-1 col-md-1 control-label">用户名</label>
	    			<div class="col-sm-2 col-xs-2 col-md-2">	
	    				<input type="text" class="form-control" name="cname" id="cname" value="${cname}"/>
    				</div>
    				<label class="col-sm-1 col-xs-1 col-md-1 control-label">用户类型</label>
	    			<div class="col-sm-2 col-xs-2 col-md-2">
	    				<select name="type" id="type" style="height: 30px;width: 80px;">
	    					<option></option>
	    					<option value="350001" <c:if test="${type=='350001'}">selected="selected"</c:if>>普通用户</option>
	    					<option value="350002" <c:if test="${type=='350002'}">selected="selected"</c:if>>经销商</option>
	    				</select>	
    				</div>
    			</div>
    			<div style="" class="form-group">
    				<label class="col-sm-1 col-xs-1 col-md-1 control-label">经销商</label>
	    			<div class="col-sm-2 col-xs-2 col-md-2">	
	    				<input type="text" class="form-control" name="storeName" id="storeName" value="${storeName}"/>
    				</div>
    				<label class="col-sm-1 col-xs-1 col-md-1 control-label">银行卡审核状态</label>
	    			<div class="col-sm-1 col-xs-1 col-md-1">
	    				<select name="status" id="status" style="height: 30px;width: 80px;">
	    					<option></option>
	    					<option value="240001" <c:if test="${status=='240001'}">selected="selected"</c:if>>审核中</option>
	    					<option value="240002" <c:if test="${status=='240002'}">selected="selected"</c:if>>审核成功</option>
	    					<option value="240003" <c:if test="${status=='240003'}">selected="selected"</c:if>>审核失败</option>
	    				</select>	
    				</div>
    			<div style="" class="col-sm-1 col-xs-1 col-md-1">
    				<input type="submit" class="ys2" value=""/>
    			</div>
    			<div style="" class="col-sm-1 col-xs-1 col-md-1">
    				<button type="button" class="btn btn-primary" onclick="exportData()">导出</button>
    			</div>
			   </div>
    		</form>
   		</div>
	</div>
    <div class="container equip" style="width:100%;font-size:12px;border:1px solid #dadada;margin-top:15px;height:700px;position:relative;color:black;margin-left:0px;">
    	<div class="row">
    		<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 table-responsive" style="padding-left:0px;padding-right:0px;font-size:14px;height:550px;">
    		<table class="table table-responsive" id="myTb" >
    		<thead>
    			<tr>
    				<th>序列号</th>
    			 	<th>用户名</th> 
    				<th>用户编码</th>
    				<th>昵称</th>
    				<th>注册号码</th>
    				<th>用户角色</th>
    				<th>经销商门店</th>
    				<th>余额</th>
    				<th>已提现金额</th>
    				<th>申请提现中金额</th>
    				<th>支付宝充值金额</th>
    				<th>银行卡审核状态</th>
    				<!-- <th>性别</th> -->
    				<th>注册时间</th>
    				<th>操作</th>
    			</tr>
    		</thead>
    		<tbody>
    				<c:if test="${list.totalRow==0 }">
			    		<tr>
			    			<td colspan="7" style="font-size:30px;padding-top:18%;padding-left:45%;">没有找到相关数据</td>
			    		</tr>
		    		</c:if>
		    		<c:if test="${list.totalRow>0 }">
		    			<c:forEach var="s" items="${sList}" varStatus="status">	
		    				<tr class="bOrder">
		    					<td>${list.pageSize*(list.pageNumber-1)+status.index+1}</td>
		    					 <td>
		    						${s.userName}
		    					</td>
		    					<td>
		    						${s.keyCode}
		    					</td>
		    					<td>
		    						${s.name}
		    					</td>
		    					<td>
		    						${s.mobile}
		  						</td>
		  						<td>
		    						${s.role}
		  						</td>
		  						<td>
		    						${s.store}
		  						</td>
		    					<td>${s.moneys}</td>
		    					<td>${s.applyedMoneys}</td>
		    					<td>${s.applingMoneys}</td>
		    					<td>${s.rechargeMoneys}</td>
		    					<td>${s.bankStatus}</td>
		    					<%-- <td>
		    							${s.sex}
		    					</td> --%>
		    					<td>
		    							${s.createTime}
		    					</td>
		    					<td>
		    						<input type="button" value="编辑" class="ys3" data-toggle="modal" data-target="#myModal" onclick="loadProject(${s.id})"/>
		    						<input type="button" value="查看" class="ys3" data-toggle="modal" data-target="#myModal1" onclick="loadProject1(${s.id})"/>
		    						<c:if test="${s.roleCd=='350002' and s.openStore == 0}">
		    							<input type="button" value="增加门店" class="ys3" data-toggle="modal" data-target="#myModal3" onclick="openStore1(${s.id})"/>
		    						</c:if>
		    						<c:if test="${s.openStore == 1 and s.roleCd=='350002'}">
		    							<input type="button" value="查看门店" class="ys3" data-toggle="modal" data-target="#myModal4" onclick="openStore2(${s.storeId})"/>
		    						</c:if>
		    						<c:if test="${s.roleCd=='350001'}">
		    								<input type="button" value="设置为经销商" class="ys3"  style="width: 100px;" onclick="if(confirm('确认要设置经销商?')){window.location='${CONTEXT_PATH}/memberInfo/updateBusiness?id=${s.id}';}"/>
		    						</c:if>
		    					</td>
		    				</tr>
		    			</c:forEach>
					</c:if>
    		</tbody>
    		</table>
    		  
    		</div>
    		<div id="botton" style="position:absolute;bottom:50px;right:5%;color:black;margin:0 auto;font-size:12px;">
			    	<c:set var="pageNumber" scope="request" value="${list.pageNumber}" />
		            <c:set var="pageSize" scope="request" value="${list.pageSize}" />
		            <c:set var="totalPage" scope="request" value="${list.totalPage}" />
		            <c:set var="totalRow" scope="request" value="${list.totalRow}" />
					<c:set var="pageUrl" scope="request" value="${CONTEXT_PATH}/memberInfo/queryByPage/-" />    	
			    	<%@include file="../common/page.jsp"%>
				</div>
    	</div>
    </div>
		</div>
	</div>
</div>
<%@include file="../common/layout.jsp"%>
<div class="modal fade bs-example-modal-lg" id="myModal" role="dialog" aria-label="myModalDialog" aria-hidden="true" style="">
	<div class="modal-dialog modal-lg">
		<div class="modal-content" style="width: 120%;margin-left:-10%;">
			<div class="modal-header">
				<button type="button" data-dismiss="modal" class="close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title">修改</h4>
			</div>
			<form action="${CONTEXT_PATH}/memberInfo/updateMember" method="post">
				<div class="modal-body">
				</div>
				<div class="modal-footer" style="margin-top:20px;">
					<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
					<input type="submit" class="btn btn-success" value="保存"/>
				</div>
			</form>
		</div>
	</div>
</div>
<div class="modal fade bs-example-modal-lg" id="myModal3" role="dialog" aria-label="myModalDialog" aria-hidden="true" style="">
	<div class="modal-dialog modal-lg">
		<div class="modal-content" style="width: 120%;margin-left:-10%;">
			<div class="modal-header">
				<button type="button" data-dismiss="modal" class="close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title">新增</h4>
			</div>
			<form action="${CONTEXT_PATH}/storeInfo/saveStore" method="post" enctype="multipart/form-data" onsubmit="return check();">
				<div class="modal-body" id="model3">
				</div>
				<div class="modal-footer" style="margin-top:20px;">
					<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
					<input type="submit" class="btn btn-success" value="保存" id="saveBtn"/>
				</div>
			</form>
		</div>
	</div>
</div>
<div class="modal fade bs-example-modal-lg" id="myModal4" role="dialog" aria-label="myModalDialog" aria-hidden="true" style="">
	<div class="modal-dialog modal-lg">
		<div class="modal-content" style="width: 120%;margin-left:-10%;">
			<div class="modal-header">
				<button type="button" data-dismiss="modal" class="close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title">查看</h4>
			</div>
				<div class="modal-body" id="model4">
				</div>
		</div>
	</div>
</div>
<div class="modal fade bs-example-modal-lg" id="myModal1" role="dialog" aria-label="myModalDialog" aria-hidden="true" style="">
	<div class="modal-dialog modal-lg">
		<div class="modal-content" style="width: 120%;margin-left:-10%;">
			<div class="modal-header">
				<button type="button" data-dismiss="modal" class="close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title">查看</h4>
			</div>
			<form action="${CONTEXT_PATH}/memberInfo/updateMember" method="post">
				<div class="modal-body">
				</div>
			</form>
		</div>
	</div>
</div>
</body>
</html>