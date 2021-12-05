'use strict';
import BaseComponent from '../prototype/BaseComponent.js'
import ResponseCode from "../utils/ResponseCode.js";
import ResponseModel from "../utils/ResponseModel.js"
import rmrkService from "../service/RmrkService.js";

class RmrkController extends BaseComponent {

	constructor() {
		super();
		this.getDetail = this.getDetail.bind(this);
	}

	async getDetail(req, res, next) {
		let resJson = new ResponseModel(ResponseCode.SUCCESS, "ok");
		res.send(resJson);
	}

}

export default new RmrkController();
