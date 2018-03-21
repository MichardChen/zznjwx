package my.core.model;

import java.util.ArrayList;
import java.util.List;

import org.huadalink.plugin.tablebind.TableBind;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.Page;

import my.pvcloud.util.DateUtil;

@TableBind(table = "t_receive_address", pk = "id")
public class ReceiveAddress extends Model<ReceiveAddress> {
	
	public static final ReceiveAddress dao = new ReceiveAddress();

	public Page<ReceiveAddress> queryByPage(int page,int size,int memberId,String status){
		
		List<Object> param=new ArrayList<Object>();
		StringBuffer strBuf=new StringBuffer();
		strBuf.append(" and member_id=?");
		strBuf.append(" and status=?");
		param.add(memberId);
		param.add(status);
		String sql=" from t_receive_address where 1=1"+strBuf+" order by default_flg desc,create_time desc";
		String select="select * ";
		return ReceiveAddress.dao.paginate(page, size, select, sql,param.toArray());
	}
	
	public ReceiveAddress queryById(int id,String status){
		return ReceiveAddress.dao.findFirst("select * from t_receive_address where id = ? and status='"+status+"'",id);
	}
	
	public ReceiveAddress queryByKeyId(int id){
		return ReceiveAddress.dao.findFirst("select * from t_receive_address where id = ?",id);
	}
	
	public boolean updateInfo(ReceiveAddress address){
		return new ReceiveAddress().setAttrs(address).update();
	}
	
	public int saveInfo(ReceiveAddress address){
		ReceiveAddress t = new ReceiveAddress().setAttrs(address);
		t.save();
		return t.getInt("id");
	}
	
	public boolean del(int id){
		return ReceiveAddress.dao.deleteById(id);
	}
	
	//查询默认地址或者第一个地址
	public ReceiveAddress queryByFirstAddress(int id,String status){
		return ReceiveAddress.dao.findFirst("select * from t_receive_address where member_id = "+id+" and status='"+status+"' order by default_flg desc,create_time desc");
	}
	
	public int updateReceiveAddressDefault(int id,int memberId){
		return Db.update("update t_receive_address set default_flg=0,update_time='"+DateUtil.getNowTimestamp()+"' where member_id="+memberId+" and id!="+id);
	}
}
