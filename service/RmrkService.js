'use strict';
import RabbitMqConsumer from "../rabbitmq/rabbitmq_consumer.js"
import MyUtils from "../utils/MyUtils.js";
import config from '../config/index.js';
const polkadotNodeUrl = config.polkadotNodeUrl;

import { ApiPromise, WsProvider } from '@polkadot/api';

import { fetchRemarks, getRemarksFromBlocks, getLatestFinalizedBlock, Consolidator } from 'rmrk-tools';
import InitWorldConsolidator from "./InitWorldConsolidator.js";
import InitWorldAdapter from "./InitWorldAdapter";
const wsProvider = new WsProvider(polkadotNodeUrl);
let api = null;
let consolidator = null;

let initPolkadotJs = async function() {
	console.log("start init polkadot js...");
	api = await ApiPromise.create({ provider: wsProvider });
	const systemProperties = await api.rpc.system.properties();
	let ss58Format = systemProperties.toHuman().ss58Format;
	//ss58Format = ss58Format || 0; //0 is polkadot, 2 is kusama
	ss58Format = config.ss58Format;
	consolidator = new InitWorldConsolidator(ss58Format, new InitWorldAdapter());
	console.log("end init polkadot js...");
}
//initPolkadotJs();

class RmrkService {
	constructor() {
		this.onReceiveRmrkMsg = this.onReceiveRmrkMsg.bind(this);
	}

	async onReceiveRmrkMsg(msgObj) {
		if(consolidator == null) {
			await initPolkadotJs();
		}
//		console.log("received msg:", msgObj);

		let oneRmrk = msgObj;
		let remarks = [];
		remarks.push(oneRmrk);

		//do consolidation ...to change the current status, do delta change......
		await consolidator.consolidateToDB(remarks);

		return true;
	}
}

let rsInstance = new RmrkService();
RabbitMqConsumer.addListener(rsInstance.onReceiveRmrkMsg);
export default rsInstance;
