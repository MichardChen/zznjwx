package my.core.model;

import org.huadalink.plugin.tablebind.TableBind;

import com.jfinal.plugin.activerecord.Model;

@TableBind(table = "t_cash_pay", pk = "id")
public class CashPay extends Model<CashPay> {
	
	public static final CashPay dao = new CashPay();

	public CashPay queryById(int id){
		return CashPay.dao.findFirst("select * from t_cash_pay where id = ?",id);
	}
	
	public CashPay queryByCashNo(String cashNo){
		return CashPay.dao.findFirst("select * from t_cash_pay where cash_no = ?",cashNo);
	}
	
	public boolean updateInfo(CashPay data){
		return new CashPay().setAttrs(data).update();
	}
	
	public boolean saveInfo(CashPay data){
		return new CashPay().setAttrs(data).save();
	}
	
	public boolean del(int id){
		return CashPay.dao.deleteById(id);
	}
}
