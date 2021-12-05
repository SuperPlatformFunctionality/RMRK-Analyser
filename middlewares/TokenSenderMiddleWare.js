'use strict';

import ResponseModel from "../utils/ResponseModel";
import ResponseCode from "../utils/ResponseCode";

class TokenSenderMiddleWare {
	constructor() {
		this.checkHeaderTag = this.checkHeaderTag.bind(this);
	}

	async checkHeaderTag(req, res, next) {
		let ok = (req.headers.token_sender_key == "55ef6100e4cac696648a78688f664f014336b03a261873f4ff58701745e6f09f");
		if(ok) {
			next();
		} else {
			res.send(new ResponseModel(ResponseCode.NO_AUTHORITY));
		}
	}
}

export default new TokenSenderMiddleWare()
