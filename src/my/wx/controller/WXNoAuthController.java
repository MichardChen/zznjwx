package my.wx.controller;

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
import my.core.model.Document;
import my.core.model.Log;
import my.core.model.Member;
import my.core.model.ReturnData;
import my.pvcloud.dto.LoginDTO;
import my.pvcloud.util.StringUtil;
import my.pvcloud.util.VertifyUtil;
import my.wx.service.WXService;

@ControllerBind(key = "/wxnonAuthRest", path = "/wx")
public class WXNoAuthController extends Controller{

	WXService service=Enhancer.enhance(WXService.class);
	
	public void loginExpire(){
		ReturnData data = new ReturnData();
		data.setCode(Constants.STATUS_CODE.LOGIN_EXPIRE);
		data.setMessage("您还未登陆，请先登陆");
		getResponse().setHeader("Access-Control-Allow-Origin", "*");
		renderJson(data);
	}
	
	//获取注册验证码
	public void getCheckCode() throws Exception{
		LoginDTO dto =  LoginDTO.getInstance(getRequest());
		String code = VertifyUtil.getVertifyCode();
		dto.setCode(code);
		dto.setUserTypeCd("010001");
		getResponse().setHeader("Access-Control-Allow-Origin", "*");
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
			setSessionAttr("mobile", mobile);
			code = "5600";
			msg = "登录成功";
			Member member = Member.dao.queryMember(mobile, password);
			setSessionAttr("memberId", member.get("id"));
			setSessionAttr("userTypeCd", "010001");
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
		}
		data.setCode(code);
		data.setMessage(msg);
		getResponse().setHeader("Access-Control-Allow-Origin", "*");
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
				setSessionAttr("mobile", dto.getMobile());
				code = "5600";
				msg = "登录成功";
				Member member = Member.dao.queryMember(dto.getMobile(), dto.getUserPwd());
				setSessionAttr("memberId", member.get("id"));
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
			}
			getResponse().setHeader("Access-Control-Allow-Origin", "*");
			renderJson(rt);
		}else{
			getResponse().setHeader("Access-Control-Allow-Origin", "*");
			renderJson(rt);
		}
	}
	
	//获取忘记密码验证码
	public void getForgetCheckCode() throws Exception{
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		getResponse().setHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.getForgetCheckCode(dto));
	}
	
	//退出
	public void logout() {
		ReturnData data = new ReturnData();
		Subject subject = SecurityUtils.getSubject();
		if (subject != null) {
			subject.logout();
		}
		data.setCode(Constants.STATUS_CODE.SUCCESS);
		data.setMessage("退出成功");
		getResponse().setHeader("Access-Control-Allow-Origin", "*");
		renderJson(data);
	}
	
	//资讯列表
	public void queryNewsList() throws Exception{
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		getResponse().setHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.queryNewsList(dto));
	}
	
	//首页
	public void index() throws Exception{
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		dto.setUserId(getSessionAttr("memberId")==null?0:(Integer)getSessionAttr("memberId"));
		dto.setMobile((String)getSessionAttr("mobile"));
		getResponse().setHeader("Access-Control-Allow-Origin", "*");
		//获取初始化数据
		renderJson(service.index(dto));
	}
	
	//获取文档列表
	public void getDocumentList(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		getResponse().setHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.getDocumentList(dto));
	}
	
	//跳转文档
	public void queryDocument() throws Exception{
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		Document document = Document.dao.queryByTypeCd(dto.getType());
		if(document != null){
			redirect(document.getStr("desc_url"));
		}
	}
	
	//联系我们
	public void contactUs(){
		LoginDTO dto = LoginDTO.getInstance(getRequest());
		getResponse().setHeader("Access-Control-Allow-Origin", "*");
		renderJson(service.contactUs(dto));
	}
}
