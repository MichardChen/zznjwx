package my.wx.controller;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.servlet.Cookie;
import org.huadalink.route.ControllerBind;

import com.jfinal.aop.Before;
import com.jfinal.aop.Enhancer;
import com.jfinal.core.Controller;
import com.jfinal.upload.UploadFile;

import my.app.service.FileService;
import my.core.constants.Constants;
import my.core.interceptor.RequestInterceptor;
import my.core.model.ReturnData;
import my.pvcloud.dto.LoginDTO;
import my.pvcloud.util.ImageTools;
import my.pvcloud.util.ImageZipUtil;
import my.pvcloud.util.StringUtil;
import my.wx.service.WXService;

@ControllerBind(key = "/wxmrest", path = "/wx")
public class WXController extends Controller{

	WXService service=Enhancer.enhance(WXService.class);
	
	public void index(){
		render("/wx/login.html");
	}
	
	public void loginExpire(){
		ReturnData data = new ReturnData();
		data.setCode(Constants.STATUS_CODE.LOGIN_EXPIRE);
		data.setMessage("您还未登陆，请先登陆");
		getResponse().setHeader("Access-Control-Allow-Origin", "*");
		renderJson(data);
	}
	
	/**
	 * 返回登录界面
	 */
	public void checkout() {
		Subject subject = SecurityUtils.getSubject();
		if (subject != null) {
			subject.logout();
		}
		redirect("/index");
	}
	
	private String getCookies(Cookie[] cookies) {
	    StringBuilder sb = new StringBuilder();
	    for(Cookie cookie : cookies) {
	        sb.append(cookie.getName());
	        sb.append("=");
	        sb.append(cookie.getValue());
	        sb.append(";");
	    }
	    return sb.toString();
	}
	
	//获取个人数据
	public void queryPersonData() throws Exception{
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		setSesssionParams(dto);
		getResponse().setHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.queryPersonData(dto));
	}
	
	//上传头像
	public void uploadIcon() throws Exception{
		UploadFile uploadFile = getFile("icon");
		
		/*ContainFileInterceptor interceptor = new ContainFileInterceptor();
		ReturnData data1 = interceptor.vertifyToken(getRequest());
		if(!StringUtil.equals(data1.getCode(), Constants.STATUS_CODE.SUCCESS)){
			renderJson(data1);
			return;
		}*/
		
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		setSesssionParams(dto);
		//表单中有提交图片，要先获取图片
		FileService fs=new FileService();
		String logo = "";
		//上传文件
		String uuid = UUID.randomUUID().toString();
		if(uploadFile != null){
			String fileName = uploadFile.getOriginalFileName();
			String[] names = fileName.split("\\.");
		    File file=uploadFile.getFile();
		    File t=new File(Constants.FILE_HOST.ICON+uuid+"."+names[1]);
		    logo = Constants.HOST.ICON+uuid+"."+names[1];
		    try{
		        t.createNewFile();
		    }catch(IOException e){
		        e.printStackTrace();
		    }
		    
		    fs.fileChannelCopy(file, t);
		    ImageZipUtil.zipWidthHeightImageFile(file, t, ImageTools.getImgWidth(file), ImageTools.getImgHeight(file), 0.5f);
		    file.delete();
		}
		getResponse().setHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.updateIcon(dto.getUserId(), logo));
	}
	
	//修改qq
	public void updateQQ() throws Exception{
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		setSesssionParams(dto);
		getResponse().setHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.updateQQ(dto.getUserId(), dto.getQq()));
	}
		
	//修改微信
	public void updateWX() throws Exception{
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		setSesssionParams(dto);
		getResponse().setHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.updateWX(dto.getUserId(), dto.getWx()));
	}
		
	//修改昵称
	public void updateNickName() throws Exception{
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		setSesssionParams(dto);
		getResponse().setHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.updateNickName(dto.getUserId(), dto.getNickName()));
	}
	
	//收货地址列表
	public void queryMemberAddressList(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		setSesssionParams(dto);
		getResponse().setHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.queryMemberAddressList(dto));
	}
		
	//添加收货地址
	public void saveAddress(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		setSesssionParams(dto);
		getResponse().setHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.saveAddress(dto));
	}
		
	//修改收货地址
	public void updateAddress(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		setSesssionParams(dto);
		getResponse().setHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.updateAddress(dto));
	}
		
	//查找收货地址
	public void queryAddressById(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		setSesssionParams(dto);
		getResponse().setHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.queryAddressById(dto));
	}
		
	//删除收货地址
	public void deleteAddress(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		setSesssionParams(dto);
		getResponse().setHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.deleteAddressById(dto));
	}
		
	//提交反馈
	public void saveFeedBack(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		setSesssionParams(dto);
		getResponse().setHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.saveFeedback(dto));
	}
	
	//消息列表
	public void queryMessageList(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		setSesssionParams(dto);
		getResponse().setHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.queryMessageList(dto));
	}
	
	//消息
	public void queryMessageListDetail(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		setSesssionParams(dto);
		getResponse().setHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.queryMessageListDetail(dto));
	}
	
	private void setSesssionParams(LoginDTO dto){
		dto.setUserId(getSessionAttr("memberId")==null?0:(Integer)getSessionAttr("memberId"));
		dto.setUserTypeCd((String)getSessionAttr("userTypeCd"));
		dto.setMobile((String)getSessionAttr("mobile"));
	}
	
	//账单
	public void queryRecord(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		setSesssionParams(dto);
		getResponse().setHeader("Access-Control-Allow-Origin", "*");
		String queryType = dto.getType();
		if(StringUtil.equals(queryType, Constants.LOG_TYPE_CD.BUY_TEA)){
			//买茶记录
			renderJson(service.queryBuyNewTeaRecord(dto));
			return;
		}
		
		if(StringUtil.equals(queryType, Constants.LOG_TYPE_CD.SALE_TEA)){
			//卖茶记录
			renderJson(service.querySaleTeaRecord(dto));
			return;
		}
		
		if(StringUtil.equals(queryType, Constants.LOG_TYPE_CD.WAREHOUSE_FEE)){
			//仓储费记录
			renderJson(service.queryWareHouseRecords(dto));
			return;
		}
		
		if(StringUtil.equals(queryType, Constants.LOG_TYPE_CD.GET_TEA)){
			//取茶记录
			renderJson(service.queryGetTeaRecords(dto));
			return;
		}
		
		if(StringUtil.equals(queryType, Constants.LOG_TYPE_CD.RECHARGE)){
			//充值记录
			renderJson(service.queryRechargeRecords(dto));
			return;
		}
		
		if(StringUtil.equals(queryType, Constants.LOG_TYPE_CD.WITHDRAW)){
			//提现记录
			renderJson(service.queryWithDrawRecords(dto));
			return;
		}
		
		if(StringUtil.equals(queryType, Constants.LOG_TYPE_CD.REFUND)){
			//退款记录
			renderJson(service.queryRefundRecords(dto));
			return;
		}
		
		ReturnData data = new ReturnData();
		data.setCode(Constants.STATUS_CODE.FAIL);
		data.setMessage("查询失败");
		renderJson(data);
	}
	
	//修改性别
	public void modifySex(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		setSesssionParams(dto);
		getResponse().setHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.updateSex(dto.getUserId(), dto.getSex()));
	}
	
	//查看关联门店
	public void queryMemberStoreDetail(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		setSesssionParams(dto);
		getResponse().setHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.queryMemberStoreDetail(dto));
	}
	
	//修改密码
	public void modifyPwd() throws Exception{
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		setSesssionParams(dto);
		getResponse().setHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.modifyUserPwd(dto));
	}
	
	//新茶发售列表
	public void queryNewTeaSaleList(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		setSesssionParams(dto);
		getResponse().setHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.queryNewTeaSaleList(dto));
	}
		
	//查询新茶发售详情
	public void queryNewTeaById(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		setSesssionParams(dto);
		getResponse().setHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.queryNewTeaById(dto));
	}
	
	//添加到购物车
	public void addBuyCart(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		setSesssionParams(dto);
		getResponse().setHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.addBuyCart(dto));
	}
		
	//删除购物车
	public void deleteBuyCart(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		setSesssionParams(dto);
		getResponse().setHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.deleteBuyCart(dto));
	}
		
	//购物车列表
	public void queryBuyCartList(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		setSesssionParams(dto);
		getResponse().setHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.queryBuyCartLists(dto));
	}
		
	//我要买茶列表
	public void queryBuyTeaList(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		setSesssionParams(dto);
		getResponse().setHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.queryTeaLists(dto));
	}
		
	//我要买茶按片按件列表
	public void queryTeaList(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		setSesssionParams(dto);
		getResponse().setHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.queryTeaByIdList(dto));
	}
		
	//我要买茶分析
	public void queryTeaAnalysis(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		setSesssionParams(dto);
		getResponse().setHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.queryTeaAnalysis(dto));
	}
		
	//新茶发行->新茶发行详情->选择规格(具体茶叶的规格)
	public void queryTeaSize(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		setSesssionParams(dto);
		getResponse().setHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.queryTeaSize(dto));
	}
		
	//茶资产
	public void queryTeaProperty(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		setSesssionParams(dto);
		getResponse().setHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.queryTeaProperty(dto));
	}
		
	//仓储详情
	public void queryWareHouseDetail(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		setSesssionParams(dto);
		getResponse().setHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.queryWareHouseDetail(dto));
	}
	
	//我要喝茶列表
	public void queryTeaStoreList(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		setSesssionParams(dto);
		getResponse().setHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.queryTeaStoreList(dto));
	}
		
	//门店详情
	public void queryTeaStoreDetail(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		setSesssionParams(dto);
		getResponse().setHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.queryTeaStoreDetail(dto));
	}
		
	//获取账号余额
	public void queryMemberMoney() throws Exception{
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		setSesssionParams(dto);
		getResponse().setHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.queryMemberMoney(dto));
	}
}
