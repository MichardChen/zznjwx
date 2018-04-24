package my.pvcloud.dto;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;

import javax.servlet.http.HttpServletRequest;

import my.pvcloud.util.StringUtil;

public class LoginDTO extends BaseDTO{

	public LoginDTO(){}
	
	public static LoginDTO getInstance(HttpServletRequest request){
		LoginDTO dto = new LoginDTO();
		try {
			request.setCharacterEncoding("utf-8");
			dto.setTitleTypeCd(StringUtil.checkCode(request.getParameter("titleTypeCd")));
			dto.setTaxNo(StringUtil.checkCode(request.getParameter("taxNo")));
			dto.setContent(StringUtil.checkCode(request.getParameter("content")));
			dto.setBank(StringUtil.checkCode(request.getParameter("bank")));
			dto.setAccount(StringUtil.checkCode(request.getParameter("account")));
			dto.setMail(StringUtil.checkCode(request.getParameter("mail")));
			dto.setStatus(StringUtil.checkCode(request.getParameter("status")));
			
			dto.setMobile(request.getParameter("mobile"));
			dto.setUserTypeCd(request.getParameter("userTypeCd"));
			dto.setUserPwd(request.getParameter("userPwd"));
			dto.setUserId(StringUtil.toInteger(request.getParameter("userId")));
			dto.setToken(request.getParameter("token"));
			dto.setAccessToken(request.getParameter("accessToken"));
			dto.setCode(request.getParameter("code"));
			dto.setOldPwd(request.getParameter("oldPwd"));
			dto.setNewPwd(request.getParameter("newPwd"));
			dto.setUserName(StringUtil.checkCode(request.getParameter("userName")));
			dto.setUserPwd(request.getParameter("userPwd"));
			dto.setRememberMe(StringUtil.toInteger(request.getParameter("rememberMe")));
			dto.setNickName(StringUtil.checkCode(request.getParameter("nickName")));
			dto.setSex(StringUtil.toInteger(request.getParameter("sex")));
			dto.setStore(StringUtil.toInteger(request.getParameter("store")));
			dto.setPageNum(StringUtil.toInteger(request.getParameter("pageNum")));
			dto.setPageSize(StringUtil.toInteger(request.getParameter("pageSize")));
			dto.setNewsId(StringUtil.toInteger(request.getParameter("newsId")));
			dto.setDeviceToken(request.getParameter("deviceToken"));
			dto.setQq(StringUtil.checkCode(request.getParameter("qq")));
			dto.setWx(StringUtil.checkCode(request.getParameter("wx")));
			dto.setCardNo(request.getParameter("cardNo"));
			dto.setProvinceId(StringUtil.toInteger(request.getParameter("provinceId")));
			dto.setCityId(StringUtil.toInteger(request.getParameter("cityId")));
			dto.setDistrictId(StringUtil.toInteger(request.getParameter("districtId")));
			dto.setReceiveMan(StringUtil.checkCode(request.getParameter("receiveMan")));
			dto.setLinkMan(StringUtil.checkCode(request.getParameter("linkMan")));
			dto.setAddress(StringUtil.checkCode(request.getParameter("address")));
			dto.setId(StringUtil.toInteger(request.getParameter("id")));
			dto.setFlg(StringUtil.toInteger(request.getParameter("flg")));
			dto.setFeedBack(StringUtil.checkCode(request.getParameter("feedBack")));
			dto.setVersion(request.getParameter("version"));
			dto.setPlatForm(request.getParameter("platForm"));
			dto.setVersionTypeCd(request.getParameter("versionTypeCd"));
			dto.setType(request.getParameter("typeCd"));
			dto.setQuality(StringUtil.toInteger(request.getParameter("quality")));
			dto.setTeaId(StringUtil.toInteger(request.getParameter("teaId")));
			dto.setCartId(StringUtil.toInteger(request.getParameter("cartId")));
			dto.setBuyCartIds(request.getParameter("buyCartIds"));
			dto.setDate(StringUtil.checkCode(request.getParameter("date")));
			dto.setSize(request.getParameter("size"));
			dto.setName(StringUtil.checkCode(request.getParameter("name")));
			dto.setWareHouseId(StringUtil.toInteger(request.getParameter("wareHouseId")));
			dto.setPriceType(request.getParameter("priceFlg"));
			dto.setPrice(StringUtil.toBigDecimal(request.getParameter("price")));
			dto.setAddressId(StringUtil.toInteger(request.getParameter("addressId")));
			dto.setOrderNo(request.getParameter("orderNo"));
			dto.setCardTypeCd(request.getParameter("cardTypeCd"));
			dto.setIdCardNo(request.getParameter("idCardNo"));
			dto.setMoney(StringUtil.toBigDecimal(request.getParameter("money")));
			dto.setPayPwd(request.getParameter("payPwd"));
			dto.setStoreId(StringUtil.toInteger(request.getParameter("storeId")));
			dto.setBusinessId(StringUtil.toInteger(request.getParameter("businessId")));
			dto.setTeas(StringUtil.checkCode(request.getParameter("teas")));
			dto.setCityDistrict(StringUtil.checkCode(request.getParameter("cityDistrict")));
			dto.setSellerId(StringUtil.toInteger(request.getParameter("sellerId")));
			dto.setInvateCode(StringUtil.checkCode(request.getParameter("inviteCode")));
			dto.setOpenBankName(StringUtil.checkCode(request.getParameter("openBankName")));
			dto.setLocalLongtitude(StringUtil.checkCode(request.getParameter("localLongtitude")));
			dto.setLocalLatitude(StringUtil.checkCode(request.getParameter("localLatitude")));
			dto.setLongtitude1(StringUtil.checkCode(request.getParameter("longtitude1")));
			dto.setLatitude1(StringUtil.checkCode(request.getParameter("latitude1")));
			dto.setLongtitude2(StringUtil.checkCode(request.getParameter("longtitude2")));
			dto.setLatitude3(StringUtil.checkCode(request.getParameter("latitude3")));
			dto.setMessageId(StringUtil.toInteger(StringUtil.checkCode(request.getParameter("messageId"))));
			
			dto.setServicePoint(StringUtil.toInteger(StringUtil.checkCode(request.getParameter("servicePoint"))));
			dto.setTeaPoint(StringUtil.toInteger(StringUtil.checkCode(request.getParameter("teaPoint"))));
			dto.setSenitationPoint(StringUtil.toInteger(StringUtil.checkCode(request.getParameter("senitationPoint"))));
			dto.setMark(StringUtil.checkCode(request.getParameter("mark")));
			dto.setTitle(StringUtil.checkCode(request.getParameter("title")));
			dto.setInvoiceIds(StringUtil.checkCode(request.getParameter("invoiceIds")));
			dto.setMemberId(StringUtil.toInteger(StringUtil.checkCode(request.getParameter("memberId"))));
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		return dto;
	}
	
	private int memberId;
	private String title;
	private int messageId;
	private String openBankName;
	private int sellerId;
	private String idCardImg;
	private String cityDistrict;
	private String teas;
	private int businessId;
	private int storeId;
	private String payPwd;
	private BigDecimal money;
	private String idCardNo;
	private String cardTypeCd;
	private String orderNo;
	private int addressId;
	private BigDecimal price;
	private int wareHouseId;
	private String priceType;
	private String name;
	private String size;
	private int cartId;
	private String type;
	private String versionTypeCd;
	private String version;
	private String feedBack;
	private int sex;
	private String userName;
	private String userPwd;
	private int rememberMe;
	private String code;
	private String oldPwd;
	private String newPwd;
	private String nickName;
	private int adminId;
	private int store;
	private int newsId;
	private String deviceToken;
	private String icon;
	private String qq;
	private String wx;
	private String cardNo;
	private int provinceId;
	private int cityId;
	private int districtId;
	private String receiveMan;
	private String linkMan;
	private String address;
	private int id;
	private int quality;
	private int teaId; 
	private String buyCartIds;
	private String date;
	private String invateCode;
	
	private String localLongtitude;
	private String localLatitude;
	private String longtitude1;
	private String latitude1;
	private String longtitude2;
	private String latitude3;
	
	private int servicePoint;
	private int teaPoint;
	private int senitationPoint;
	private String mark;
	
	private String titleTypeCd;
	private String taxNo;
	private String content;
	private String bank;
	private String account;
	private String mail;
	private String status;
	private String invoiceIds;
	private String tradeNo;
	
	public String getTradeNo() {
		return tradeNo;
	}

	public void setTradeNo(String tradeNo) {
		this.tradeNo = tradeNo;
	}

	public int getMemberId() {
		return memberId;
	}

	public void setMemberId(int memberId) {
		this.memberId = memberId;
	}

	public String getInvoiceIds() {
		return invoiceIds;
	}

	public void setInvoiceIds(String invoiceIds) {
		this.invoiceIds = invoiceIds;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getTitleTypeCd() {
		return titleTypeCd;
	}

	public void setTitleTypeCd(String titleTypeCd) {
		this.titleTypeCd = titleTypeCd;
	}

	public String getTaxNo() {
		return taxNo;
	}

	public void setTaxNo(String taxNo) {
		this.taxNo = taxNo;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}
	public String getBank() {
		return bank;
	}

	public void setBank(String bank) {
		this.bank = bank;
	}

	public String getAccount() {
		return account;
	}

	public void setAccount(String account) {
		this.account = account;
	}

	public String getMail() {
		return mail;
	}

	public void setMail(String mail) {
		this.mail = mail;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getMark() {
		return mark;
	}

	public void setMark(String mark) {
		this.mark = mark;
	}

	public int getServicePoint() {
		return servicePoint;
	}

	public void setServicePoint(int servicePoint) {
		this.servicePoint = servicePoint;
	}

	public int getTeaPoint() {
		return teaPoint;
	}

	public void setTeaPoint(int teaPoint) {
		this.teaPoint = teaPoint;
	}

	public int getSenitationPoint() {
		return senitationPoint;
	}

	public void setSenitationPoint(int senitationPoint) {
		this.senitationPoint = senitationPoint;
	}

	public int getMessageId() {
		return messageId;
	}

	public void setMessageId(int messageId) {
		this.messageId = messageId;
	}

	public String getLocalLongtitude() {
		return localLongtitude;
	}

	public String getLocalLatitude() {
		return localLatitude;
	}

	public String getLongtitude1() {
		return longtitude1;
	}

	public String getLatitude1() {
		return latitude1;
	}

	public String getLongtitude2() {
		return longtitude2;
	}

	public String getLatitude3() {
		return latitude3;
	}

	public void setLocalLongtitude(String localLongtitude) {
		this.localLongtitude = localLongtitude;
	}

	public void setLocalLatitude(String localLatitude) {
		this.localLatitude = localLatitude;
	}

	public void setLongtitude1(String longtitude1) {
		this.longtitude1 = longtitude1;
	}

	public void setLatitude1(String latitude1) {
		this.latitude1 = latitude1;
	}

	public void setLongtitude2(String longtitude2) {
		this.longtitude2 = longtitude2;
	}

	public void setLatitude3(String latitude3) {
		this.latitude3 = latitude3;
	}

	public String getOpenBankName() {
		return openBankName;
	}

	public void setOpenBankName(String openBankName) {
		this.openBankName = openBankName;
	}

	public String getInvateCode() {
		return invateCode;
	}

	public void setInvateCode(String invateCode) {
		this.invateCode = invateCode;
	}

	public int getSellerId() {
		return sellerId;
	}

	public void setSellerId(int sellerId) {
		this.sellerId = sellerId;
	}

	public String getIdCardImg() {
		return idCardImg;
	}

	public void setIdCardImg(String idCardImg) {
		this.idCardImg = idCardImg;
	}

	public String getCityDistrict() {
		return cityDistrict;
	}

	public void setCityDistrict(String cityDistrict) {
		this.cityDistrict = cityDistrict;
	}

	public String getTeas() {
		return teas;
	}

	public void setTeas(String teas) {
		this.teas = teas;
	}

	public int getBusinessId() {
		return businessId;
	}

	public void setBusinessId(int businessId) {
		this.businessId = businessId;
	}

	public int getStoreId() {
		return storeId;
	}

	public void setStoreId(int storeId) {
		this.storeId = storeId;
	}

	public String getPayPwd() {
		return payPwd;
	}

	public void setPayPwd(String payPwd) {
		this.payPwd = payPwd;
	}

	public BigDecimal getMoney() {
		return money;
	}

	public void setMoney(BigDecimal money) {
		this.money = money;
	}

	public String getIdCardNo() {
		return idCardNo;
	}

	public void setIdCardNo(String idCardNo) {
		this.idCardNo = idCardNo;
	}

	public String getCardTypeCd() {
		return cardTypeCd;
	}

	public void setCardTypeCd(String cardTypeCd) {
		this.cardTypeCd = cardTypeCd;
	}

	public String getOrderNo() {
		return orderNo;
	}

	public void setOrderNo(String orderNo) {
		this.orderNo = orderNo;
	}

	public int getAddressId() {
		return addressId;
	}

	public void setAddressId(int addressId) {
		this.addressId = addressId;
	}

	public BigDecimal getPrice() {
		return price;
	}

	public void setPrice(BigDecimal price) {
		this.price = price;
	}

	public int getWareHouseId() {
		return wareHouseId;
	}

	public void setWareHouseId(int wareHouseId) {
		this.wareHouseId = wareHouseId;
	}

	public String getPriceType() {
		return priceType;
	}

	public void setPriceType(String priceType) {
		this.priceType = priceType;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getSize() {
		return size;
	}

	public void setSize(String size) {
		this.size = size;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public String getBuyCartIds() {
		return buyCartIds;
	}

	public void setBuyCartIds(String buyCartIds) {
		this.buyCartIds = buyCartIds;
	}

	public int getCartId() {
		return cartId;
	}

	public void setCartId(int cartId) {
		this.cartId = cartId;
	}

	public int getQuality() {
		return quality;
	}

	public int getTeaId() {
		return teaId;
	}

	public void setQuality(int quality) {
		this.quality = quality;
	}

	public void setTeaId(int teaId) {
		this.teaId = teaId;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getVersionTypeCd() {
		return versionTypeCd;
	}

	public void setVersionTypeCd(String versionTypeCd) {
		this.versionTypeCd = versionTypeCd;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public String getFeedBack() {
		return feedBack;
	}

	public void setFeedBack(String feedBack) {
		this.feedBack = feedBack;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getLinkMan() {
		return linkMan;
	}

	public void setLinkMan(String linkMan) {
		this.linkMan = linkMan;
	}

	public String getReceiveMan() {
		return receiveMan;
	}

	public void setReceiveMan(String receiveMan) {
		this.receiveMan = receiveMan;
	}

	public int getProvinceId() {
		return provinceId;
	}

	public int getCityId() {
		return cityId;
	}

	public int getDistrictId() {
		return districtId;
	}

	public void setProvinceId(int provinceId) {
		this.provinceId = provinceId;
	}

	public void setCityId(int cityId) {
		this.cityId = cityId;
	}

	public void setDistrictId(int districtId) {
		this.districtId = districtId;
	}

	public String getQq() {
		return qq;
	}

	public String getWx() {
		return wx;
	}

	public String getCardNo() {
		return cardNo;
	}

	public void setQq(String qq) {
		this.qq = qq;
	}

	public void setWx(String wx) {
		this.wx = wx;
	}

	public void setCardNo(String cardNo) {
		this.cardNo = cardNo;
	}

	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	public String getDeviceToken() {
		return deviceToken;
	}

	public void setDeviceToken(String deviceToken) {
		this.deviceToken = deviceToken;
	}

	public int getNewsId() {
		return newsId;
	}

	public void setNewsId(int newsId) {
		this.newsId = newsId;
	}

	public int getStore() {
		return store;
	}

	public void setStore(int store) {
		this.store = store;
	}

	public int getSex() {
		return sex;
	}

	public void setSex(int sex) {
		this.sex = sex;
	}

	public int getAdminId() {
		return adminId;
	}

	public void setAdminId(int adminId) {
		this.adminId = adminId;
	}

	public String getNickName() {
		return nickName;
	}

	public void setNickName(String nickName) {
		this.nickName = nickName;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getUserPwd() {
		return userPwd;
	}

	public void setUserPwd(String userPwd) {
		this.userPwd = userPwd;
	}

	public int getRememberMe() {
		return rememberMe;
	}

	public void setRememberMe(int rememberMe) {
		this.rememberMe = rememberMe;
	}

	public String getOldPwd() {
		return oldPwd;
	}

	public void setOldPwd(String oldPwd) {
		this.oldPwd = oldPwd;
	}

	public String getNewPwd() {
		return newPwd;
	}

	public void setNewPwd(String newPwd) {
		this.newPwd = newPwd;
	}

	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
}
