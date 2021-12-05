'use strict';
import RabbitMqConsumer from "../rabbitmq/rabbitmq_consumer.js"
import MyUtils from "../utils/MyUtils.js";
import config from '../config/index.js';
const polkadotNodeUrl = config.polkadotNodeUrl;

import { ApiPromise, WsProvider } from '@polkadot/api';

import { fetchRemarks, getRemarksFromBlocks, getLatestFinalizedBlock, Consolidator } from 'rmrk-tools';
const wsProvider = new WsProvider(polkadotNodeUrl);
let api = null;

let initPolkadotJs = async function() {
	api = await ApiPromise.create({ provider: wsProvider });
	const systemProperties = await api.rpc.system.properties();
	const ss58Format = systemProperties.toHuman().ss58Format;
	const consolidator = new Consolidator(ss58Format);
}
initPolkadotJs();

class RmrkService {
	constructor() {
		this.onReceiveRmrkMsg = this.onReceiveRmrkMsg.bind(this);
	}

	async onReceiveRmrkMsg(msgObj) {
		console.log(msgObj);

		//do consolidation ...to change the current status, do delta change......

//					const { nfts, collections } = await consolidator.consolidate(remarks);
//					console.log('Consolidated nfts:', nfts);
//					console.log('Consolidated collections:', collections);

		return true;
	}
}

let rsInstance = new RmrkService();
RabbitMqConsumer.addListener(rsInstance.onReceiveRmrkMsg);
export default rsInstance;
