package my.core.model;

import java.util.List;

import org.huadalink.plugin.tablebind.TableBind;

import com.jfinal.plugin.activerecord.Model;

@TableBind(table = "location_district", pk = "id")
public class District extends Model<District> {
		
		public static final District dao = new District();
		
		public District queryDistrict(int id){
			if(id == 0){
				return null;
			}
			return District.dao.findFirst("select * from location_district where id=?",id);
		}
		
		public List<District> queryAllDistrictByPid(int pid){
			return District.dao.find("select * from location_district where pid="+pid);
		}
}
