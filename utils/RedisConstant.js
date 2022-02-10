

class RedisConstant {
    constructor() {

    }
}

RedisConstant.KEY = {
    USER_SESSION : "user-session:",
	USER_SESSION_TYPE : "user-session-type:",
    MOBILE_PHONE_FOR_USER_REG : "mobile-user-reg:",
	MOBILE_PHONE_FOR_USER_FORGET_PWD : "mobile-user-forget-pwd:",
    MOBILE_PHONE_FOR_WITHDRAW : "mobile-account-withdraw:",
}

RedisConstant.TIME = {
    USER_SESSION : 15*24*3600*1000,     // 15 days
    MOBILE_PHONE_CAPTCHA: 5*60*1000,     // 5 minutes
};


/*

// 注册产生手机验证码
public final static String REGISTER_PHONE = "register_phone:";
// 注册验证码的有效时间
public final static int REGISTER_CODE_TIME = 60*2;

// 登录次数标志, 大于5次锁定
public static String LOGIN_SIGN = "login_sign:";
// 登录次数标志保存时间
public final static long LOGIN_SIGN_TIME = 60*5;

// 登录成功的session
public final static String USER_SESSION = "user_session:";
// 登录成功的session 终端记录
public final static String USER_SESSION_TYPE = "user_session_type:";
// 登录成功的session 有效时间
public final static int USER_SESSION_TIME = 15*24*60*60;  //15 days

// 提现的验证码
public static final String WITHDRAW_CODE = "withdraw_code:";
// 提现验证码 2分钟
public static final int WITHDRAW_CODE_TIME = 2*60;
// 提现次数记录
public static final String WITHDRAW_CODE_COUNT = "withdraw_code_count:";
// 提现次数记录 时间 1小时
public static final long WITHDRAW_CODE_TOO_MUCH_TIME = 30*60;

// 重置密码的验证码
public static final String RESET_PASSWORD_CODE = "reset_password_code:";
// 重置密码,5分钟
public static final int RESET_PASSWORD_CODE_TIME = 5*60;
// 重置密码次数记录
public static final String RESET_PASSWORD_CODE_COUNT = "reset_password_code_count:";
// 重置密码次数记录 时间 24小时
public static final long RESET_PASSWORD_CODE_TOO_MUCH_TIME = 24*60*60;

// 用户账户信息 + userid
public static String USER_ACCOUNT_ID(Object userId) {
    return "user_account_id:" + userId;
}
*/

module.exports = RedisConstant
