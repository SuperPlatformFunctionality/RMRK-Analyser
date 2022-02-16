const RabbitMqConsumer = require("../rabbitmq/rabbitmq_consumer.js");
const config = require('../config/index.js');
const polkadotNodeWsUrl = config.polkadotNodeWsUrl;
const polkadotNodeHttpUrl = config.polkadotNodeHttpUrl;
const persistenceFilePathRelative = config.persistenceFilePathRelative;
const rmrkBackupInterval = config.rmrkBackupInterval;

const MyUtils = require("../utils/MyUtils");
const moment = require("moment");
const path = require("path");

const { ApiPromise, WsProvider, HttpProvider } = require('@polkadot/api');

const InitWorldConsolidator = require("./InitWorldConsolidator.js");
const InitWorldAdapter = require("./InitWorldMemoryAdapter");
const DaoNFT = require("../dao/DaoNFT");

let api = null;
let consolidator = null;

class RmrkService {
	constructor() {
		this.onReceiveRmrkMsg = this.onReceiveRmrkMsg.bind(this);
		this.initService = this.initService.bind(this);

		this.startIntervalRMRKStatusPersistent = this.startIntervalRMRKStatusPersistent.bind(this);
		this.getBaseObjInst = this.getBaseObjInst.bind(this);
		this.getNFTObjInst = this.getNFTObjInst.bind(this);
		this.getNFTIdsByOwnerAddress = this.getNFTIdsByOwnerAddress.bind(this);

		this.loopSaving = false;
		this.persistenceFilePath = path.join(require.main.path, persistenceFilePathRelative); //todo: 需要更好的持久化管理方案
		this.curBlockNo = 0;
	}

	async onReceiveRmrkMsg(msgObj) {
//		console.log("received msg:", msgObj);
		let oneRmrk = msgObj;
		if(oneRmrk.block < this.curBlockNo) {
			console.log(`current block number is ${this.curBlockNo}, the received rmrk comes from block ${oneRmrk.block}, it should be processed already`);
			return false;
		}

		let remarks = [];
		remarks.push(oneRmrk);

		//do consolidation ...to change the current status, do delta change......
		await consolidator.consolidateToDB(remarks);

		this.curBlockNo = msgObj.block; //todo, 如果只处理了这个blockNo中的一半rmrk协议怎么办?, 需要更好的处理方案
		return true;
	}

	async initService() {
		let that = this;

		console.log("start init polkadot js...");
		let useWS = false;
		let theProvider = (useWS ? new WsProvider(polkadotNodeWsUrl) : new HttpProvider(polkadotNodeHttpUrl));
		api = await ApiPromise.create({ provider: theProvider });
		let ss58Format = config.ss58Format;
		//const systemProperties = await api.rpc.system.properties();
		//let ss58Format = systemProperties.ss58Format.toHuman();
		//ss58Format = ss58Format || 0; //0 is polkadot, 2 is kusama
		that.curBlockNo = await InitWorldAdapter.getInstance().load(that.persistenceFilePath);
		consolidator = new InitWorldConsolidator(ss58Format, InitWorldAdapter.getInstance());
		console.log("end init polkadot js...");

		//init rabbitmq
		RabbitMqConsumer.addListener(rsInstance.onReceiveRmrkMsg);
		await RabbitMqConsumer.initConsumer();

		//do not
		that.startIntervalRMRKStatusPersistent().then(function () {
			console.log(`startIntervalRMRKStatusPersistent loop stopped...`);
		});
	}

	async startIntervalRMRKStatusPersistent() {

		let that = this;
		that.loopSaving = true;
		let lastTs = moment().valueOf();
		while(that.loopSaving) {
			try {
				let curTs = moment().valueOf();
				if(curTs - lastTs > rmrkBackupInterval * 60 * 1000) {
					await InitWorldAdapter.getInstance().save(that.curBlockNo, that.persistenceFilePath);
					lastTs = curTs
				}
			} catch (e) {
				console.log(`some error occur in save nft rmrk status...`, e);
			}
			await MyUtils.sleepForMillisecond(30 * 1000);
		}
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
		//todo: this is not a efficient implement of query nfts by owner

		//let nftIds = await DaoNFT.getNFTIdsByOwner(address);
		let allNfts = await InitWorldAdapter.getInstance().getAllNFTs();
		let nftIds = [];
		let count = 0;
		for(let tempNtfId in allNfts) {
			if(allNfts[tempNtfId].rootowner == address) {
				nftIds.push(allNfts[tempNtfId].id);
			}
			count++;
		}
		console.log(`allNfts count is ${count}`);
		return nftIds;
	}
}


let rsInstance = new RmrkService();
rsInstance.initService();
module.exports = rsInstance;
