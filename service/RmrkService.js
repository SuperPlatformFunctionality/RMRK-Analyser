const RabbitMqConsumer = require("../rabbitmq/rabbitmq_consumer.js");
const config = require('../config/index.js');
const polkadotNodeWsUrl = config.polkadotNodeWsUrl;
const polkadotNodeHttpUrl = config.polkadotNodeHttpUrl;

const { ApiPromise, WsProvider, HttpProvider } = require('@polkadot/api');

const InitWorldConsolidator = require("./InitWorldConsolidator.js");
const InitWorldAdapter = require("./InitWorldMemoryAdapter");
const DaoNFT = require("../dao/DaoNFT");
let api = null;
let consolidator = null;

class RmrkService {
	constructor() {
		this.onReceiveRmrkMsg = this.onReceiveRmrkMsg.bind(this);
		this.getBaseObjInst = this.getBaseObjInst.bind(this);
		this.getNFTObjInst = this.getNFTObjInst.bind(this);
		this.getNFTIdsByOwnerAddress = this.getNFTIdsByOwnerAddress.bind(this);
	}

	async onReceiveRmrkMsg(msgObj) {
//		console.log("received msg:", msgObj);

		let oneRmrk = msgObj;
		let remarks = [];
		remarks.push(oneRmrk);

		//do consolidation ...to change the current status, do delta change......
		await consolidator.consolidateToDB(remarks);

		return true;
	}

	async getBaseObjInst(baseId) {
		let baseObj = await InitWorldAdapter.getInstance().getBaseById(baseId);
		return baseObj;
	}

	async getCollectionObjInst(collectionId) {
		let collectionObj = await InitWorldAdapter.getInstance().getCollectionById(collectionId);
		return collectionObj;
	}

	async getNFTObjInst(nftId) {
		let nftObj = await InitWorldAdapter.getInstance().getNFTById(nftId);
		return nftObj;
	}

	async getNFTIdsByOwnerAddress(address) {
		let nftIds = await DaoNFT.getNFTIdsByOwner(address);
		return nftIds;
	}
}

let initPolkadotJs = async function() {
	console.log("start init polkadot js...");
	let useWS = false;
	let theProvider = (useWS ? new WsProvider(polkadotNodeWsUrl) : new HttpProvider(polkadotNodeHttpUrl));
	api = await ApiPromise.create({ provider: theProvider });
	let ss58Format = config.ss58Format;
	//const systemProperties = await api.rpc.system.properties();
	//let ss58Format = systemProperties.ss58Format.toHuman();
	//ss58Format = ss58Format || 0; //0 is polkadot, 2 is kusama
	consolidator = new InitWorldConsolidator(ss58Format, InitWorldAdapter.getInstance());
	await RabbitMqConsumer.initConsumer();
	console.log("end init polkadot js...");
}

let rsInstance = new RmrkService();
let initRabbitMq = async function() {
	RabbitMqConsumer.addListener(rsInstance.onReceiveRmrkMsg);
	await RabbitMqConsumer.initConsumer();
}
let doInit = async function() {
	await initPolkadotJs();
	await initRabbitMq();
}
doInit();

module.exports = rsInstance;
