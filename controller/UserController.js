'use strict';
import BaseComponent from '../prototype/BaseComponent'
import ResponseCode from "../utils/ResponseCode";
import ResponseModel from "../utils/ResponseModel"
import ResponseCodeError from "../utils/ResponseCodeError";
import DaoNFT from "../dao/DaoNFT";

class UserController extends BaseComponent {

	constructor() {
		super();
		this.minerDetail = this.minerDetail.bind(this);
	}

	async minerDetail(req, res, next) {
		let resJson = null;

		try {
			let detail = {};
			resJson = new ResponseModel(ResponseCode.SUCCESS, detail);
		} catch (e) {
			resJson = new ResponseModel((e instanceof ResponseCodeError)?e.respondCode:ResponseCode.SYSTEM_ERROR);
		}
		res.send(resJson);
	}

	async getAllNFTs(req, res, next) {
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
