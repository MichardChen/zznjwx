package my.core.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.huadalink.plugin.tablebind.TableBind;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.Page;

import my.pvcloud.util.DateUtil;
import my.pvcloud.util.StringUtil;

@TableBind(table = "t_tea", pk = "id")
public class Tea extends Model<Tea> {
	
	public static final Tea dao = new Tea();

	public Page<Tea> queryByPage(int page,int size){
	/*	List<Object> param=new ArrayList<Object>();
		StringBuffer strBuf=new StringBuffer();
		strBuf.append(" and flg=?");
		param.add(flg);*/
		
		String sql=" from t_tea where 1=1 order by create_time desc";
		String select="select * ";
		return Tea.dao.paginate(page, size, select, sql);
	}
	
	public Page<Tea> queryByPage(int page,int size,String title,String status){
		
		List<Object> param=new ArrayList<Object>();
		StringBuffer strBuf=new StringBuffer();
		if(StringUtil.isNoneBlank(title)){
			strBuf.append(" and tea_title like '%"+title+"%'");
		}
		
		if(StringUtil.isNoneBlank(status)){
			strBuf.append(" and status='"+status+"'");
		}
			
			
			String sql=" from t_tea where 1=1"+strBuf+" order by create_time desc";
			String select="select * ";
			return Tea.dao.paginate(page, size, select, sql,param.toArray());
	}
	
	public List<Tea> exportData(String title,String status){
		
		StringBuffer strBuf=new StringBuffer();
		if(StringUtil.isNoneBlank(title)){
			strBuf.append(" and tea_title like '%"+title+"%'");
		}
		
		if(StringUtil.isNoneBlank(status)){
			strBuf.append(" and status='"+status+"'");
		}
			
			
		String sql=" from t_tea where 1=1"+strBuf+" order by create_time desc";
		String select="select * ";
		return Tea.dao.find(select+sql);
	}
	
	public Tea queryById(int id){
		return Tea.dao.findFirst("select * from t_tea where id = ?",id);
	}
	
	public List<Tea> queryAllTeas(){
		return Tea.dao.find("select * from t_tea");
	}
	
	public List<Tea> queryNewTeaSale(int pageSize,int pageNum){
		int fromRow = pageSize*(pageNum-1);
		return Tea.dao.find("select * from t_tea where flg=1 order by create_time desc limit "+fromRow+","+pageSize);
	}
	
	public List<Tea> queryBuyTeaList(int pageSize,int pageNum,String name,String status){
		int fromRow = pageSize*(pageNum-1);
		if(StringUtil.isNoneBlank(name)){
			return Tea.dao.find("select * from t_tea where flg=1 and tea_title like '%"+name+"%' and status='"+status+"' order by create_time desc limit "+fromRow+","+pageSize);
		}else{
			return Tea.dao.find("select * from t_tea where flg=1 and status='"+status+"' order by create_time desc limit "+fromRow+","+pageSize);
		}
	}
	
	public boolean updateInfo(Tea tea){
		return new Tea().setAttrs(tea).update();
	}
	
	public boolean saveInfo(Tea tea){
		return new Tea().setAttrs(tea).save();
	}
	
	public int saveInfos(Tea tea){
		Tea t = new Tea().setAttrs(tea);
		t.save();
		return t.getInt("id");
	}
	
	public boolean del(int id){
		return Tea.dao.deleteById(id);
	}
	
	public int updateTeaStatus(int id,int flg){
		Db.update("update t_tea set flg="+flg+",update_time='"+DateUtil.getNowTimestamp()+"' where id="+id);
		Tea tea = Tea.dao.findFirst("select * from t_tea where id = ?",id);
		if(tea != null){
			return tea.getInt("flg");
		}else{
			return 0;
		}
	}
	
	public int updateStatus(int id,String status){
		return Db.update("update t_tea set status='"+status+"',update_time='"+DateUtil.getNowTimestamp()+"' where id="+id);
	}
	
	public int updatePrice(int id,BigDecimal price){
		return Db.update("update t_tea set tea_price="+price+",update_time='"+DateUtil.getNowTimestamp()+"' where id="+id);
	}
}
