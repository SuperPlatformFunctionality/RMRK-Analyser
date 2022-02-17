const lodash = require("lodash");
const moment = require("moment");
const fs = require("fs");
const fsPromises = require('fs/promises');
const MyUtils = require("../utils/MyUtils");
const { loadPromiseNfts, loadPromiseCollections, loadPromiseBases, loadPromiseLastBlock, writeObjToFilePromise } = require("../utils/JsonBackupTools");

//InMemoryAdapter is copy of InMemoryAdapter in rmrk-tools
//because InMemoryAdapter can not be exported from rmrk-tools
class InMemoryAdapter {
	constructor() {
		this.nfts = {};
		this.collections = {};
		this.bases = {};
	}
	async getAllNFTs() {
		return this.nfts;
	}
	async getAllCollections() {
		return this.collections;
	}
	async getAllBases() {
		return this.bases;
	}
	async updateNFTEmote(nft, consolidatedNFT) {
		this.nfts[consolidatedNFT.id] = Object.assign(Object.assign({}, this.nfts[consolidatedNFT.id]), { reactions: nft === null || nft === void 0 ? void 0 : nft.reactions });
	}
	async updateBaseEquippable(base, consolidatedBase) {
		this.bases[consolidatedBase.id] = Object.assign(Object.assign({}, this.bases[consolidatedBase.id]), { parts: base === null || base === void 0 ? void 0 : base.parts });
	}
	async updateNFTList(nft, consolidatedNFT) {
		this.nfts[consolidatedNFT.id] = Object.assign(Object.assign({}, this.nfts[consolidatedNFT.id]), { forsale: nft === null || nft === void 0 ? void 0 : nft.forsale, changes: nft === null || nft === void 0 ? void 0 : nft.changes });
	}
	async updateEquip(nft, consolidatedNFT) {
		this.nfts[consolidatedNFT.id] = Object.assign(Object.assign({}, this.nfts[consolidatedNFT.id]), { children: nft.children });
	}
	async updateSetPriority(nft, consolidatedNFT) {
		this.nfts[consolidatedNFT.id] = Object.assign(Object.assign({}, this.nfts[consolidatedNFT.id]), { priority: nft.priority });
	}
	async updateSetAttribute(nft, consolidatedNFT) {
		this.nfts[consolidatedNFT.id] = Object.assign(Object.assign({}, this.nfts[consolidatedNFT.id]), { properties: nft.properties });
	}
	async updateNftAccept(nft, consolidatedNFT, entity) {
		if (entity == "NFT") {
			this.nfts[consolidatedNFT.id] = Object.assign(Object.assign({}, this.nfts[consolidatedNFT.id]), { children: nft === null || nft === void 0 ? void 0 : nft.children, priority: (nft === null || nft === void 0 ? void 0 : nft.priority) || this.nfts[consolidatedNFT.id].priority });
		}
		else if (entity === "RES") {
			this.nfts[consolidatedNFT.id] = Object.assign(Object.assign({}, this.nfts[consolidatedNFT.id]), { resources: nft === null || nft === void 0 ? void 0 : nft.resources, priority: (nft === null || nft === void 0 ? void 0 : nft.priority) || this.nfts[consolidatedNFT.id].priority });
		}
	}
	async updateNftResadd(nft, consolidatedNFT) {
		this.nfts[consolidatedNFT.id] = Object.assign(Object.assign({}, this.nfts[consolidatedNFT.id]), { resources: nft === null || nft === void 0 ? void 0 : nft.resources, priority: (nft === null || nft === void 0 ? void 0 : nft.priority) || this.nfts[consolidatedNFT.id].priority });
	}
	async updateNFTChildrenRootOwner(nft, rootowner, level) {
		if ((level || 1) < 10 && nft.children && nft.children.length > 0) {
			const promises = nft.children.map(async (child) => {
				var _a, _b;
				if (((_a = this.nfts[child.id]) === null || _a === void 0 ? void 0 : _a.children) &&
					((_b = this.nfts[child.id]) === null || _b === void 0 ? void 0 : _b.children.length) > 0) {
					await this.updateNFTChildrenRootOwner(this.nfts[child.id], rootowner || nft.rootowner, (level || 1) + 1);
				}
				this.nfts[child.id] = Object.assign(Object.assign({}, this.nfts[child.id]), { forsale: BigInt(0), rootowner: rootowner || nft.rootowner });
			});
			await Promise.all(promises);
		}
	}
	async updateNFTBuy(nft, consolidatedNFT) {
		this.nfts[consolidatedNFT.id] = Object.assign(Object.assign({}, this.nfts[consolidatedNFT.id]), { owner: nft === null || nft === void 0 ? void 0 : nft.owner, rootowner: nft === null || nft === void 0 ? void 0 : nft.rootowner, changes: nft === null || nft === void 0 ? void 0 : nft.changes, forsale: nft === null || nft === void 0 ? void 0 : nft.forsale });
	}
	async updateNFTSend(nft, consolidatedNFT) {
		this.nfts[consolidatedNFT.id] = Object.assign(Object.assign({}, this.nfts[consolidatedNFT.id]), { changes: nft === null || nft === void 0 ? void 0 : nft.changes, owner: nft === null || nft === void 0 ? void 0 : nft.owner, rootowner: nft === null || nft === void 0 ? void 0 : nft.rootowner, forsale: BigInt(0), pending: nft === null || nft === void 0 ? void 0 : nft.pending });
	}
	async updateNFTBurn(nft, consolidatedNFT) {
		this.nfts[consolidatedNFT.id] = Object.assign(Object.assign({}, this.nfts[consolidatedNFT.id]), { burned: nft === null || nft === void 0 ? void 0 : nft.burned, changes: nft === null || nft === void 0 ? void 0 : nft.changes, equipped: "", forsale: BigInt(nft.forsale) > BigInt(0) ? BigInt(0) : nft.forsale });
	}
	async updateNFTMint(nft) {
		this.nfts[nft.getId()] = Object.assign(Object.assign({}, nft), { symbol: nft.symbol, id: nft.getId() });
	}
	async updateCollectionMint(collection) {
		return (this.collections[collection.id] = collection);
	}
	async updateCollectionDestroy(collection) {
		return delete this.collections[collection.id];
	}
	async updateCollectionLock(collection) {
		const nfts = await this.getNFTsByCollection(collection.id);
		return (this.collections[collection.id] = Object.assign(Object.assign({}, collection), { max: (nfts || []).filter((nft) => nft.burned === "").length }));
	}
	async updateBase(base) {
		return (this.bases[base.getId()] = Object.assign(Object.assign({}, base), { id: base.getId() }));
	}
	async updateBaseThemeAdd(base, consolidatedBase) {
		this.bases[consolidatedBase.id] = Object.assign(Object.assign({}, this.bases[consolidatedBase.id]), { themes: base === null || base === void 0 ? void 0 : base.themes });
	}
	async updateCollectionIssuer(collection, consolidatedCollection) {
		this.collections[consolidatedCollection.id] = Object.assign(Object.assign({}, this.collections[consolidatedCollection.id]), { issuer: collection === null || collection === void 0 ? void 0 : collection.issuer, changes: collection === null || collection === void 0 ? void 0 : collection.changes });
	}
	async updateBaseIssuer(base, consolidatedBase) {
		this.bases[consolidatedBase.id] = Object.assign(Object.assign({}, this.bases[consolidatedBase.id]), { issuer: base === null || base === void 0 ? void 0 : base.issuer, changes: base === null || base === void 0 ? void 0 : base.changes });
	}
	async getNFTsByCollection(collectionId) {
		return Object.values(this.nfts).filter((nft) => (nft === null || nft === void 0 ? void 0 : nft.collection) === collectionId);
	}
	async getNFTById(id) {
		return this.nfts[id];
	}
	async getCollectionById(id) {
		return this.collections[id];
	}
	/**
	 * Find existing NFT by id
	 */
	async getNFTByIdUnique(id) {
		return this.nfts[id];
	}
	async getBaseById(id) {
		return this.bases[id];
	}
}

// need to rewrite with ts
class InitWorldMemoryAdapter extends InMemoryAdapter {
	static getInstance() {
		if (!InitWorldMemoryAdapter.iwmaInstance) {
			InitWorldMemoryAdapter.iwmaInstance = new InitWorldMemoryAdapter();
		}
		return InitWorldMemoryAdapter.iwmaInstance;
	}

	constructor() {
		super();
	}

	async load(filePath) {
		let lastBlockInFile = 0;
		//load big json file

		// Check the JSON file exists and is reachable
		let fileAccessible = false;
		try {
			await fsPromises.access(filePath, fs.constants.R_OK);
			fileAccessible = true;
		} catch (e) {
			console.error(`${filePath} is not readable`);
		}

		if(!fileAccessible) {
			return 0;
		}

		//todo: need to load big json file
		let startTs = moment().unix();
		console.log("start to load file....");
		/*
		let pevStatus = require(filePath);
		this.nfts = pevStatus.nfts ? pevStatus.nfts : {};
		this.collections = pevStatus.collections ? pevStatus.collections : {};
		this.bases = pevStatus.bases ? pevStatus.bases : {};
		lastBlockInFile = pevStatus.lastBlock ? pevStatus.lastBlock : 0;
		*/
		this.nfts = await loadPromiseNfts(filePath);
		this.collections = await loadPromiseCollections(filePath);
		this.bases = await loadPromiseBases(filePath);
		lastBlockInFile = await loadPromiseLastBlock(filePath);
		console.log(`current tracing block number is ${lastBlockInFile}`);

		let loadingDuration = moment().unix() - startTs;

		console.log(`end to load file..., use ${loadingDuration} seconds`);

		return lastBlockInFile;
	}

	async save(lastBlock, filePath) {
		console.log(`start to save RMRK2 status ${filePath}`);
		MyUtils.displayCurMemoryUsage("");
		let startTs = moment().unix();
		const curStatus = {
			nfts: await this.getAllNFTs(),
			collections: await this.getAllCollections(),
			bases: await this.getAllBases(),
			lastBlock:lastBlock
		};

		//deep clone curStatus
		let curStatusImage = lodash.cloneDeep(curStatus);
		MyUtils.displayCurMemoryUsage("after deep clone : ");

		//todo : need to support big json file, write to file
		await writeObjToFilePromise(filePath, curStatusImage);
		MyUtils.displayCurMemoryUsage("after writing to file : ");

		curStatusImage = null;
		MyUtils.displayCurMemoryUsage("after cloned object gc : ");
		let loadingDuration = moment().unix() - startTs;
		console.log(`finish to save RMRK2 status ${filePath}, use ${loadingDuration} seconds`);

		for(let i = 0 ; i < 5 ; i++) {
			await MyUtils.sleepForMillisecond(2000);
			MyUtils.displayCurMemoryUsage("after 2 seconds later ");
		}
	}

}

//call once to create the instance
InitWorldMemoryAdapter.getInstance();
module.exports = InitWorldMemoryAdapter;
