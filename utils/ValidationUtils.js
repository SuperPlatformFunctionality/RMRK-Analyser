

let validator = require("validator");

class ValidationUtils {
    constructor() {

    }

    static isValidUserNameString(str) {
        return validator.matches(str, /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5]*$/);
    }

    static isMobilePhone(str) {
    	return validator.isMobilePhone(str);
//        return validator.matches(str, /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/);
    }

    static isEmail(str) {
        return validator.isEmail(str);
    }

    static isNumberic(str) {
        return validator.isNumeric(str);
//        return validator.match(str, /[0-9]*.?[0-9]*/);
    }

}

module.exports = ValidationUtils
