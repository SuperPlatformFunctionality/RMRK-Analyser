const BaseComponent = require('../prototype/BaseComponent');
const ResponseCode = require("../utils/ResponseCode");
const ResponseModel = require("../utils/ResponseModel");
const ResponseCodeError = require("../utils/ResponseCodeError");
const rmrkService = require("../service/RmrkService.js");

class UserController extends BaseComponent {

	constructor() {
		super();
		this.getAllNFTsOfAddress = this.getAllNFTsOfAddress.bind(this);
	}

	async getAllNFTsOfAddress(req, res, next) {
		let resJson = null;
		let address = req.body["address"];
		try {
			let nftIds = await rmrkService.getNFTIdsByOwnerAddress(address);
			resJson = new ResponseModel(ResponseCode.SUCCESS, nftIds);
		} catch (e) {
			resJson = new ResponseModel((e instanceof ResponseCodeError)?e.respondCode:ResponseCode.SYSTEM_ERROR);
		}
		res.send(resJson);
	}

}

module.exports = new UserController();
