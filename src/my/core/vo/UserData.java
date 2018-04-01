package my.core.vo;

import java.io.Serializable;

import javax.servlet.ServletRequest;

public class UserData implements Serializable{

	private int userId;
	private String token;
	private String mobile;
	private String userTypeCd;
	
	public String getMobile() {
		return mobile;
	}
	public void setMobile(String mobile) {
		this.mobile = mobile;
	}
	public String getUserTypeCd() {
		return userTypeCd;
	}
	public void setUserTypeCd(String userTypeCd) {
		this.userTypeCd = userTypeCd;
	}
	public int getUserId() {
		return userId;
	}
	public void setUserId(int userId) {
		this.userId = userId;
	}
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	
	
}
