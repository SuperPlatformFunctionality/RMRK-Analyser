'use strict';
import BaseComponent from '../prototype/BaseComponent'
import ResponseCode from "../utils/ResponseCode";
import ResponseModel from "../utils/ResponseModel"
import ResponseCodeError from "../utils/ResponseCodeError";
import DaoNFT from "../dao/DaoNFT";

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

export default new UserController();
