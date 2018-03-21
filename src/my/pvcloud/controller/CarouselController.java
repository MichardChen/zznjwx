package my.pvcloud.controller;


import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.UUID;

import my.app.service.FileService;
import my.core.constants.Constants;
import my.core.model.Carousel;
import my.core.model.Log;
import my.core.model.User;
import my.core.vo.CarouselVO;
import my.pvcloud.service.CarouselService;
import my.pvcloud.util.DateUtil;
import my.pvcloud.util.ImageCompressZipUtil;
import my.pvcloud.util.ImageTools;
import my.pvcloud.util.StringUtil;

import org.huadalink.route.ControllerBind;

import com.jfinal.aop.Enhancer;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.upload.UploadFile;

@ControllerBind(key = "/carouselInfo", path = "/pvcloud")
public class CarouselController extends Controller {

	CarouselService service = Enhancer.enhance(CarouselService.class);
	
	int page=1;
	int size=10;
	
	/**
	 * 门店列表
	 */
	public void index(){
		
		Page<Carousel> list = service.queryByPage(page, size);
		ArrayList<CarouselVO> models = new ArrayList<>();
		CarouselVO model = null;
		for(Carousel carousel : list.getList()){
			model = new CarouselVO();
			model.setId(carousel.getInt("id"));
			model.setFlg(carousel.getInt("flg"));
			model.setRealUrl(carousel.getStr("real_url"));
			model.setImgUrl(carousel.getStr("img_url"));
			model.setCreateTime(StringUtil.toString(carousel.getTimestamp("create_time")));
			model.setUpdateTime(StringUtil.toString(carousel.getTimestamp("update_time")));
			
			Integer createBy = carousel.getInt("create_by") == null ? 0 : carousel.getInt("create_by");
			Integer updateBy = carousel.getInt("update_by") == null ? 0 : carousel.getInt("update_by");
			User createUser = User.dao.queryById(createBy);
			User updateUser = User.dao.queryById(updateBy);
			if(createBy != null){
				if(createUser != null){
					model.setCreateUser(createUser.getStr("username"));
				}
			}
			if(updateBy != null){
				if(updateUser != null){
					model.setUpdateUser(updateUser.getStr("username"));
				}
			}
			models.add(model);
		}
		setAttr("list", list);
		setAttr("sList", models);
		render("carousel.jsp");
	}
	
	/**
	 * 模糊查询分页
	 */
	public void queryByConditionByPage(){
			
			Integer page = getParaToInt(1);
	        if (page==null || page==0) {
	            page = 1;
	        }
	        Page<Carousel> list = service.queryByPage(page, size);
			ArrayList<CarouselVO> models = new ArrayList<>();
			CarouselVO model = null;
			for(Carousel carousel : list.getList()){
				model = new CarouselVO();
				model.setId(carousel.getInt("id"));
				model.setFlg(carousel.getInt("flg"));
				model.setRealUrl(carousel.getStr("real_url"));
				model.setImgUrl(carousel.getStr("img_url"));
				model.setCreateTime(StringUtil.toString(carousel.getTimestamp("create_time")));
				model.setUpdateTime(StringUtil.toString(carousel.getTimestamp("update_time")));
				
				Integer createBy = carousel.getInt("create_by") == null ? 0 : carousel.getInt("create_by");
				Integer updateBy = carousel.getInt("update_by") == null ? 0 : carousel.getInt("update_by");
				User createUser = User.dao.queryById(createBy);
				User updateUser = User.dao.queryById(updateBy);
				if(createBy != null){
					if(createUser != null){
						model.setCreateUser(createUser.getStr("username"));
					}
				}
				if(updateBy != null){
					if(updateUser != null){
						model.setUpdateUser(updateUser.getStr("username"));
					}
				}
				
				
				models.add(model);
			}
			setAttr("list", list);
			setAttr("sList", models);
			render("carousel.jsp");
	}
	
	/**
	 *新增
	 */
	public void alter(){
		render("addCarousel.jsp");
	}
	
	/**
	 * 新增
	 */
	public void saveCarousel(){
		//表单中有提交图片，要先获取图片
		UploadFile uploadFile = getFile("img");
		if(StringUtil.isNoneBlank(getPara("id"))){
			updateCarousel();
		}else{
			String realUrl = StringUtil.checkCode(getPara("realUrl"));
			String mark = StringUtil.checkCode(getPara("mark"));
			FileService fs=new FileService();
			
			String logo = "";
			//上传文件
			String uuid = UUID.randomUUID().toString();
			if(uploadFile != null){
				String fileName = uploadFile.getOriginalFileName();
				String[] names = fileName.split("\\.");
			    File file=uploadFile.getFile();
			    File t=new File(Constants.FILE_HOST.IMG+uuid+"."+names[1]);
			    logo = Constants.HOST.IMG+uuid+"."+names[1];
			    try{
			        t.createNewFile();
			    }catch(IOException e){
			        e.printStackTrace();
			    }
			    
			    fs.fileChannelCopy(file, t);
			    ImageCompressZipUtil.zipWidthHeightImageFile(file, t, ImageTools.getImgWidth(file), ImageTools.getImgHeight(file), 0.5f);
			    file.delete();
			}
			
			Carousel c = new Carousel();
			c.set("mark", mark);
			c.set("real_url", realUrl);
			c.set("img_url", logo);
			c.set("create_time", DateUtil.getNowTimestamp());
			c.set("update_time", DateUtil.getNowTimestamp());
			c.set("flg", 1);
			int operateUserId=(Integer)getSessionAttr("agentId");
			c.set("create_by", operateUserId);
			c.set("update_by", operateUserId);
			//保存
			boolean ret = Carousel.dao.saveInfo(c);
			if(ret){
				Log.dao.saveLogInfo((Integer)getSessionAttr("agentId"), Constants.USER_TYPE.PLATFORM_USER, "添加轮播图");
				setAttr("message","新增成功");
			}else{
				setAttr("message","新增失败");
			}
			index();
		}
	}
	
	/**
	 * 删除
	 */
	public void del(){
		try{
			int id = getParaToInt("id");
			int operateUserId=(Integer)getSessionAttr("agentId");
			int ret = service.updateFlg(id, 0,operateUserId);
			if(ret==0){
				Log.dao.saveLogInfo((Integer)getSessionAttr("agentId"), Constants.USER_TYPE.PLATFORM_USER, "删除轮播图");
				setAttr("message", "删除成功");
			}else{
				setAttr("message", "删除失败");
			}
		}catch(Exception e){
			e.printStackTrace();
		}
		index();
	}
	
	public void edit(){
		Carousel carousel = service.queryById(StringUtil.toInteger(getPara("id")));
		setAttr("data", carousel);
		render("editCarousel.jsp");
	}
	
	public void updateCarousel(){
		Carousel carousel = new Carousel();
		carousel.set("mark", StringUtil.checkCode(getPara("mark")));
		carousel.set("real_url", StringUtil.checkCode(getPara("realUrl")));
		carousel.set("update_time", DateUtil.getNowTimestamp());
		carousel.set("id", StringUtil.toInteger(getPara("id")));
		int operateUserId=(Integer)getSessionAttr("agentId");
		carousel.set("update_by", operateUserId);
		//保存
		boolean ret = Carousel.dao.updateInfo(carousel);
		if(ret){
			Log.dao.saveLogInfo((Integer)getSessionAttr("agentId"), Constants.USER_TYPE.PLATFORM_USER, "更新轮播图");
			setAttr("message","修改成功");
		}else{
			setAttr("message","修改失败");
		}
		index();
	}
}
