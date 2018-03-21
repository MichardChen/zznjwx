package my.core.vo;

import java.io.Serializable;

public class MemberVO implements Serializable{

	private int id;
	private String name;
	private String mobile;
	private String createTime;
	private String moneys;
	private String sex;
	private String userName;
	private String store;
	private String applingMoneys;
	private String applyedMoneys;
	private String rechargeMoneys;
	private String remark;
	private String keyCode;
	private String bankStatus;
	private int openStore;
	private int storeId;
	private String role;
	private String roleCd;
	
	
	
	public String getRoleCd() {
		return roleCd;
	}
	public void setRoleCd(String roleCd) {
		this.roleCd = roleCd;
	}
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	public int getStoreId() {
		return storeId;
	}
	public void setStoreId(int storeId) {
		this.storeId = storeId;
	}
	public int getOpenStore() {
		return openStore;
	}
	public void setOpenStore(int openStore) {
		this.openStore = openStore;
	}
	public String getBankStatus() {
		return bankStatus;
	}
	public void setBankStatus(String bankStatus) {
		this.bankStatus = bankStatus;
	}
	public String getKeyCode() {
		return keyCode;
	}
	public void setKeyCode(String keyCode) {
		this.keyCode = keyCode;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	public String getRechargeMoneys() {
		return rechargeMoneys;
	}
	public void setRechargeMoneys(String rechargeMoneys) {
		this.rechargeMoneys = rechargeMoneys;
	}
	public String getApplingMoneys() {
		return applingMoneys;
	}
	public String getApplyedMoneys() {
		return applyedMoneys;
	}
	public void setApplingMoneys(String applingMoneys) {
		this.applingMoneys = applingMoneys;
	}
	public void setApplyedMoneys(String applyedMoneys) {
		this.applyedMoneys = applyedMoneys;
	}
	public String getStore() {
		return store;
	}
	public void setStore(String store) {
		this.store = store;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public int getId() {
		return id;
	}
	public String getName() {
		return name;
	}
	public String getMobile() {
		return mobile;
	}
	public String getCreateTime() {
		return createTime;
	}
	public String getMoneys() {
		return moneys;
	}
	public String getSex() {
		return sex;
	}
	public void setId(int id) {
		this.id = id;
	}
	public void setName(String name) {
		this.name = name;
	}
	public void setMobile(String mobile) {
		this.mobile = mobile;
	}
	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}
	public void setMoneys(String moneys) {
		this.moneys = moneys;
	}
	public void setSex(String sex) {
		this.sex = sex;
	}
	
	
}
