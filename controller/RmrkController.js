const BaseComponent = require('../prototype/BaseComponent.js');
const ResponseCode = require("../utils/ResponseCode.js");
const ResponseModel = require("../utils/ResponseModel.js");
const rmrkService = require("../service/RmrkService.js");

const ResponseCodeError = require("../utils/ResponseCodeError");

class RmrkController extends BaseComponent {

	constructor() {
		super();
		this.getBaseObj = this.getBaseObj.bind(this);
		this.getNFTObj = this.getNFTObj.bind(this);
	}

	async getBaseObj(req, res, next) {
		let resJson = null;
		let baseId = req.body["baseId"];
		try {
			let baseObj = await rmrkService.getBaseObjInst(baseId);
			resJson = new ResponseModel(ResponseCode.SUCCESS, baseObj);
		} catch (e) {
			console.log(e);
			resJson = new ResponseModel((e instanceof ResponseCodeError)?e.respondCode:ResponseCode.SYSTEM_ERROR);
		}
		res.send(resJson);
	}

	async getCollectionObj(req, res, next) {
		let resJson = null;
		let collectionId = req.body["collectionId"];
		try {
			let collectionObj = await rmrkService.getCollectionObjInst(collectionId);
			resJson = new ResponseModel(ResponseCode.SUCCESS, collectionObj);
		} catch (e) {
			console.log(e);
			resJson = new ResponseModel((e instanceof ResponseCodeError)?e.respondCode:ResponseCode.SYSTEM_ERROR);
		}
		res.send(resJson);
	}

	async getNFTObj(req, res, next) {
		let resJson = null;
		let nftId = req.body["nftId"];
		try {
			let nftObj = await rmrkService.getNFTObjInst(nftId);
			resJson = new ResponseModel(ResponseCode.SUCCESS, nftObj);
		} catch (e) {
			resJson = new ResponseModel((e instanceof ResponseCodeError)?e.respondCode:ResponseCode.SYSTEM_ERROR);
		}
		res.send(resJson);
	}

}

module.exports = new RmrkController();
