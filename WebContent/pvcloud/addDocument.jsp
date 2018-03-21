<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<meta charset="utf-8">
<title>添加文档</title>
<link type="image/x-icon" rel="shortcut icon" href="${CONTEXT_PATH}/assets/img/tjico.ico" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/summernote/css/bootstrap.css">
<link href="<%=request.getContextPath()%>/summernote/dist/summernote.css" rel="stylesheet"/>
<script src="<%=request.getContextPath()%>/summernote/js/jquery.min.js"></script>
<script src="<%=request.getContextPath()%>/summernote/js/bootstrap.min.js"></script>
<script src="<%=request.getContextPath()%>/summernote/dist/summernote.js"></script>
<script src="<%=request.getContextPath()%>/summernote/dist/lang/summernote-zh-CN.js"></script>    <!-- 中文-->
<style>
        .m {
            width: 800px;
            margin-left: auto;
            margin-right: auto;
        }
</style>
<script>
    var str='${message}';
    if(str!=''){
      alert(str);
    }
    $(function () {
            $('.summernote').summernote({
                height: 400,
                toolbar: [
                          ['style', ['style']],
                          ['fontsize',['fontsize']],
                          ['font', ['bold', 'underline', 'clear']],
                          ['fontname', ['fontname']],
                          ['color', ['color']],
                          ['para', ['ul', 'ol', 'paragraph']],
                          ['table', ['table']],
                          ['insert', ['link', 'picture', 'video']],
                          ['view', ['fullscreen', 'codeview', 'help']]
                        ],
                tabsize: 2,
                lang: 'zh-CN',
                codemirror: {
                    theme: 'monokai'
                },
                focus: true,
                callbacks: {
                    onImageUpload: function (files, editor, $editable) {
                        sendFile(files);
                    }
                }
            });
        });
        // 选择图片时把图片上传到服务器再读取服务器指定的存储位置显示在富文本区域内
        function sendFile(files, editor, $editable) {
            var $files = $(files);
            $files.each(function () {
                var file = this;
                // FormData，新的form表单封装，具体可百度，但其实用法很简单，如下
                var data = new FormData();
                // 将文件加入到file中，后端可获得到参数名为“file”
                data.append("file", file);
                // ajax上传
                $.ajax({
                    async: false, // 设置同步
                    data: data,
                    type: "POST",
                    url: "uploadFile",//图片上传的url（指定action），返回的是图片上传后的路径，http格式
                    cache: false,
                    contentType: false,
                    processData: false,
                    // 成功时调用方法，后端返回json数据
                    success: function (data) {
                    	var temp = eval(data);
                          $('.summernote').summernote('insertImage',temp.data.imgUrl);
                    },
                    // ajax请求失败时处理
                    error: function () {
                        alert("上传失败");
                    }
                });
            });
        }
        
        function check(){
        	var title = $("#title").val();
        	var content = $("#content").val();
        	if(title == ""){
        		alert("请输入标题");
        		return false;
        	}
        	if(content == ""){
        		alert("请输入内容");
        		return false;
        	}
        	return true;
        }
    </script>
<form action="${CONTEXT_PATH}/documentInfo/saveDocument" method="post" onsubmit="return check();">
<div class="m">
	<table class="table table-responsive">
		<tr>
			<td>文档标题</td>
			<td><input type="text" name="title" id="title" maxlength="30" placeholder="标题最长30个字" style="width: 300px;"/></td>
		</tr>
		<tr>
			<td>文档类型</td>
			<td>
						<select style="height:30px;width:120px;" name="typeCd" id="typeCd">
							<option value="060001">发行说明</option>
							<option value="060002">使用帮助</option>
							<option value="060003">协议合同</option>
							<option value="060004">新茶发行通知</option>
							<option value="060005">认证提示</option>
							<option value="060006">存储规则和仓库介绍</option>
							<option value="060007">茶叶包装及收费标准</option>
							<option value="060008">掌上茶宝平台交易合同</option>
							<option value="060009">掌上茶宝服务协议</option>
							<option value="060010">仓储管理服务协议</option>
							<option value="060011">掌上茶宝新茶发行合同</option>
							<option value="060012">免费喝茶体验规则</option>
						</select>&nbsp;<label style="color:red;">(提示：新茶发行通知最大字数，不能大于70个字符)</label>
		</tr>
		<tr>
					<td>文档详情</td>
					<td>
					</td>
		</tr>
	</table>
    <div>
    		<textarea id="content" name="content" class="summernote">
			</textarea>
    </div>
</div>
<div class="modal-footer" style="margin-top:20px;text-align: center;">
					<input type="submit" class="btn btn-success" value="保存"/>
				</div>
</form>
