package my.pvcloud.model;

import java.io.Serializable;

public class MapWxData implements Serializable{

	private String appId;
	private String timestamp;
	private String nonceStr;
	private String signature;
	public String getAppId() {
		return appId;
	}
	public String getTimestamp() {
		return timestamp;
	}
	public String getNonceStr() {
		return nonceStr;
	}
	public String getSignature() {
		return signature;
	}
	public void setAppId(String appId) {
		this.appId = appId;
	}
	public void setTimestamp(String timestamp) {
		this.timestamp = timestamp;
	}
	public void setNonceStr(String nonceStr) {
		this.nonceStr = nonceStr;
	}
	public void setSignature(String signature) {
		this.signature = signature;
	}
}
