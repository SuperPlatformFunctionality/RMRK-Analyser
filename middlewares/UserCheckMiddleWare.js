

const ResponseModel = require("../utils/ResponseModel");
const ResponseCode = require("../utils/ResponseCode");
const ResponseCodeError = require("../utils/ResponseCodeError");

class UserCheckMiddleWare {
	constructor() {
		this.checkUserAddress = this.checkUserAddress.bind(this);
	}

	async checkUserAddress(req, res, next) {
		let resJson = new ResponseModel(ResponseCode.PARAM_ERROR);
		let address = req.body["address"];
		let ok = false;
		try {
			if(!address) {
				resJson = new ResponseModel(ResponseCode.DATA_FORMAT_ERROR);
			} else {
				address = address.trim();
				ok = address.length > 0;
			}
		} catch (e) {
			console.log("UserCheckMiddleWare.checkUserAddress", e);
			resJson = new ResponseModel((e instanceof ResponseCodeError)?e.respondCode:ResponseCode.SYSTEM_ERROR);
		}
		if(ok) {
			next();
		} else {
			res.send(resJson);
			return;
		}
	}
}

module.exports = new UserCheckMiddleWare()
