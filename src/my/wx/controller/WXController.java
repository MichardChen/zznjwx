package my.wx.controller;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.ExcessiveAttemptsException;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.LockedAccountException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.servlet.Cookie;
import org.huadalink.plugin.shiro.CaptchaUsernamePasswordToken;
import org.huadalink.plugin.shiro.IncorrectCaptchaException;
import org.huadalink.route.ControllerBind;

import com.jfinal.aop.Enhancer;
import com.jfinal.core.Controller;

import my.core.constants.Constants;
import my.core.model.Log;
import my.core.model.Member;
import my.core.model.ReturnData;
import my.pvcloud.dto.LoginDTO;
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
		renderJson(data);
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
			/*if(StringUtil.equals(code, Constants.STATUS_CODE.SUCCESS)){
				//登陆成功
				dto.setUserId((Integer)getSessionAttr("memberId"));
				dto.setMobile(mobile);
				ReturnData retData = service.index(dto);
				data.setData(retData.getData());
			}*/
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
		renderJson(data);
	}
	
	/**
	 * 返回登录界面
	 */
	public void checkout() {
		Log.dao.saveLogInfo((Integer)getSessionAttr("memberId"), Constants.USER_TYPE.USER_TYPE_CLIENT, "微信端退出");
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
		dto.setUserId(getSessionAttr("memberId")==null?0:(Integer)getSessionAttr("memberId"));
		renderJson(service.queryPersonData(dto));
	}
}
