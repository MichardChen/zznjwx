package my.wx.controller;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.net.HttpURLConnection;
import java.net.URL;
import java.sql.Timestamp;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.UUID;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import my.app.service.FileService;
import my.core.constants.Constants;
import my.core.interceptor.RequestInterceptor;
import my.core.model.AcceessToken;
import my.core.model.BuyCart;
import my.core.model.CashJournal;
import my.core.model.CashPay;
import my.core.model.CodeMst;
import my.core.model.Member;
import my.core.model.PayRecord;
import my.core.model.RecordListModel;
import my.core.model.ReturnData;
import my.core.model.Tea;
import my.core.model.WarehouseTeaMember;
import my.core.model.WarehouseTeaMemberItem;
import my.core.pay.RequestXml;
import my.core.vo.UserData;
import my.core.vo.WXPrepayModel;
import my.core.wxpay.WXPayUtil;
import my.pvcloud.dto.LoginDTO;
import my.pvcloud.model.MapWxData;
import my.pvcloud.util.DateUtil;
import my.pvcloud.util.HttpRequest;
import my.pvcloud.util.ImageTools;
import my.pvcloud.util.ImageZipUtil;
import my.pvcloud.util.PropertiesUtil;
import my.pvcloud.util.Sign;
import my.pvcloud.util.StringUtil;
import my.wx.service.WXService;
import sun.misc.Signal;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.session.Session;
import org.apache.shiro.session.mgt.SessionKey;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.subject.support.DefaultSubjectContext;
import org.apache.shiro.web.servlet.Cookie;
import org.apache.shiro.web.session.mgt.WebSessionKey;
import org.eclipse.jdt.internal.compiler.lookup.InvocationSite.EmptyWithAstNode;
import org.huadalink.route.ControllerBind;
import org.json.JSONException;
import org.json.JSONObject;

import com.github.wxpay.sdk.WXPayConstants;
import com.github.wxpay.sdk.WXPayConstants.SignType;
import com.jfinal.aop.Before;
import com.jfinal.aop.Enhancer;
import com.jfinal.core.Controller;
import com.jfinal.upload.UploadFile;
import com.sun.jndi.url.corbaname.corbanameURLContextFactory;

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
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		renderJson(data);
	}
	
	/**
	 * 返回登录界面
	 */
	public void checkout() throws Exception{
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		int loginFlg = onLogin(dto.getUserId(), dto.getUserTypeCd(), dto.getToken(), "020005");
		if(loginFlg != 3){
			ReturnData data = new ReturnData();
			data.setCode(Constants.STATUS_CODE.LOGIN_EXPIRE);
			if(loginFlg == 0){
				data.setMessage("您还未登陆，请先登陆");
			}
			if(loginFlg == 1){
				data.setMessage("您的账号登录过期");
			}
			if(loginFlg == 2){
				data.setMessage("您的账号已在其他终端登录");
			}
			
			getResponse().addHeader("Access-Control-Allow-Origin", "*");
			renderJson(data);
			return;
		}
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.logoutWX(dto));
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
		int loginFlg = onLogin(dto.getUserId(), dto.getUserTypeCd(), dto.getToken(), "020005");
		if(loginFlg != 3){
			ReturnData data = new ReturnData();
			data.setCode(Constants.STATUS_CODE.LOGIN_EXPIRE);
			if(loginFlg == 0){
				data.setMessage("您还未登陆，请先登陆");
			}
			if(loginFlg == 1){
				data.setMessage("您的账号登录过期");
			}
			if(loginFlg == 2){
				data.setMessage("您的账号已在其他终端登录");
			}
			
			getResponse().addHeader("Access-Control-Allow-Origin", "*");
			renderJson(data);
			return;
		}
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
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
		int loginFlg = onLogin(dto.getUserId(), dto.getUserTypeCd(), dto.getToken(), "020005");
		if(loginFlg != 3){
			ReturnData data = new ReturnData();
			data.setCode(Constants.STATUS_CODE.LOGIN_EXPIRE);
			if(loginFlg == 0){
				data.setMessage("您还未登陆，请先登陆");
			}
			if(loginFlg == 1){
				data.setMessage("您的账号登录过期");
			}
			if(loginFlg == 2){
				data.setMessage("您的账号已在其他终端登录");
			}
			
			getResponse().addHeader("Access-Control-Allow-Origin", "*");
			renderJson(data);
			return;
		}
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
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.updateIcon(dto.getUserId(), logo));
	}
	
	//修改qq
	public void updateQQ() throws Exception{
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		int loginFlg = onLogin(dto.getUserId(), dto.getUserTypeCd(), dto.getToken(), "020005");
		if(loginFlg != 3){
			ReturnData data = new ReturnData();
			data.setCode(Constants.STATUS_CODE.LOGIN_EXPIRE);
			if(loginFlg == 0){
				data.setMessage("您还未登陆，请先登陆");
			}
			if(loginFlg == 1){
				data.setMessage("您的账号登录过期");
			}
			if(loginFlg == 2){
				data.setMessage("您的账号已在其他终端登录");
			}
			
			getResponse().addHeader("Access-Control-Allow-Origin", "*");
			renderJson(data);
			return;
		}
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.updateQQ(dto.getUserId(), dto.getQq()));
	}
		
	//修改微信
	public void updateWX() throws Exception{
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		int loginFlg = onLogin(dto.getUserId(), dto.getUserTypeCd(), dto.getToken(), "020005");
		if(loginFlg != 3){
			ReturnData data = new ReturnData();
			data.setCode(Constants.STATUS_CODE.LOGIN_EXPIRE);
			if(loginFlg == 0){
				data.setMessage("您还未登陆，请先登陆");
			}
			if(loginFlg == 1){
				data.setMessage("您的账号登录过期");
			}
			if(loginFlg == 2){
				data.setMessage("您的账号已在其他终端登录");
			}
			
			getResponse().addHeader("Access-Control-Allow-Origin", "*");
			renderJson(data);
			return;
		}
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.updateWX(dto.getUserId(), dto.getWx()));
	}
		
	//修改昵称
	public void updateNickName() throws Exception{
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		int loginFlg = onLogin(dto.getUserId(), dto.getUserTypeCd(), dto.getToken(), "020005");
		if(loginFlg != 3){
			ReturnData data = new ReturnData();
			data.setCode(Constants.STATUS_CODE.LOGIN_EXPIRE);
			if(loginFlg == 0){
				data.setMessage("您还未登陆，请先登陆");
			}
			if(loginFlg == 1){
				data.setMessage("您的账号登录过期");
			}
			if(loginFlg == 2){
				data.setMessage("您的账号已在其他终端登录");
			}
			
			getResponse().addHeader("Access-Control-Allow-Origin", "*");
			renderJson(data);
			return;
		}
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.updateNickName(dto.getUserId(), dto.getNickName()));
	}
	
	//收货地址列表
	public void queryMemberAddressList(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		int loginFlg = onLogin(dto.getUserId(), dto.getUserTypeCd(), dto.getToken(), "020005");
		if(loginFlg != 3){
			ReturnData data = new ReturnData();
			data.setCode(Constants.STATUS_CODE.LOGIN_EXPIRE);
			if(loginFlg == 0){
				data.setMessage("您还未登陆，请先登陆");
			}
			if(loginFlg == 1){
				data.setMessage("您的账号登录过期");
			}
			if(loginFlg == 2){
				data.setMessage("您的账号已在其他终端登录");
			}
			
			getResponse().addHeader("Access-Control-Allow-Origin", "*");
			renderJson(data);
			return;
		}
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.queryMemberAddressList(dto));
	}
		
	//添加收货地址
	public void saveAddress(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		int loginFlg = onLogin(dto.getUserId(), dto.getUserTypeCd(), dto.getToken(), "020005");
		if(loginFlg != 3){
			ReturnData data = new ReturnData();
			data.setCode(Constants.STATUS_CODE.LOGIN_EXPIRE);
			if(loginFlg == 0){
				data.setMessage("您还未登陆，请先登陆");
			}
			if(loginFlg == 1){
				data.setMessage("您的账号登录过期");
			}
			if(loginFlg == 2){
				data.setMessage("您的账号已在其他终端登录");
			}
			
			getResponse().addHeader("Access-Control-Allow-Origin", "*");
			renderJson(data);
			return;
		}
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.saveAddress(dto));
	}
		
	//修改收货地址
	public void updateAddress(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		int loginFlg = onLogin(dto.getUserId(), dto.getUserTypeCd(), dto.getToken(), "020005");
		if(loginFlg != 3){
			ReturnData data = new ReturnData();
			data.setCode(Constants.STATUS_CODE.LOGIN_EXPIRE);
			if(loginFlg == 0){
				data.setMessage("您还未登陆，请先登陆");
			}
			if(loginFlg == 1){
				data.setMessage("您的账号登录过期");
			}
			if(loginFlg == 2){
				data.setMessage("您的账号已在其他终端登录");
			}
			
			getResponse().addHeader("Access-Control-Allow-Origin", "*");
			renderJson(data);
			return;
		}
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.updateAddress(dto));
	}
		
	//查找收货地址
	public void queryAddressById(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		int loginFlg = onLogin(dto.getUserId(), dto.getUserTypeCd(), dto.getToken(), "020005");
		if(loginFlg != 3){
			ReturnData data = new ReturnData();
			data.setCode(Constants.STATUS_CODE.LOGIN_EXPIRE);
			if(loginFlg == 0){
				data.setMessage("您还未登陆，请先登陆");
			}
			if(loginFlg == 1){
				data.setMessage("您的账号登录过期");
			}
			if(loginFlg == 2){
				data.setMessage("您的账号已在其他终端登录");
			}
			
			getResponse().addHeader("Access-Control-Allow-Origin", "*");
			renderJson(data);
			return;
		}
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.queryAddressById(dto));
	}
		
	//删除收货地址
	public void deleteAddress(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		int loginFlg = onLogin(dto.getUserId(), dto.getUserTypeCd(), dto.getToken(), "020005");
		if(loginFlg != 3){
			ReturnData data = new ReturnData();
			data.setCode(Constants.STATUS_CODE.LOGIN_EXPIRE);
			if(loginFlg == 0){
				data.setMessage("您还未登陆，请先登陆");
			}
			if(loginFlg == 1){
				data.setMessage("您的账号登录过期");
			}
			if(loginFlg == 2){
				data.setMessage("您的账号已在其他终端登录");
			}
			
			getResponse().addHeader("Access-Control-Allow-Origin", "*");
			renderJson(data);
			return;
		}
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.deleteAddressById(dto));
	}
		
	//提交反馈
	public void saveFeedBack(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		int loginFlg = onLogin(dto.getUserId(), dto.getUserTypeCd(), dto.getToken(), "020005");
		if(loginFlg != 3){
			ReturnData data = new ReturnData();
			data.setCode(Constants.STATUS_CODE.LOGIN_EXPIRE);
			if(loginFlg == 0){
				data.setMessage("您还未登陆，请先登陆");
			}
			if(loginFlg == 1){
				data.setMessage("您的账号登录过期");
			}
			if(loginFlg == 2){
				data.setMessage("您的账号已在其他终端登录");
			}
			
			getResponse().addHeader("Access-Control-Allow-Origin", "*");
			renderJson(data);
			return;
		}
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.saveFeedback(dto));
	}
	
	//消息列表
	public void queryMessageList(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		int loginFlg = onLogin(dto.getUserId(), dto.getUserTypeCd(), dto.getToken(), "020005");
		if(loginFlg != 3){
			ReturnData data = new ReturnData();
			data.setCode(Constants.STATUS_CODE.LOGIN_EXPIRE);
			if(loginFlg == 0){
				data.setMessage("您还未登陆，请先登陆");
			}
			if(loginFlg == 1){
				data.setMessage("您的账号登录过期");
			}
			if(loginFlg == 2){
				data.setMessage("您的账号已在其他终端登录");
			}
			
			getResponse().addHeader("Access-Control-Allow-Origin", "*");
			renderJson(data);
			return;
		}
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.queryMessageList(dto));
	}
	
	//消息
	public void queryMessageListDetail(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		//int loginFlg = onLogin(dto.getUserId(), dto.getUserTypeCd(), dto.getToken(), "020005");
		int loginFlg =3;
		if(loginFlg != 3){
			ReturnData data = new ReturnData();
			data.setCode(Constants.STATUS_CODE.LOGIN_EXPIRE);
			if(loginFlg == 0){
				data.setMessage("您还未登陆，请先登陆");
			}
			if(loginFlg == 1){
				data.setMessage("您的账号登录过期");
			}
			if(loginFlg == 2){
				data.setMessage("您的账号已在其他终端登录");
			}
			
			getResponse().addHeader("Access-Control-Allow-Origin", "*");
			renderJson(data);
			return;
		}
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.queryMessageListDetail(dto));
	}
	
	private void setSesssionParams(LoginDTO dto){
		/*dto.setUserId(getSessionAttr("memberId")==null?0:(Integer)getSessionAttr("memberId"));
		dto.setUserTypeCd((String)getSessionAttr("userTypeCd"));
		dto.setMobile((String)getSessionAttr("mobile"));*/
	}
	
	//账单
	public void queryRecord(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		int loginFlg = onLogin(dto.getUserId(), dto.getUserTypeCd(), dto.getToken(), "020005");
		if(loginFlg != 3){
			ReturnData data = new ReturnData();
			data.setCode(Constants.STATUS_CODE.LOGIN_EXPIRE);
			if(loginFlg == 0){
				data.setMessage("您还未登陆，请先登陆");
			}
			if(loginFlg == 1){
				data.setMessage("您的账号登录过期");
			}
			if(loginFlg == 2){
				data.setMessage("您的账号已在其他终端登录");
			}
			
			getResponse().addHeader("Access-Control-Allow-Origin", "*");
			renderJson(data);
			return;
		}
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
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
		int loginFlg = onLogin(dto.getUserId(), dto.getUserTypeCd(), dto.getToken(), "020005");
		if(loginFlg != 3){
			ReturnData data = new ReturnData();
			data.setCode(Constants.STATUS_CODE.LOGIN_EXPIRE);
			if(loginFlg == 0){
				data.setMessage("您还未登陆，请先登陆");
			}
			if(loginFlg == 1){
				data.setMessage("您的账号登录过期");
			}
			if(loginFlg == 2){
				data.setMessage("您的账号已在其他终端登录");
			}
			
			getResponse().addHeader("Access-Control-Allow-Origin", "*");
			renderJson(data);
			return;
		}
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.updateSex(dto.getUserId(), dto.getSex()));
	}
	
	//查看关联门店
	public void queryMemberStoreDetail(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		int loginFlg = onLogin(dto.getUserId(), dto.getUserTypeCd(), dto.getToken(), "020005");
		if(loginFlg != 3){
			ReturnData data = new ReturnData();
			data.setCode(Constants.STATUS_CODE.LOGIN_EXPIRE);
			if(loginFlg == 0){
				data.setMessage("您还未登陆，请先登陆");
			}
			if(loginFlg == 1){
				data.setMessage("您的账号登录过期");
			}
			if(loginFlg == 2){
				data.setMessage("您的账号已在其他终端登录");
			}
			
			getResponse().addHeader("Access-Control-Allow-Origin", "*");
			renderJson(data);
			return;
		}
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.queryMemberStoreDetail(dto));
	}
	
	//修改密码
	public void modifyPwd() throws Exception{
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		int loginFlg = onLogin(dto.getUserId(), dto.getUserTypeCd(), dto.getToken(), "020005");
		if(loginFlg != 3){
			ReturnData data = new ReturnData();
			data.setCode(Constants.STATUS_CODE.LOGIN_EXPIRE);
			if(loginFlg == 0){
				data.setMessage("您还未登陆，请先登陆");
			}
			if(loginFlg == 1){
				data.setMessage("您的账号登录过期");
			}
			if(loginFlg == 2){
				data.setMessage("您的账号已在其他终端登录");
			}
			
			getResponse().addHeader("Access-Control-Allow-Origin", "*");
			renderJson(data);
			return;
		}
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.modifyUserPwd(dto));
	}
	
	//新茶发售列表
	public void queryNewTeaSaleList(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		/*int loginFlg = onLogin(dto.getUserId(), dto.getUserTypeCd(), dto.getToken(), "020005");
		if(loginFlg != 3){
			ReturnData data = new ReturnData();
			data.setCode(Constants.STATUS_CODE.LOGIN_EXPIRE);
			if(loginFlg == 0){
				data.setMessage("您还未登陆，请先登陆");
			}
			if(loginFlg == 1){
				data.setMessage("您的账号登录过期");
			}
			if(loginFlg == 2){
				data.setMessage("您的账号已在其他终端登录");
			}
			
			getResponse().addHeader("Access-Control-Allow-Origin", "*");
			renderJson(data);
			return;
		}*/
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.queryNewTeaSaleList(dto));
	}
		
	//查询新茶发售详情
	public void queryNewTeaById(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		/*int loginFlg = onLogin(dto.getUserId(), dto.getUserTypeCd(), dto.getToken(), "020005");
		if(loginFlg != 3){
			ReturnData data = new ReturnData();
			data.setCode(Constants.STATUS_CODE.LOGIN_EXPIRE);
			if(loginFlg == 0){
				data.setMessage("您还未登陆，请先登陆");
			}
			if(loginFlg == 1){
				data.setMessage("您的账号登录过期");
			}
			if(loginFlg == 2){
				data.setMessage("您的账号已在其他终端登录");
			}
			
			getResponse().addHeader("Access-Control-Allow-Origin", "*");
			renderJson(data);
			return;
		}*/
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.queryNewTeaById(dto));
	}
	
	//添加到购物车
	public void addBuyCart(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		int loginFlg = onLogin(dto.getUserId(), dto.getUserTypeCd(), dto.getToken(), "020005");
		if(loginFlg != 3){
			ReturnData data = new ReturnData();
			data.setCode(Constants.STATUS_CODE.LOGIN_EXPIRE);
			if(loginFlg == 0){
				data.setMessage("您还未登陆，请先登陆");
			}
			if(loginFlg == 1){
				data.setMessage("您的账号登录过期");
			}
			if(loginFlg == 2){
				data.setMessage("您的账号已在其他终端登录");
			}
			
			getResponse().addHeader("Access-Control-Allow-Origin", "*");
			renderJson(data);
			return;
		}
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.addBuyCart(dto));
	}
		
	//删除购物车
	public void deleteBuyCart(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		int loginFlg = onLogin(dto.getUserId(), dto.getUserTypeCd(), dto.getToken(), "020005");
		if(loginFlg != 3){
			ReturnData data = new ReturnData();
			data.setCode(Constants.STATUS_CODE.LOGIN_EXPIRE);
			if(loginFlg == 0){
				data.setMessage("您还未登陆，请先登陆");
			}
			if(loginFlg == 1){
				data.setMessage("您的账号登录过期");
			}
			if(loginFlg == 2){
				data.setMessage("您的账号已在其他终端登录");
			}
			
			getResponse().addHeader("Access-Control-Allow-Origin", "*");
			renderJson(data);
			return;
		}
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.deleteBuyCart(dto));
	}
		
	//购物车列表
	public void queryBuyCartList(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		int loginFlg = onLogin(dto.getUserId(), dto.getUserTypeCd(), dto.getToken(), "020005");
		if(loginFlg != 3){
			ReturnData data = new ReturnData();
			data.setCode(Constants.STATUS_CODE.LOGIN_EXPIRE);
			if(loginFlg == 0){
				data.setMessage("您还未登陆，请先登陆");
			}
			if(loginFlg == 1){
				data.setMessage("您的账号登录过期");
			}
			if(loginFlg == 2){
				data.setMessage("您的账号已在其他终端登录");
			}
			
			getResponse().addHeader("Access-Control-Allow-Origin", "*");
			renderJson(data);
			return;
		}
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.queryBuyCartLists(dto));
	}
		
	//我要买茶列表
	public void queryBuyTeaList(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		/*int loginFlg = onLogin(dto.getUserId(), dto.getUserTypeCd(), dto.getToken(), "020005");
		if(loginFlg != 3){
			ReturnData data = new ReturnData();
			data.setCode(Constants.STATUS_CODE.LOGIN_EXPIRE);
			if(loginFlg == 0){
				data.setMessage("您还未登陆，请先登陆");
			}
			if(loginFlg == 1){
				data.setMessage("您的账号登录过期");
			}
			if(loginFlg == 2){
				data.setMessage("您的账号已在其他终端登录");
			}
			
			getResponse().addHeader("Access-Control-Allow-Origin", "*");
			renderJson(data);
			return;
		}*/
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.queryTeaLists(dto));
	}
		
	//我要买茶按片按件列表
	public void queryTeaList(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		/*int loginFlg = onLogin(dto.getUserId(), dto.getUserTypeCd(), dto.getToken(), "020005");
		if(loginFlg != 3){
			ReturnData data = new ReturnData();
			data.setCode(Constants.STATUS_CODE.LOGIN_EXPIRE);
			if(loginFlg == 0){
				data.setMessage("您还未登陆，请先登陆");
			}
			if(loginFlg == 1){
				data.setMessage("您的账号登录过期");
			}
			if(loginFlg == 2){
				data.setMessage("您的账号已在其他终端登录");
			}
			
			getResponse().addHeader("Access-Control-Allow-Origin", "*");
			renderJson(data);
			return;
		}*/
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.queryTeaByIdList(dto));
	}
		
	//我要买茶分析
	public void queryTeaAnalysis(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		/*int loginFlg = onLogin(dto.getUserId(), dto.getUserTypeCd(), dto.getToken(), "020005");
		if(loginFlg != 3){
			ReturnData data = new ReturnData();
			data.setCode(Constants.STATUS_CODE.LOGIN_EXPIRE);
			if(loginFlg == 0){
				data.setMessage("您还未登陆，请先登陆");
			}
			if(loginFlg == 1){
				data.setMessage("您的账号登录过期");
			}
			if(loginFlg == 2){
				data.setMessage("您的账号已在其他终端登录");
			}
			
			getResponse().addHeader("Access-Control-Allow-Origin", "*");
			renderJson(data);
			return;
		}*/
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.queryTeaAnalysis(dto));
	}
		
	//新茶发行->新茶发行详情->选择规格(具体茶叶的规格)
	public void queryTeaSize(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		/*int loginFlg = onLogin(dto.getUserId(), dto.getUserTypeCd(), dto.getToken(), "020005");
		if(loginFlg != 3){
			ReturnData data = new ReturnData();
			data.setCode(Constants.STATUS_CODE.LOGIN_EXPIRE);
			if(loginFlg == 0){
				data.setMessage("您还未登陆，请先登陆");
			}
			if(loginFlg == 1){
				data.setMessage("您的账号登录过期");
			}
			if(loginFlg == 2){
				data.setMessage("您的账号已在其他终端登录");
			}
			
			getResponse().addHeader("Access-Control-Allow-Origin", "*");
			renderJson(data);
			return;
		}*/
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.queryTeaSize(dto));
	}
		
	//茶资产
	public void queryTeaProperty(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		int loginFlg = onLogin(dto.getUserId(), dto.getUserTypeCd(), dto.getToken(), "020005");
		if(loginFlg != 3){
			ReturnData data = new ReturnData();
			data.setCode(Constants.STATUS_CODE.LOGIN_EXPIRE);
			if(loginFlg == 0){
				data.setMessage("您还未登陆，请先登陆");
			}
			if(loginFlg == 1){
				data.setMessage("您的账号登录过期");
			}
			if(loginFlg == 2){
				data.setMessage("您的账号已在其他终端登录");
			}
			
			getResponse().addHeader("Access-Control-Allow-Origin", "*");
			renderJson(data);
			return;
		}
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.queryTeaProperty(dto));
	}
		
	//仓储详情
	public void queryWareHouseDetail(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		int loginFlg = onLogin(dto.getUserId(), dto.getUserTypeCd(), dto.getToken(), "020005");
		if(loginFlg != 3){
			ReturnData data = new ReturnData();
			data.setCode(Constants.STATUS_CODE.LOGIN_EXPIRE);
			if(loginFlg == 0){
				data.setMessage("您还未登陆，请先登陆");
			}
			if(loginFlg == 1){
				data.setMessage("您的账号登录过期");
			}
			if(loginFlg == 2){
				data.setMessage("您的账号已在其他终端登录");
			}
			
			getResponse().addHeader("Access-Control-Allow-Origin", "*");
			renderJson(data);
			return;
		}
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.queryWareHouseDetail(dto));
	}
	
	//我要喝茶列表
	public void queryTeaStoreList(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		/*int loginFlg = onLogin(dto.getUserId(), dto.getUserTypeCd(), dto.getToken(), "020005");
		if(loginFlg != 3){
			ReturnData data = new ReturnData();
			data.setCode(Constants.STATUS_CODE.LOGIN_EXPIRE);
			if(loginFlg == 0){
				data.setMessage("您还未登陆，请先登陆");
			}
			if(loginFlg == 1){
				data.setMessage("您的账号登录过期");
			}
			if(loginFlg == 2){
				data.setMessage("您的账号已在其他终端登录");
			}
			
			getResponse().addHeader("Access-Control-Allow-Origin", "*");
			renderJson(data);
			return;
		}*/
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.queryTeaStoreList(dto));
	}
		
	//门店详情
	public void queryTeaStoreDetail(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		/*int loginFlg = onLogin(dto.getUserId(), dto.getUserTypeCd(), dto.getToken(), "020005");
		if(loginFlg != 3){
			ReturnData data = new ReturnData();
			data.setCode(Constants.STATUS_CODE.LOGIN_EXPIRE);
			if(loginFlg == 0){
				data.setMessage("您还未登陆，请先登陆");
			}
			if(loginFlg == 1){
				data.setMessage("您的账号登录过期");
			}
			if(loginFlg == 2){
				data.setMessage("您的账号已在其他终端登录");
			}
			
			getResponse().addHeader("Access-Control-Allow-Origin", "*");
			renderJson(data);
			return;
		}*/
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.queryTeaStoreDetail(dto));
	}
	
	//获取账号余额
	public void queryMemberMoney() throws Exception{
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		int loginFlg = onLogin(dto.getUserId(), dto.getUserTypeCd(), dto.getToken(), "020005");
		if(loginFlg != 3){
			ReturnData data = new ReturnData();
			data.setCode(Constants.STATUS_CODE.LOGIN_EXPIRE);
			if(loginFlg == 0){
				data.setMessage("您还未登陆，请先登陆");
			}
			if(loginFlg == 1){
				data.setMessage("您的账号登录过期");
			}
			if(loginFlg == 2){
				data.setMessage("您的账号已在其他终端登录");
			}
			
			getResponse().addHeader("Access-Control-Allow-Origin", "*");
			renderJson(data);
			return;
		}
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.queryMemberMoney(dto));
	}
	
	private int onLogin(int userId,String userTypeCd,String token,String platForm){
		
		userTypeCd="010001";
		platForm="020005";
		AcceessToken acceessToken = AcceessToken.dao.queryToken(userId, userTypeCd, platForm);
		if(acceessToken == null || StringUtil.isBlank(acceessToken.getStr("token"))){
			//没有登录
			return 0;
		}else{
			//判断是否过期
			Timestamp now = DateUtil.getNowTimestamp();
			Timestamp expireTime = acceessToken.getTimestamp("expire_time");
			if(expireTime == null || now.after(expireTime)){
				return 1;
			}
			if(!StringUtil.equals(token, acceessToken.getStr("token"))){
				//异地登录
				return 2;
			}
			return 3;
		}
	}
	
	public boolean isAuthenticated(String sessionID,HttpServletRequest request,HttpServletResponse response){
        boolean status = false;

        SessionKey key = new WebSessionKey(sessionID,request,response);
        try{
            Session se = SecurityUtils.getSecurityManager().getSession(key);
            Object obj = se.getAttribute(DefaultSubjectContext.AUTHENTICATED_SESSION_KEY);
            if(obj != null){
                status = (Boolean) obj;
            }
        }catch(Exception e){
            e.printStackTrace();
        }finally{
            Session se = null;
            Object obj = null;
        }

        return status;
    }
	
	//付款(选择规格=下单)，微信回调
	public void pay() throws Exception{
		LoginDTO dto = LoginDTO.getInstance(getRequest());
	
		HttpServletRequest request = getRequest();
		PropertiesUtil propertiesUtil = PropertiesUtil.getInstance();
		Map<String,String> params = RequestXml.parseXml(request);
	
		//
		StringBuffer sb = new StringBuffer();
	    InputStream is = request.getInputStream();
	    InputStreamReader isr = new InputStreamReader(is, "UTF-8");
	    BufferedReader br = new BufferedReader(isr);
	    String s = "";
	    while ((s = br.readLine()) != null) {
	        sb.append(s);
	    }
	    Iterator<Entry<String, String>> iterator = params.entrySet().iterator();
	    System.out.println("=======回调的参数========");
	    while(iterator.hasNext()){
	    	Map.Entry<String, String> entry = iterator.next();
	    	System.out.println("key:"+entry.getKey()+"==value:"+entry.getValue());
	    }
	    System.out.println("========================");
	        
		//返回状态码、返回信息
		String returnCode = params.get("return_code");
		String returnMsg = params.get("return_msg");
		System.out.println("return_code:"+returnCode+"--return_msg:"+returnMsg);
		//验证签名
		boolean checkSign = WXPayUtil.isSignatureValid(params, propertiesUtil.getProperties("wx_key"));
		if(checkSign&&(StringUtil.equals(returnCode, "SUCCESS"))&&(StringUtil.isBlank(returnMsg))){
			System.out.println("签名有效");
			//签名有效
			String orderNo = params.get("out_trade_no");
			CashPay pay = CashPay.dao.queryByCashNo(orderNo);
			CashJournal cashJournal = CashJournal.dao.queryByCashNo(orderNo);
			if(cashJournal != null){
				dto.setUserId(cashJournal.getInt("member_id"));
			}else{
				System.out.println("微信支付回调，支付失败");
				//签名有效，失败
				String trade_no=params.get("transaction_id");
				int updateFlg = CashJournal.dao.updateStatus(orderNo, Constants.FEE_TYPE_STATUS.APPLY_FAIL,trade_no);
				if(updateFlg != 0){
					renderText("<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>");
					renderText("success");
				}else{
					renderText("fail");
				}
			}
			if(pay != null){
				String[] paramsArray = pay.getStr("params").split(",");
				dto.setTeaId(StringUtil.toInteger(paramsArray[0]));
				dto.setQuality(StringUtil.toInteger(paramsArray[1]));
				dto.setOrderNo(orderNo);
				String trade_no=params.get("transaction_id");
				dto.setTradeNo(trade_no);
				ReturnData data = service.pay(dto);
				//更新状态
				if(StringUtil.equals(data.getCode(), Constants.STATUS_CODE.SUCCESS)){
					renderText("<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>");
				}else{
					renderText("fail");
				}
				System.out.println("微信支付回调成功");
			}else{
				System.out.println("微信支付回调，支付失败");
				//签名有效，失败
				String trade_no=params.get("transaction_id");
				int updateFlg = CashJournal.dao.updateStatus(orderNo, Constants.FEE_TYPE_STATUS.APPLY_FAIL,trade_no);
				if(updateFlg != 0){
					renderText("<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>");
					renderText("success");
				}else{
					renderText("fail");
				}
			}
		}else if(checkSign&&(StringUtil.equals(returnCode, "FAIL"))){
			System.out.println("微信支付回调，支付失败");
			//签名有效，失败
			String orderNo = params.get("out_trade_no");
			String trade_no=params.get("transaction_id");
			int updateFlg = CashJournal.dao.updateStatus(orderNo, Constants.FEE_TYPE_STATUS.APPLY_FAIL,trade_no);
			if(updateFlg != 0){
				renderText("<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>");
				renderText("success");
			}else{
				renderText("fail");
			}
		}else{
			System.out.println("微信回调，签名错误");
		}
	}
		
	//购物车下单回调
	public void addOrder() throws Exception{
		HttpServletRequest request = getRequest();
		PropertiesUtil propertiesUtil = PropertiesUtil.getInstance();
		Map<String,String> params = RequestXml.parseXml(request);
	
		//
		StringBuffer sb = new StringBuffer();
	    InputStream is = request.getInputStream();
	    InputStreamReader isr = new InputStreamReader(is, "UTF-8");
	    BufferedReader br = new BufferedReader(isr);
	    String s = "";
	    while ((s = br.readLine()) != null) {
	        sb.append(s);
	    }
	    Iterator<Entry<String, String>> iterator = params.entrySet().iterator();
	    System.out.println("=======回调的参数========");
	    while(iterator.hasNext()){
	    	Map.Entry<String, String> entry = iterator.next();
	    	System.out.println("key:"+entry.getKey()+"==value:"+entry.getValue());
	    }
	    System.out.println("========================");
	        
		//返回状态码、返回信息
		String returnCode = params.get("return_code");
		String returnMsg = params.get("return_msg");
		System.out.println("return_code:"+returnCode+"--return_msg:"+returnMsg);
		//验证签名
		boolean checkSign = WXPayUtil.isSignatureValid(params, propertiesUtil.getProperties("wx_key"));
		if(checkSign&&(StringUtil.equals(returnCode, "SUCCESS"))&&(StringUtil.isBlank(returnMsg))){
			System.out.println("签名有效");
			//签名有效
			String orderNo = params.get("out_trade_no");
			LoginDTO dto = LoginDTO.getInstance(request);
			CashPay pay = CashPay.dao.queryByCashNo(orderNo);
			CashJournal cashJournal = CashJournal.dao.queryByCashNo(orderNo);
			if(cashJournal != null){
				dto.setUserId(cashJournal.getInt("member_id"));
			}else{
				System.out.println("微信支付回调，支付失败");
				//签名有效，失败
				String trade_no=params.get("transaction_id");
				int updateFlg = CashJournal.dao.updateStatus(orderNo, Constants.FEE_TYPE_STATUS.APPLY_FAIL,trade_no);
				if(updateFlg != 0){
					renderText("<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>");
					renderText("success");
				}else{
					renderText("fail");
				}
			}
			if(pay != null){
				dto.setTeas(pay.getStr("params"));
				dto.setOrderNo(orderNo);
				String trade_no=params.get("transaction_id");
				dto.setTradeNo(trade_no);
				ReturnData data = service.addOrder(dto);
				//更新状态
				if(StringUtil.equals(data.getCode(), Constants.STATUS_CODE.SUCCESS)){
					renderText("<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>");
				}else{
					renderText("fail");
				}
				System.out.println("微信支付回调成功");
			}else{
				System.out.println("微信支付回调，支付失败");
				//签名有效，失败
				String trade_no=params.get("transaction_id");
				int updateFlg = CashJournal.dao.updateStatus(orderNo, Constants.FEE_TYPE_STATUS.APPLY_FAIL,trade_no);
				if(updateFlg != 0){
					renderText("<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>");
					renderText("success");
				}else{
					renderText("fail");
				}
			}
		}else if(checkSign&&(StringUtil.equals(returnCode, "FAIL"))){
			System.out.println("微信支付回调，支付失败");
			//签名有效，失败
			String orderNo = params.get("out_trade_no");
			String trade_no=params.get("transaction_id");
			int updateFlg = CashJournal.dao.updateStatus(orderNo, Constants.FEE_TYPE_STATUS.APPLY_FAIL,trade_no);
			if(updateFlg != 0){
				renderText("<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>");
				renderText("success");
			}else{
				renderText("fail");
			}
		}else{
			System.out.println("微信回调，签名错误");
		}
	}
	
	//获取购物车预支付信息
	//购物车下单：获取预支付信息->添加资金记录->返回前端，唤起支付->微信回调，更新资金记录，减卖家库存，增买家库存
	//直接购买：获取预支付信息->添加资金记录->返回前端，唤起支付->微信回调，更新资金记录，减卖家库存，增买家库存
	public void getBuyCartPrePayInfo() throws Exception{
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		String str[] = dto.getTeas().split(",");
		int iSize = str.length;
		ReturnData data = new ReturnData();
		if(iSize <= 0){
			data.setCode(Constants.STATUS_CODE.FAIL);
			data.setMessage("购物车数量不能小于0");
			renderJson(data);
			return;
		}
		
		//总价
		BigDecimal amount = new BigDecimal("0");
		for(int i = 0; i < iSize; i++){
			//判断购物车
			BuyCart cart = BuyCart.dao.queryById(StringUtil.toInteger(str[i]));
			int wtmItemId = cart.getInt("warehouse_tea_member_item_id");
			int quality = (int)cart.getInt("quality");
			WarehouseTeaMemberItem item = WarehouseTeaMemberItem.dao.queryByKeyId(wtmItemId);
			if(item == null){
				data.setCode(Constants.STATUS_CODE.FAIL);
				data.setMessage("对不起，你所选中的第"+(i+1)+"种茶叶已不存在，请重新选择要购买的产品");
				renderJson(data);
				return;
			}
			WarehouseTeaMember wtm = WarehouseTeaMember.dao.queryById(item.getInt("warehouse_tea_member_id"));
			if(wtm == null){
				data.setCode(Constants.STATUS_CODE.FAIL);
				data.setMessage("对不起，你所选中的第"+(i+1)+"种茶叶已不存在，请重新选择要购买的产品");
				renderJson(data);
				return;
			}
			Tea tea = Tea.dao.queryById(wtm.getInt("tea_id"));
			if(tea == null){
				data.setCode(Constants.STATUS_CODE.FAIL);
				data.setMessage("对不起，你所选中的第"+(i+1)+"种茶叶已不存在，请重新选择要购买的产品");
				renderJson(data);
				return;
			}
			String teaName = tea.getStr("tea_title");
			
			int itemStock = item.getInt("quality");
			CodeMst sizeType = CodeMst.dao.queryCodestByCode(item.getStr("size_type_cd"));
			if(quality > itemStock){
				data.setCode(Constants.STATUS_CODE.FAIL);
				data.setMessage("对不起，"+teaName+"库存不足"+quality+sizeType.getStr("name"));
				renderJson(data);
				return;
			}
			if(StringUtil.isNoneBlank(item.getStr("status"))
					&&(!StringUtil.equals(item.getStr("status"), Constants.TEA_STATUS.ON_SALE))){
				data.setCode(Constants.STATUS_CODE.FAIL);
				data.setMessage("对不起，"+teaName+"已停售");
				renderJson(data);
				return;
			}
			
			amount = amount.add(item.getBigDecimal("price").multiply(new BigDecimal(quality)));
		}
	
		BigDecimal moneys = amount.setScale(2);
		
		String orderNo = CashJournal.dao.queryCurrentCashNo();
		int moneyInt = moneys.multiply(new BigDecimal("100")).intValue();
		//生成微信支付信息
		PropertiesUtil propertiesUtil = PropertiesUtil.getInstance();
        String wx_appid = propertiesUtil.getProperties("wx_appid");
        String wx_mch_id = propertiesUtil.getProperties("wx_mch_id");
        String wx_key = propertiesUtil.getProperties("wx_key");
        String wx_unifiedorder = propertiesUtil.getProperties("wx_unifiedorder");
        String wx_notify_url = propertiesUtil.getProperties("wxh5_buycart_notify_url");
        String nonStr = WXPayUtil.generateNonceStr();
        String UTF8 = "UTF-8";
        String stringA="appid="+wx_appid
        			  +"&body=掌上茶宝-购买茶叶"
        			  +"&mch_id="+wx_mch_id
        			  +"&nonce_str="+nonStr
        			  +"&notify_url="+wx_notify_url
        			  +"&out_trade_no="+orderNo
        			  //+"&scene_info={\"h5_info\":{\"type\":\"Wap\",\"wap_url\":\"http://www.yibuwangluo.cn\",\"wap_name\":\"购买茶叶\"}}"
        			  +"&spbill_create_ip=120.41.149.248"
        			  +"&total_fee="+moneyInt
        			  +"&trade_type=JSAPI";
        String md5StringA = WXPayUtil.MD5(stringA+"&key="+wx_key);
        String reqBody = "<xml>"
        				+"<appid>"+wx_appid+"</appid>"
        				+"<body>掌上茶宝-购买茶叶</body>"
        				+"<mch_id>"+wx_mch_id+"</mch_id>"
        				+"<nonce_str>"+nonStr+"</nonce_str>"
        				+"<notify_url>"+wx_notify_url+"</notify_url>"
        				+"<out_trade_no>"+orderNo+"</out_trade_no>"
        				//+"<scene_info>{\"h5_info\":{\"type\":\"Wap\",\"wap_url\":\"http://www.yibuwangluo.cn\",\"wap_name\":\"购买茶叶\"}}</scene_info>"
        				+"<spbill_create_ip>120.41.149.248</spbill_create_ip>"
        				+"<total_fee>"+moneyInt+"</total_fee>"
        				+"<trade_type>JSAPI</trade_type>"
        				+"<sign>"+md5StringA+"</sign>"
        				+"</xml>";
        
        //请求统一下单接口
        URL httpUrl = new URL(wx_unifiedorder);
        HttpURLConnection httpURLConnection = (HttpURLConnection) httpUrl.openConnection();
       // httpURLConnection.setRequestProperty("Host", "api.mch.weixin.qq.com");
        httpURLConnection.setDoOutput(true);
        httpURLConnection.setRequestMethod("POST");
        httpURLConnection.setConnectTimeout(10*1000);
        httpURLConnection.setReadTimeout(10*1000);
        httpURLConnection.connect();
        OutputStream outputStream = httpURLConnection.getOutputStream();
        outputStream.write(reqBody.getBytes(UTF8));

        //获取内容
        InputStream inputStream = httpURLConnection.getInputStream();
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream, UTF8));
        final StringBuffer stringBuffer = new StringBuffer();
        String line = null;
        while ((line = bufferedReader.readLine()) != null) {
            stringBuffer.append(line);
        }
        String resp = stringBuffer.toString();
        if (stringBuffer!=null) {
            try {
                bufferedReader.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        if (inputStream!=null) {
            try {
                inputStream.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        if (outputStream!=null) {
            try {
                outputStream.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        Map<String, String> retMap = processResponseXml(resp);
        WXPrepayModel model = new WXPrepayModel();
        if((!retMap.isEmpty())&&(StringUtil.equals(retMap.get("return_code"), "SUCCESS"))){
        	//重新生成签名，二次生成签名
	        String wx_appid2 = propertiesUtil.getProperties("wx_appid");
	        String wx_mch_id2 = propertiesUtil.getProperties("wx_mch_id");
	        String nonStr2 = WXPayUtil.generateNonceStr();
	        String stringA2="appid="+wx_appid2
	        			  +"&noncestr="+nonStr2
	        			  +"&package=Sign=WXPay"
	        			  +"&partnerid="+wx_mch_id2
	        			  +"&prepayid="+retMap.get("prepay_id")
	        			  +"&timestamp="+StringUtil.getTimeStamp();
	        String md5StringA2 = WXPayUtil.MD5(stringA2+"&key="+wx_key);
	        
        	model.setAppId(retMap.get("appid"));
        	model.setPartnerId(retMap.get("mch_id"));
        	model.setPrepayId(retMap.get("prepay_id"));
        	model.setPackageValue("Sign=WXPay");
        	model.setNonceStr(nonStr2);
        	model.setTimeStamp(StringUtil.getTimeStamp());
        	model.setSign(md5StringA2);
        	model.setMwebUrl(retMap.get("mweb_url"));
        	
		    Map<String, Object> dataMap = new HashMap<>();
		    dataMap.put("payInfo", model);
		    data.setCode(Constants.STATUS_CODE.SUCCESS);
		    data.setMessage("获取微信预支付信息成功");
		    data.setData(dataMap); 
		    //保存自己记录
		    //成功充值记录
			CashJournal cash = new CashJournal();
			cash.set("cash_journal_no", orderNo);
			cash.set("member_id", dto.getUserId());
			cash.set("pi_type", Constants.PI_TYPE.ADD_ORDER);
			cash.set("fee_status", Constants.FEE_TYPE_STATUS.APPLING);
			cash.set("occur_date", new Date());
			cash.set("act_rev_amount", moneys);
			cash.set("act_pay_amount", moneys);
			cash.set("opening_balance", moneys);
			cash.set("closing_balance", moneys);
			cash.set("remarks", "微信支付购买"+moneys);
			cash.set("create_time", DateUtil.getNowTimestamp());
			cash.set("update_time", DateUtil.getNowTimestamp());
			boolean saveFlg = CashJournal.dao.saveInfo(cash);
			//保存
			if(saveFlg){
				CashPay pay = new CashPay();
				pay.set("cash_no", orderNo);
				pay.set("params", dto.getTeas());
				//0表示购物车
				pay.set("flg", 0);
				pay.set("create_time", DateUtil.getNowTimestamp());
				pay.set("update_time", DateUtil.getNowTimestamp());
				boolean paySaveFlg = CashPay.dao.saveInfo(pay);
				if(paySaveFlg){
					renderJson(data);
					return;
				}else{
					data.setCode(Constants.STATUS_CODE.FAIL);
					data.setMessage("获取微信预支付信息失败");
					renderJson(data);
					return;
				}
			}else{
				data.setCode(Constants.STATUS_CODE.FAIL);
				data.setMessage("获取微信预支付信息失败");
				renderJson(data);
				return;
			}
		    
        }else{
		    Map<String, Object> dataMap = new HashMap<>();
		    dataMap.put("payInfo", model);
		    data.setCode(Constants.STATUS_CODE.FAIL);
		    data.setMessage("获取微信预支付信息失败");
		    data.setData(dataMap); 
		    renderJson(data);
		    return;
        }
	}
	
	//直接下单获取预支付信息
	public void getOrderPrePayInfo() throws Exception{
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		//总价
		ReturnData data = new ReturnData();
		int wtmItemId = dto.getTeaId();
		int quality = dto.getQuality();
		
		WarehouseTeaMemberItem item = WarehouseTeaMemberItem.dao.queryByKeyId(wtmItemId);
		if(item == null){
			data.setCode(Constants.STATUS_CODE.FAIL);
			data.setMessage("对不起，茶叶数据出错");
			renderJson(data);
			return;
		}
		if(quality <= 0){
			data.setCode(Constants.STATUS_CODE.FAIL);
			data.setMessage("对不起，购买数量不能为0");
			renderJson(data);
			return;
		}
		int itemStock = item.getInt("quality");
		CodeMst sizeType = CodeMst.dao.queryCodestByCode(item.getStr("size_type_cd"));
		if(quality > itemStock){
			data.setCode(Constants.STATUS_CODE.FAIL);
			data.setMessage("对不起，此茶叶库存不足"+quality+sizeType.getStr("name"));
			renderJson(data);
			return;
		}
		System.out.println(wtmItemId+"---"+item.getStr("status"));
		if(StringUtil.isNoneBlank(item.getStr("status"))
				&&(!StringUtil.equals(item.getStr("status"), Constants.TEA_STATUS.ON_SALE))){
			data.setCode(Constants.STATUS_CODE.FAIL);
			data.setMessage("对不起，此茶叶已停售");
			renderJson(data);
			return;
		}
	
		BigDecimal moneys = item.getBigDecimal("price").multiply(new BigDecimal(quality)).setScale(2);
		
		String orderNo = CashJournal.dao.queryCurrentCashNo();
		int moneyInt = moneys.multiply(new BigDecimal("100")).intValue();
		//生成微信支付信息
		PropertiesUtil propertiesUtil = PropertiesUtil.getInstance();
        String wx_appid = propertiesUtil.getProperties("wx_appid");
        String wx_mch_id = propertiesUtil.getProperties("wx_mch_id");
        String wx_key = propertiesUtil.getProperties("wx_key");
        String wx_unifiedorder = propertiesUtil.getProperties("wx_unifiedorder");
        String wx_notify_url = propertiesUtil.getProperties("wxh5_notify_url");
        String nonStr = WXPayUtil.generateNonceStr();
        String UTF8 = "UTF-8";
        String stringA="appid="+wx_appid
        			  +"&body=掌上茶宝-购买茶叶"
        			  +"&mch_id="+wx_mch_id
        			  +"&nonce_str="+nonStr
        			  +"&notify_url="+wx_notify_url
        			  +"&out_trade_no="+orderNo
        			  //+"&scene_info={\"h5_info\":{\"type\":\"Wap\",\"wap_url\":\"http://www.yibuwangluo.cn\",\"wap_name\":\"购买茶叶\"}}"
        			  +"&spbill_create_ip=120.41.149.248"
        			  +"&total_fee="+moneyInt
        			  +"&trade_type=JSAPI";
        String md5StringA = WXPayUtil.MD5(stringA+"&key="+wx_key);
        String reqBody = "<xml>"
        				+"<appid>"+wx_appid+"</appid>"
        				+"<body>掌上茶宝-购买茶叶</body>"
        				+"<mch_id>"+wx_mch_id+"</mch_id>"
        				+"<nonce_str>"+nonStr+"</nonce_str>"
        				+"<notify_url>"+wx_notify_url+"</notify_url>"
        				+"<out_trade_no>"+orderNo+"</out_trade_no>"
        			//	+"<scene_info>{\"h5_info\":{\"type\":\"Wap\",\"wap_url\":\"http://www.yibuwangluo.cn\",\"wap_name\":\"购买茶叶\"}}</scene_info>"
        				+"<spbill_create_ip>120.41.149.248</spbill_create_ip>"
        				+"<total_fee>"+moneyInt+"</total_fee>"
        				+"<trade_type>JSAPI</trade_type>"
        				+"<sign>"+md5StringA+"</sign>"
        				+"</xml>";
        
        //请求统一下单接口
        URL httpUrl = new URL(wx_unifiedorder);
        HttpURLConnection httpURLConnection = (HttpURLConnection) httpUrl.openConnection();
       // httpURLConnection.setRequestProperty("Host", "api.mch.weixin.qq.com");
        httpURLConnection.setDoOutput(true);
        httpURLConnection.setRequestMethod("POST");
        httpURLConnection.setConnectTimeout(10*1000);
        httpURLConnection.setReadTimeout(10*1000);
        httpURLConnection.connect();
        OutputStream outputStream = httpURLConnection.getOutputStream();
        outputStream.write(reqBody.getBytes(UTF8));

        //获取内容
        InputStream inputStream = httpURLConnection.getInputStream();
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream, UTF8));
        final StringBuffer stringBuffer = new StringBuffer();
        String line = null;
        while ((line = bufferedReader.readLine()) != null) {
            stringBuffer.append(line);
        }
        String resp = stringBuffer.toString();
        if (stringBuffer!=null) {
            try {
                bufferedReader.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        if (inputStream!=null) {
            try {
                inputStream.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        if (outputStream!=null) {
            try {
                outputStream.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        Map<String, String> retMap = processResponseXml(resp);
        WXPrepayModel model = new WXPrepayModel();
        if((!retMap.isEmpty())&&(StringUtil.equals(retMap.get("return_code"), "SUCCESS"))){
        	//重新生成签名，二次生成签名
	        String wx_appid2 = propertiesUtil.getProperties("wx_appid");
	        String wx_mch_id2 = propertiesUtil.getProperties("wx_mch_id");
	        String nonStr2 = WXPayUtil.generateNonceStr();
	        String stringA2="appid="+wx_appid2
	        			  +"&noncestr="+nonStr2
	        			  +"&package=Sign=WXPay"
	        			  +"&partnerid="+wx_mch_id2
	        			  +"&prepayid="+retMap.get("prepay_id")
	        			  +"&timestamp="+StringUtil.getTimeStamp();
	        String md5StringA2 = WXPayUtil.MD5(stringA2+"&key="+wx_key);
	        
        	model.setAppId(retMap.get("appid"));
        	model.setPartnerId(retMap.get("mch_id"));
        	model.setPrepayId(retMap.get("prepay_id"));
        	model.setPackageValue("Sign=WXPay");
        	model.setNonceStr(nonStr2);
        	model.setTimeStamp(StringUtil.getTimeStamp());
        	model.setSign(md5StringA2);
        	model.setMwebUrl(retMap.get("mweb_url"));
        	
		    Map<String, Object> dataMap = new HashMap<>();
		    dataMap.put("payInfo", model);
		    data.setCode(Constants.STATUS_CODE.SUCCESS);
		    data.setMessage("获取微信预支付信息成功");
		    data.setData(dataMap); 
		    //保存自己记录
		    //成功充值记录
			CashJournal cash = new CashJournal();
			cash.set("cash_journal_no", orderNo);
			cash.set("member_id", dto.getUserId());
			cash.set("pi_type", Constants.PI_TYPE.ADD_ORDER);
			cash.set("fee_status", Constants.FEE_TYPE_STATUS.APPLING);
			cash.set("occur_date", new Date());
			cash.set("act_rev_amount", moneys);
			cash.set("act_pay_amount", moneys);
			cash.set("opening_balance", moneys);
			cash.set("closing_balance", moneys);
			cash.set("remarks", "微信支付购买"+moneys);
			cash.set("create_time", DateUtil.getNowTimestamp());
			cash.set("update_time", DateUtil.getNowTimestamp());
			boolean saveFlg = CashJournal.dao.saveInfo(cash);
			//保存
			if(saveFlg){
				CashPay pay = new CashPay();
				pay.set("cash_no", orderNo);
				pay.set("params", wtmItemId+","+quality);
				//1表示直接下单
				pay.set("flg", 1);
				pay.set("create_time", DateUtil.getNowTimestamp());
				pay.set("update_time", DateUtil.getNowTimestamp());
				boolean paySaveFlg = CashPay.dao.saveInfo(pay);
				if(paySaveFlg){
					renderJson(data);
					return;
				}else{
					data.setCode(Constants.STATUS_CODE.FAIL);
					data.setMessage("获取微信预支付信息失败");
					renderJson(data);
					return;
				}
			}else{
				data.setCode(Constants.STATUS_CODE.FAIL);
				data.setMessage("获取微信预支付信息失败");
				renderJson(data);
				return;
			}
		    
        }else{
		    Map<String, Object> dataMap = new HashMap<>();
		    dataMap.put("payInfo", model);
		    data.setCode(Constants.STATUS_CODE.FAIL);
		    data.setMessage("获取微信预支付信息失败");
		    data.setData(dataMap); 
		    renderJson(data);
		    return;
        }
	}
	
	public Map<String, String> processResponseXml(String xmlStr) throws Exception{
        String RETURN_CODE = "return_code";
        String return_code;
        Map<String, String> respData = WXPayUtil.xmlToMap(xmlStr);
        if (respData.containsKey(RETURN_CODE)) {
            return_code = respData.get(RETURN_CODE);
        }
        else {
            throw new Exception(String.format("No `return_code` in XML: %s", xmlStr));
        }

        if (return_code.equals(WXPayConstants.FAIL)) {
            return respData;
        }
        else if (return_code.equals(WXPayConstants.SUCCESS)) {
           if (this.isResponseSignatureValid(respData)) {
               return respData;
           }
           else {
               throw new Exception(String.format("Invalid sign value in XML: %s", xmlStr));
           }
        }
        else {
            throw new Exception(String.format("return_code value %s is invalid in XML: %s", return_code, xmlStr));
        }
    }
	
	/**
     * 判断xml数据的sign是否有效，必须包含sign字段，否则返回false。
     *
     * @param reqData 向wxpay post的请求数据
     * @return 签名是否有效
     * @throws Exception
     */
    public boolean isResponseSignatureValid(Map<String, String> reqData) throws Exception {
    	PropertiesUtil propertiesUtil = PropertiesUtil.getInstance();
        String wx_key = propertiesUtil.getProperties("wx_key");
        // 返回数据的签名方式和请求中给定的签名方式是一致的
    	SignType signType = SignType.MD5;
        return WXPayUtil.isSignatureValid(reqData, wx_key, signType);
    }
    
    //微信回调
    public void wxCallBack() throws Exception{
		
		HttpServletRequest request = getRequest();
		PropertiesUtil propertiesUtil = PropertiesUtil.getInstance();
		Map<String,String> params = RequestXml.parseXml(request);
	
		//
		StringBuffer sb = new StringBuffer();
	    InputStream is = request.getInputStream();
	    InputStreamReader isr = new InputStreamReader(is, "UTF-8");
	    BufferedReader br = new BufferedReader(isr);
	    String s = "";
	    while ((s = br.readLine()) != null) {
	        sb.append(s);
	    }
	    Iterator<Entry<String, String>> iterator = params.entrySet().iterator();
	    System.out.println("=======回调的参数========");
	    while(iterator.hasNext()){
	    	Map.Entry<String, String> entry = iterator.next();
	    	System.out.println("key:"+entry.getKey()+"==value:"+entry.getValue());
	    }
	    System.out.println("========================");
	        
		//返回状态码、返回信息
		String returnCode = params.get("return_code");
		String returnMsg = params.get("return_msg");
		System.out.println("return_code:"+returnCode+"--return_msg:"+returnMsg);
		//验证签名
		boolean checkSign = WXPayUtil.isSignatureValid(params, propertiesUtil.getProperties("wx_key"));
		if(checkSign&&(StringUtil.equals(returnCode, "SUCCESS"))&&(StringUtil.isBlank(returnMsg))){
			System.out.println("签名有效");
			//签名有效
			String orderNo = params.get("out_trade_no");
			String trade_no=params.get("transaction_id");
			//交易金额
			//BigDecimal total_fee = new BigDecimal("0");
			//params.get("total_fee");
			
			//PayRecord payRecord = PayRecord.dao.queryByOutTradeNo(orderNo);
			//int userId = 0;
			/*if(payRecord != null){
				userId = payRecord.getInt("member_id");
				total_fee = payRecord.getBigDecimal("moneys");
			}*/
			//更新状态
			int updateFlg = CashJournal.dao.updateStatus(orderNo, Constants.FEE_TYPE_STATUS.APPLY_SUCCESS,trade_no);
			if(updateFlg != 0){
				//PayRecord.dao.updatePay(orderNo, Constants.PAY_STATUS.TRADE_SUCCESS, trade_no);
				renderText("<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>");
			}else{
				renderText("fail");
			}
			System.out.println("微信支付回调成功");
		}else if(checkSign&&(StringUtil.equals(returnCode, "FAIL"))){
			System.out.println("微信支付回调，支付失败");
			//签名有效，失败
			String orderNo = params.get("out_trade_no");
			String trade_no=params.get("transaction_id");
			int updateFlg = CashJournal.dao.updateStatus(orderNo, Constants.FEE_TYPE_STATUS.APPLY_FAIL,trade_no);
			if(updateFlg != 0){
				renderText("<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>");
				renderText("success");
			}else{
				renderText("fail");
			}
		}else{
			System.out.println("微信回调，签名错误");
		}
	}
    
    public void wxLoginCallBack() throws Exception{
		HttpServletRequest request = getRequest();
		System.out.println("code:"+request.getParameter("code"));
		System.out.println("state:"+request.getParameter("state"));
		String ret = HttpRequest.sendGet("https://api.weixin.qq.com/sns/oauth2/access_token", "ppid=wxd01256c927894106&secret=78939AOPQI986202cd38TJ0928ng058K&code="+request.getParameter("code")+"&grant_type=authorization_code");
		System.out.println("ret:"+ret);
		JSONObject retJson1 = new JSONObject(ret);
		System.out.println("openId:"+retJson1.getString("openid"));
    }
    
    //关联门店
    public void bindMember() throws Exception{
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		int loginFlg = onLogin(dto.getUserId(), dto.getUserTypeCd(), dto.getToken(), "020005");
		if(loginFlg != 3){
			ReturnData data = new ReturnData();
			data.setCode(Constants.STATUS_CODE.LOGIN_EXPIRE);
			if(loginFlg == 0){
				data.setMessage("您还未登陆，请先登陆");
			}
			if(loginFlg == 1){
				data.setMessage("您的账号登录过期");
			}
			if(loginFlg == 2){
				data.setMessage("您的账号已在其他终端登录");
			}
			
			getResponse().addHeader("Access-Control-Allow-Origin", "*");
			renderJson(data);
			return;
		}
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.bindMember(dto));
	}
    
    public void queryCheckOrderDetail() throws Exception{
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		int loginFlg = onLogin(dto.getUserId(), dto.getUserTypeCd(), dto.getToken(), "020005");
		if(loginFlg != 3){
			ReturnData data = new ReturnData();
			data.setCode(Constants.STATUS_CODE.LOGIN_EXPIRE);
			if(loginFlg == 0){
				data.setMessage("您还未登陆，请先登陆");
			}
			if(loginFlg == 1){
				data.setMessage("您的账号登录过期");
			}
			if(loginFlg == 2){
				data.setMessage("您的账号已在其他终端登录");
			}
			
			getResponse().addHeader("Access-Control-Allow-Origin", "*");
			renderJson(data);
			return;
		}
		
		
		String queryType = dto.getType();
		RecordListModel model = null;
		if(StringUtil.equals(queryType, Constants.LOG_TYPE_CD.BUY_TEA)){
			//买茶记录
			model = service.queryBuyNewTeaRecordDetail(dto);
		}
		
		if(StringUtil.equals(queryType, Constants.LOG_TYPE_CD.SALE_TEA)){
			//卖茶记录
			model = service.querySaleTeaRecordDetail(dto);
		}
		
		if(StringUtil.equals(queryType, Constants.LOG_TYPE_CD.WAREHOUSE_FEE)){
			//仓储费记录
			model = service.queryWareHouseRecordsDetail(dto);
		}
		
		if(StringUtil.equals(queryType, Constants.LOG_TYPE_CD.GET_TEA)){
			//取茶记录
			model = service.queryGetTeaRecordsModel(dto);
		}
		
		if(StringUtil.equals(queryType, Constants.LOG_TYPE_CD.RECHARGE)){
			//充值记录
			model = service.queryRechargeRecordsDetail(dto);
		}
		
		if(StringUtil.equals(queryType, Constants.LOG_TYPE_CD.WITHDRAW)){
			//提现记录
			model = service.queryWithDrawRecordsDetail(dto);
		}
		
		if(StringUtil.equals(queryType, Constants.LOG_TYPE_CD.REFUND)){
			//退款记录
			model = service.queryRefundRecordsDetail(dto);
		}
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		ReturnData data = new ReturnData();
		data.setCode(Constants.STATUS_CODE.SUCCESS);
		data.setMessage("查询成功");
		Map<String, Object> map = new HashMap<>();
		map.put("data", model);
		data.setData(map);
		renderJson(data);
	}
    
    public void queryAddOrderList(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		int loginFlg = onLogin(dto.getUserId(), dto.getUserTypeCd(), dto.getToken(), "020005");
		if(loginFlg != 3){
			ReturnData data = new ReturnData();
			data.setCode(Constants.STATUS_CODE.LOGIN_EXPIRE);
			if(loginFlg == 0){
				data.setMessage("您还未登陆，请先登陆");
			}
			if(loginFlg == 1){
				data.setMessage("您的账号登录过期");
			}
			if(loginFlg == 2){
				data.setMessage("您的账号已在其他终端登录");
			}
			
			getResponse().addHeader("Access-Control-Allow-Origin", "*");
			renderJson(data);
			return;
		}
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.queryBuyCartListsForPay(dto));
	}
    
    public void getData(){
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		ReturnData data = new ReturnData();
		//获取普通接口access_token
		//{"access_token":"9_ayVikot_KLJlDk96aOXJ_Uc7mxqsER0FwwuzkHmB7WeuLkjpYVExL16W508IjbyQd496RDd1o2g9XOcUpT0G6EAoAtGgZoM7uuX5vtBTx56CTTpgk9zF8z9qqJh-6AdSdZVJtJcCs6A57TqlCYEcAAAFBH","expires_in":7200}
		String retJson = HttpRequest.sendGet("https://api.weixin.qq.com/cgi-bin/token", "grant_type=client_credential&appid=wxfb13c4770990aeed&secret=f48f307963115e674255e2238b31d871");
		try {
			JSONObject retJson1 = new JSONObject(retJson);
			String accessToken = retJson1.getString("access_token");
			System.out.println("accessToken:"+retJson1.getString("access_token"));
			String retJson2 = HttpRequest.sendGet("https://api.weixin.qq.com/cgi-bin/ticket/getticket", "access_token="+accessToken+"&type=jsapi");
			JSONObject retJson3 = new JSONObject(retJson2);
			String ticket = retJson3.getString("ticket");
			
			Map<String, String> map1 = Sign.sign(ticket, "http://app.tongjichaye.com/zznjwx/wx/pages/store/store_list_desc.html");
			MapWxData map = new MapWxData();
			map.setAppId("wxfb13c4770990aeed");
			map.setNonceStr(map1.get("nonceStr"));
			map.setTimestamp(map1.get("timestamp"));
			map.setSignature(map1.get("signature"));
			data.setData(map);
			data.setCode(Constants.STATUS_CODE.SUCCESS);
			renderJson(data);
			//ticket 
			//{"errcode":0,"errmsg":"ok","ticket":"HoagFKDcsGMVCIY2vOjf9qApGHHu2Z24NkT1dQLud9N6E1WQkiizCOaffeWLbsdHp7LEZ6WHQh9BbdQPdq5jmA","expires_in":7200}
		} catch (JSONException e) {
			data.setCode(Constants.STATUS_CODE.FAIL);
			data.setMessage("导航失败，请重试");
			data.setData(null);
			renderJson(data);
			e.printStackTrace();
		}
	}
    
    public void getData1(){
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		ReturnData data = new ReturnData();
		//获取普通接口access_token
		//{"access_token":"9_ayVikot_KLJlDk96aOXJ_Uc7mxqsER0FwwuzkHmB7WeuLkjpYVExL16W508IjbyQd496RDd1o2g9XOcUpT0G6EAoAtGgZoM7uuX5vtBTx56CTTpgk9zF8z9qqJh-6AdSdZVJtJcCs6A57TqlCYEcAAAFBH","expires_in":7200}
		String retJson = HttpRequest.sendGet("https://api.weixin.qq.com/cgi-bin/token", "grant_type=client_credential&appid=wxfb13c4770990aeed&secret=f48f307963115e674255e2238b31d871");
		try {
			JSONObject retJson1 = new JSONObject(retJson);
			String accessToken = retJson1.getString("access_token");
			System.out.println("accessToken:"+retJson1.getString("access_token"));
			String retJson2 = HttpRequest.sendGet("https://api.weixin.qq.com/cgi-bin/ticket/getticket", "access_token="+accessToken+"&type=jsapi");
			JSONObject retJson3 = new JSONObject(retJson2);
			String ticket = retJson3.getString("ticket");
			
			Map<String, String> map1 = Sign.sign(ticket, "http://app.tongjichaye.com/zznjwx/wx/pages/store/store_desc.html");
			MapWxData map = new MapWxData();
			map.setAppId("wxfb13c4770990aeed");
			map.setNonceStr(map1.get("nonceStr"));
			map.setTimestamp(map1.get("timestamp"));
			map.setSignature(map1.get("signature"));
			data.setData(map);
			data.setCode(Constants.STATUS_CODE.SUCCESS);
			renderJson(data);
			//ticket 
			//{"errcode":0,"errmsg":"ok","ticket":"HoagFKDcsGMVCIY2vOjf9qApGHHu2Z24NkT1dQLud9N6E1WQkiizCOaffeWLbsdHp7LEZ6WHQh9BbdQPdq5jmA","expires_in":7200}
		} catch (JSONException e) {
			data.setCode(Constants.STATUS_CODE.FAIL);
			data.setMessage("导航失败，请重试");
			data.setData(null);
			renderJson(data);
			e.printStackTrace();
		}
	}
}
