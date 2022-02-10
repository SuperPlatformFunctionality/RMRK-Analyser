
const BaseComponent = require('../prototype/BaseComponent');
const ResponseCode = require("../utils/ResponseCode");
const ResponseModel = require("../utils/ResponseModel");
const ResponseCodeError = require("../utils/ResponseCodeError");
const DaoNFT = require("../dao/DaoNFT");

class UserController extends BaseComponent {

	constructor() {
		super();
		this.getAllNFTsOfAddress = this.getAllNFTsOfAddress.bind(this);
	}

	async getAllNFTsOfAddress(req, res, next) {
		let resJson = null;
		let address = req.body["address"];
		try {
			let nftIds = await DaoNFT.getNFTIdsByOwner(address);
			resJson = new ResponseModel(ResponseCode.SUCCESS, nftIds);
		} catch (e) {
			resJson = new ResponseModel((e instanceof ResponseCodeError)?e.respondCode:ResponseCode.SYSTEM_ERROR);
		}
		res.send(resJson);
	}

}

module.exports = new UserController();
