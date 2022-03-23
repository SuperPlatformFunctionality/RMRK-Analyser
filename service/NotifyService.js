const axios = require("axios");
const config = require('../config/index.js');
const SalesmanHost = config.SalesmanHost;

class NotifyService {
	constructor() {
		this.doNotifyBurn = this.doNotifyBurn.bind(this);
	}

	async doNotifyBurn(nftId, reason, address) {
		const accessKey = "55ef6100e7cac696648a78688f664f014836b03a261873f4ff78701745e6f14u";
		let data = {
			accessKey:accessKey,
			op:"burn",
			nftId : nftId,
			reason : reason,
			address: address
		}
		let ret = null;
		try {
			let res = await axios.post(SalesmanHost + "/tx/assist/nftstatus", data);
			ret = res.data;
		} catch (e) {
			console.log("doNotifyBurn exception:", e);
		}
		return ret;
	}

}

let nsInstance = new NotifyService();
module.exports = nsInstance;
