package my.core.model;

import org.huadalink.plugin.tablebind.TableBind;

import com.jfinal.plugin.activerecord.Model;

@TableBind(table = "t_wxuserinfo", pk = "id")
public class WxUserInfo extends Model<WxUserInfo> {
	
	public static final WxUserInfo dao = new WxUserInfo();
	
	public WxUserInfo queryById(int id){
		return WxUserInfo.dao.findFirst("select * from t_wxuserinfo where id = ?",id);
	}
	
	public WxUserInfo queryByOpenId(String openId){
		return WxUserInfo.dao.findFirst("select * from t_wxuserinfo where openid = ?",openId);
	}
	
	public boolean updateInfo(WxUserInfo data){
		return new WxUserInfo().setAttrs(data).update();
	}
	
	public boolean saveInfo(WxUserInfo data){
		return new WxUserInfo().setAttrs(data).save();
	}
	
	public boolean del(int id){
		return WxUserInfo.dao.deleteById(id);
	}
}

