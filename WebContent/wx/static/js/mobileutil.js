/**
 * 对注册获取验证码的手机号进行加密，避免短信验证码被盗刷
 */
function encryptMobile(mobile){
		//字母数组
		var data=new Array("a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z");
		//0-26随机数,获取头尾3个随机字符
		var t1 = data[parseInt(Math.random()*25)];
		var t2 = data[parseInt(Math.random()*25)];
		var t3 = data[parseInt(Math.random()*25)];
		var w1 = data[parseInt(Math.random()*25)];
		var w2 = data[parseInt(Math.random()*25)];
		var w3 = data[parseInt(Math.random()*25)];
		//获取随机数
		var randomNum = parseInt(Math.random()*10);
		//把电话号码
		var mobileArray = mobile.split('');
		var encryptMobile="";
		for(j=0;j<mobileArray.length;j++){
			if(mobileArray[j]=='0'){
				encryptMobile=encryptMobile+'b';
			}
			if(mobileArray[j]=='1'){
				encryptMobile=encryptMobile+'a';
			}
			if(mobileArray[j]=='2'){
				encryptMobile=encryptMobile+'c';
			}
			if(mobileArray[j]=='3'){
				encryptMobile=encryptMobile+'g';
			}
			if(mobileArray[j]=='4'){
				encryptMobile=encryptMobile+'h';
			}
			if(mobileArray[j]=='5'){
				encryptMobile=encryptMobile+'k';
			}
			if(mobileArray[j]=='6'){
				encryptMobile=encryptMobile+'o';
			}
			if(mobileArray[j]=='7'){
				encryptMobile=encryptMobile+'w';
			}
			if(mobileArray[j]=='8'){
				encryptMobile=encryptMobile+'q';
			}
			if(mobileArray[j]=='9'){
				encryptMobile=encryptMobile+'p';
			}
		}
		return t1+t2+t3+encryptMobile+w1+w2+w3+randomNum;
	}