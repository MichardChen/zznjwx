package my.wx.controller;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.Map;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.ExcessiveAttemptsException;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.LockedAccountException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.subject.Subject;
import org.huadalink.plugin.shiro.CaptchaUsernamePasswordToken;
import org.huadalink.plugin.shiro.IncorrectCaptchaException;
import org.huadalink.route.ControllerBind;

import com.jfinal.aop.Enhancer;
import com.jfinal.core.Controller;

import my.core.constants.Constants;
import my.core.model.AcceessToken;
import my.core.model.Document;
import my.core.model.Member;
import my.core.model.ReturnData;
import my.core.vo.UserData;
import my.pvcloud.dto.LoginDTO;
import my.pvcloud.util.DateUtil;
import my.pvcloud.util.StringUtil;
import my.pvcloud.util.TextUtil;
import my.pvcloud.util.VertifyUtil;
import my.wx.service.WXService;

@ControllerBind(key = "/wxnonAuthRest", path = "/wx")
public class WXNoAuthController extends Controller{

	WXService service=Enhancer.enhance(WXService.class);
	
	/*public void loginExpire(){
		ReturnData data = new ReturnData();
		data.setCode(Constants.STATUS_CODE.LOGIN_EXPIRE);
		data.setMessage("您还未登陆，请先登陆");
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		renderJson(data);
	}*/
	
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
	
	public void loginInit() throws Exception{
		render("/wx/pages/login.html");
	}
	
	//获取注册验证码
	public void getCheckCode() throws Exception{
		LoginDTO dto =  LoginDTO.getInstance(getRequest());
		String code = VertifyUtil.getVertifyCode();
		dto.setCode(code);
		dto.setUserTypeCd("010001");
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.getCheckCodePlus(dto));
	}
	
	public void login(){
		
		ReturnData data = new ReturnData();
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		String mobile = getPara("mobile");
		String password = getPara("password");
		String captcha = getPara("captcha");
		
		//登陆验证
		CaptchaUsernamePasswordToken token = new CaptchaUsernamePasswordToken(mobile, password, captcha);
		
		Subject subject = SecurityUtils.getSubject();
		String code = "5700";
		String msg;
		try{
			if(!subject.isAuthenticated()){
				subject.login(token);
			}
			code = "5600";
			msg = "登录成功";
			Member member = Member.dao.queryMember(mobile, password);
			String accessToken = TextUtil.generateUUID();
			//String accessToken = "6aa1c3b464074590ad1f37af0fd2aa67";
			UserData userData = new UserData();
			userData.setUserId(member.getInt("id"));
			userData.setToken(accessToken);
			userData.setMobile(mobile);
			userData.setUserTypeCd("010001");
			//判断access_token表是否存储
			AcceessToken aToken = AcceessToken.dao.queryToken(member.getInt("id"), "010001", "020005");
			if(aToken != null){
				//更新
				AcceessToken.dao.updateToken(member.getInt("id"), accessToken, "020005");
			}else{
				//新增
				AcceessToken.dao.saveToken(member.getInt("id"), "010001", accessToken, "020005");
			}
			data.setData(userData);
		} catch (IncorrectCaptchaException e) {
			msg = "验证码错误!";
		} catch (UnknownAccountException e) {
			msg = "账号不存在!";
		} catch (IncorrectCredentialsException e) {
			msg = "用户名密码错误!";
		} catch (LockedAccountException e) {
			msg = "账号被锁定!";
		} catch (ExcessiveAttemptsException e) {
			msg = "尝试次数过多 请明天再试!";
		} catch (AuthenticationException e) {
			msg = "对不起 没有权限访问!";
		} catch (Exception e) {
			e.printStackTrace();
			msg = "请重新登录!";
			code = "5700";
		}
		data.setCode(code);
		data.setMessage(msg);
		
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		renderJson(data);
	}
	
	//注册
	public void register() throws Exception{
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		ReturnData rt = service.register(dto);
		if(StringUtil.equals(rt.getCode(), Constants.STATUS_CODE.SUCCESS)){
			
			CaptchaUsernamePasswordToken token = new CaptchaUsernamePasswordToken(dto.getMobile(), dto.getUserPwd(), "");
			Subject subject = SecurityUtils.getSubject();
			String code = "5700";
			String msg;
			try{
				if(!subject.isAuthenticated()){
					subject.login(token);
				}
				code = "5600";
				msg = "登录成功";
				Member member = Member.dao.queryMember(dto.getMobile(), dto.getUserPwd());
				String accessToken = TextUtil.generateUUID();
				UserData userData = new UserData();
				userData.setUserId(member.getInt("id"));
				userData.setToken(accessToken);
				userData.setMobile(dto.getMobile());
				userData.setUserTypeCd("010001");
				//判断access_token表是否存储
				AcceessToken aToken = AcceessToken.dao.queryToken(member.getInt("id"), "010001", "020005");
				if(aToken != null){
					//更新
					AcceessToken.dao.updateToken(member.getInt("id"), accessToken, "020005");
				}else{
					//新增
					AcceessToken.dao.saveToken(member.getInt("id"), "010001", accessToken, "020005");
				}
				rt.setData(userData);
			} catch (IncorrectCaptchaException e) {
				msg = "验证码错误!";
			} catch (UnknownAccountException e) {
				msg = "账号不存在!";
			} catch (IncorrectCredentialsException e) {
				msg = "用户名密码错误!";
			} catch (LockedAccountException e) {
				msg = "账号被锁定!";
			} catch (ExcessiveAttemptsException e) {
				msg = "尝试次数过多 请明天再试!";
			} catch (AuthenticationException e) {
				msg = "对不起 没有权限访问!";
			} catch (Exception e) {
				code = "5700";
				e.printStackTrace();
				msg = "请重新登录!";
			}
			getResponse().addHeader("Access-Control-Allow-Origin", "*");
			renderJson(rt);
		}else{
			getResponse().addHeader("Access-Control-Allow-Origin", "*");
			renderJson(rt);
		}
	}
	
	//获取忘记密码验证码
	public void getForgetCheckCode() throws Exception{
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.getForgetCheckCode(dto));
	}
	
	public void saveForgetPwd() throws Exception{
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.saveForgetPwd(dto));
	}
	
	//退出
	public void logout() throws Exception{
		
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
	
	//资讯列表
	public void queryNewsList() throws Exception{
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.queryNewsList(dto));
	}
	
	//首页
	public void index() throws Exception{
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		dto.setUserId(getSessionAttr("memberId")==null?0:(Integer)getSessionAttr("memberId"));
		dto.setMobile((String)getSessionAttr("mobile"));
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		//获取初始化数据
		renderJson(service.index(dto));
	}
	
	//获取文档列表
	public void getDocumentList(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.getDocumentList(dto));
	}
	
	//跳转文档
	public void queryDocument() throws Exception{
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		Document document = Document.dao.queryByTypeCd(dto.getType());
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		ReturnData data = new ReturnData();
		Map<String, Object> map = new HashMap<>();
		if(document != null){
			data.setCode(Constants.STATUS_CODE.SUCCESS);
			data.setMessage("查询成功");
			map.put("url", document.getStr("desc_url"));
		}else{
			data.setCode(Constants.STATUS_CODE.FAIL);
			data.setMessage("查询失败");
			map.put("url", "");
		}
		data.setData(map);
		renderJson(data);
	}
	
	//联系我们
	public void contactUs(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		getResponse().addHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.contactUs(dto));
	}
	
	//授权重定向接口
	public void redirectAuth(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		System.out.println("授权登陆重定向接口。。。。。。。。。。。。。。");
		System.out.println("code:"+dto.getCode());
		renderJson(service.contactUs(dto));
	}
}
