'use strict';

class ResponseCode {

}

ResponseCode.SUCCESS       = {code:"0000", msg:"success"};
ResponseCode.SYSTEM_ERROR  = {code:"0001", msg:"system error"};
ResponseCode.PARAM_ERROR   = {code:"0002", msg:"parameter error"};
ResponseCode.NO_AUTHORITY  = {code:"0003", msg:"no authority"};
ResponseCode.NO_DATA       = {code:"0004", msg:"no data"};
ResponseCode.OPERATION_TOO_FREQUENT    = {code:"0005", msg:"operation too frequent"};  // 操作过于频繁
ResponseCode.USER_SESSION_EXPIRATION   = {code:"0006", msg:"user session expiration"}; // session失效,需要重新登录
ResponseCode.FORMAT_ERROR          = {code:"0007", msg:"format error"};    // 格式错误
ResponseCode.PARAMS_TYPE_ERROR     = {code:"0008", msg:"param type error"};


ResponseCode.MOBILE_PHONE_FORMAT_ERROR  = {code:"100011", msg:"mobile phone format error"}; // 手机号格式错误
ResponseCode.EMAIL_FORMAT_ERROR         = {code:"100012", msg:"email format error"};    // 邮箱格式错误
ResponseCode.CAPTCHA_CODE_INVLID        = {code:"100013", msg:"captcha code invalid"};  // 验证码错误
ResponseCode.USERNAME_EXIST_ALREADY     = {code:"100014", msg:"user name exist already"};           // 用户名已经存在
ResponseCode.MOBILE_PHONE_EXIST_ALREADY = {code:"100015", msg:"mobile phone registered already"};   // 手机号已经存在
ResponseCode.EMAIL_EXIST_ALREADY        = {code:"100016", msg:"email exist already"};               // 邮箱已经存在
ResponseCode.USER_OR_PASSWD_INVALID     = {code:"100017", msg:"user account or password invalid"};  // 登录账户或者密码不对
ResponseCode.SMS_SERVER_ERROR       	= {code:"100018", msg:"SMS server error"};                  //SMS短信服务错误
ResponseCode.MOBILE_PHONE_NOT_EXIST 	= {code:"100019", msg:"mobile phone not exist"};            //手机号不存在
ResponseCode.RESET_PWD_TOO_MANY_TIMES   = {code:"100020", msg:"reset password too many times"}; //重置密码次数太多,每天最多3次
ResponseCode.QUERY_DATA_NOT_EXIST       = {code:"100021", msg:"query data not exist"};          //查询的数据不存在
ResponseCode.USER_NOT_EXIST     		= {code:"100022", msg:"user not exist"};    //用户不存在
ResponseCode.DATA_FORMAT_ERROR  		= {code:"100023", msg:"data format error"}; //数据格式错误
ResponseCode.USERNAME_FORMAT_ERROR          = {code:"100024", msg:"user name format error"};        //用户名格式错误
ResponseCode.USERNAME_SHOULD_NOT_BE_EMPTY   = {code:"100025", msg:"user name should not be empty"}; //用户名不应该为空
ResponseCode.OLD_PASSWORD_INVALID   		= {code:"100026", msg:"old password invalid"};        	//旧密码错误
ResponseCode.CUR_PASSWORD_INVALID   		= {code:"100027", msg:"current password invalid"};      //当前密码错误
ResponseCode.MINER_NOT_REGISTERED	  		= {code:"100028", msg:"miner not registered"};      //当前矿工没有注册
ResponseCode.MINING_PROCESS_START_ERROR	  	= {code:"100029", msg:"mining process started error"};      //当前挖矿进程开启错误
ResponseCode.API_INTERFACE_NOT_OPENED	  	= {code:"100030", msg:"api interface not opened"};      //当前api接口未开放
ResponseCode.SYSTEM_ERROR_TOKEN_SENDER_EMPTY= {code:"100031", msg:"system error, token sender empty"};      //token sender账户不足

ResponseCode.INVITATION_CODE_NOT_EXIST  	= 	{code:"200010", msg:"invitation code not exist"};  // 邀请码不存在
ResponseCode.AMOUNT_LIMIT_EXCEEDED  		= 	{code:"200021", msg:"limitation exceeded"};  // 超出额度限制
ResponseCode.WITHDRAW_COUNT_LIMIT_EXCEEDED  = 	{code:"200023", msg:"withdraw count limitation exceeded"};// 提现超过次数限制, 请稍候重试, 5分钟3次, 每天5次

ResponseCode.ACCOUNT_BALANCE_NOT_ENOUGH  		= {code:"300032", msg:"account balance not enough"};  				// 账户余额数量不足, 请充值后使用.
ResponseCode.ACCOUNT_BALANCE_DB_INCREASE_FAILED = {code:"300033", msg:"account balance database increase failed"};  // 账户充值操作失败
ResponseCode.ACCOUNT_BALANCE_DB_DECREASE_FAILED = {code:"300034", msg:"account balance database decrease failed"};  // 账户扣款操作失败
ResponseCode.WITHDRAW_AMOUNT_CANNOT_BE_ZERO     = {code:"300036", msg:"withdraw amount can not be zero"};  			// 提现数额不能为0
ResponseCode.WITHDRAW_AMOUNT_TOO_LOW            = {code:"300037", msg:"withdraw amount too low"};           		// 提现数量太少

ResponseCode.KYC_IDENTITY_CARD_NUMBER_CHECK_ERROR 		= {code:"400001", msg:"identity card number checking error"};  	// 实名制身份证号码验证系统异常
ResponseCode.KYC_IDENTITY_CARD_NUMBER_CHECK_INVALID 	= {code:"400002", msg:"identity card number checking invalid"}; // 实名制身份证号码验证不一致,检验未通过
ResponseCode.KYC_IDENTITY_CARD_NUMBER_CHECK_ABNORMAL 	= {code:"400003", msg:"identity card number checking abnormal"}; // 实名制身份证号码验证证件号异常,检验未通过
ResponseCode.KYC_IDENTITY_CARD_NUMBER_CHECK_NO_RESULT 	= {code:"400004", msg:"identity card number checking no result"};  	// 实名制身份证号码验证查询无结果

export default ResponseCode;

