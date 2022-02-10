const DaoBase = require("../dao/DaoBase.js");
const DaoBasePart = require("../dao/DaoBasePart.js");
const DaoBasePartEquippable = require("../dao/DaoBasePartEquippable.js");
const DaoCollection = require("../dao/DaoCollection.js");
const DaoNFT = require("../dao/DaoNFT.js");
const DaoNFTResource = require("../dao/DaoNFTResource.js");
const DaoNFTResourceBasePart = require("../dao/DaoNFTResourceBasePart.js");
const DaoNFTPriority = require("../dao/DaoNFTPriority.js");
const DaoNFTChild = require("../dao/DaoNFTChild.js");

const ResponseCode = require("../utils/ResponseCode");
const ResponseCodeError = require("../utils/ResponseCodeError");

const isPolkadotAddress = (address) => {
	return !address.includes("-");
};

const iwFindRootOwner = async function(nftId, level = 1) {
	if (level > 10) {
		throw new Error("implement by zs, Trying to find an owner too deep, possible stack overflow");
	}
	if (isPolkadotAddress(nftId)) {
		return nftId;
	}
	else {
		// just for finding root owner,so no need to load all sub infos from other table
		const consolidatedNFT = await DaoNFT.getNFTRecordsById(nftId);
		if (!consolidatedNFT) {
			// skip
			return "";
		}
		// Bubble up until owner of nft is polkadot address
		return await iwFindRootOwner(consolidatedNFT.owner, level + 1);
	}
};

// need to rewrite with ts
class InitWorldAdapter {
	static getInstance() {
		if (!InitWorldAdapter.iwaInstance) {
			InitWorldAdapter.iwaInstance = new InitWorldAdapter();
		}
		return InitWorldAdapter.iwaInstance;
	}

	constructor() {
//		super();
		this.nfts = {};
		this.collections = {};
		this.bases = {};
		//need to init memory status from db
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
//		this.nfts[consolidatedNFT.id] = Object.assign(Object.assign({}, this.nfts[consolidatedNFT.id]), { reactions: nft === null || nft === void 0 ? void 0 : nft.reactions });
	}
	async updateBaseEquippable(base, consolidatedBase) {
//		this.bases[consolidatedBase.id] = Object.assign(Object.assign({}, this.bases[consolidatedBase.id]), { parts: base === null || base === void 0 ? void 0 : base.parts });
	}
	async updateNFTList(nft, consolidatedNFT) {
//		this.nfts[consolidatedNFT.id] = Object.assign(Object.assign({}, this.nfts[consolidatedNFT.id]), { forsale: nft === null || nft === void 0 ? void 0 : nft.forsale, changes: nft === null || nft === void 0 ? void 0 : nft.changes });
	}
	async updateEquip(nft, consolidatedNFT) {
	/*
		this.nfts[consolidatedNFT.id] = Object.assign(Object.assign({}, this.nfts[consolidatedNFT.id]), { children: nft.children });
	*/
	}
	async updateSetPriority(nft, consolidatedNFT) {
//		this.nfts[consolidatedNFT.id] = Object.assign(Object.assign({}, this.nfts[consolidatedNFT.id]), { priority: nft.priority });
	}
	async updateSetAttribute(nft, consolidatedNFT) {
//		this.nfts[consolidatedNFT.id] = Object.assign(Object.assign({}, this.nfts[consolidatedNFT.id]), { properties: nft.properties });
	}
	async updateNftAccept(nft, consolidatedNFT, entity) {
		if (entity == "NFT") {
//			this.nfts[consolidatedNFT.id] = Object.assign(Object.assign({}, this.nfts[consolidatedNFT.id]), { children: nft === null || nft === void 0 ? void 0 : nft.children, priority: (nft === null || nft === void 0 ? void 0 : nft.priority) || this.nfts[consolidatedNFT.id].priority });
		}
		else if (entity === "RES") {
//			this.nfts[consolidatedNFT.id] = Object.assign(Object.assign({}, this.nfts[consolidatedNFT.id]), { resources: nft === null || nft === void 0 ? void 0 : nft.resources, priority: (nft === null || nft === void 0 ? void 0 : nft.priority) || this.nfts[consolidatedNFT.id].priority });
		}
	}
	async updateNftResadd(nft, consolidatedNFT) {
		/*
			this.nfts[consolidatedNFT.id] =
				Object.assign(Object.assign({}, this.nfts[consolidatedNFT.id]),
					{
						resources: nft === null || nft === void 0 ? void 0 : nft.resources,
						priority: (nft === null || nft === void 0 ? void 0 : nft.priority) || this.nfts[consolidatedNFT.id].priority
					});

		*/
		let curNtf = await this._getNFTAndAllSubInfo(consolidatedNFT.id);
		let newNftInst = Object.assign(Object.assign({}, curNtf),
			{
				resources: nft === null || nft === void 0 ? void 0 : nft.resources,
				priority: (nft === null || nft === void 0 ? void 0 : nft.priority) || curNtf.priority
			});
		try {
			//save resource to db
			let newResources = newNftInst.resources;
			if(newResources && newResources.length > 0) {
				for(let i = 0 ; i < newResources.length ; i++) {
					let resItem = newResources[i];
					let existResItem = await DaoNFTResource.getNFTResourceRecordByNftIdAndId(consolidatedNFT.id, resItem.id);
					if(existResItem == null) {
						await DaoNFTResource.createNewNFTResourceRecord(consolidatedNFT.id, resItem.id,
							resItem.base,
							resItem.src, resItem.metadata,
							resItem.slot, resItem.thumb);
						if(resItem.base != null) {
							for(let i= 0 ; i < resItem.parts.length ; i++) {
								let tempResBasePart = resItem.parts[i];
								await DaoNFTResourceBasePart.createNewNFTResourceBasePart(consolidatedNFT.id, resItem.id, tempResBasePart);
							}
						}
					}
				}
			}

			//save priority to db
			let newPriority = newNftInst.priority;
			if(newPriority && newPriority.length > 0) {
				for (let i = 0 ; i < newPriority.length ; i++) {
					let newOrder = i;
					let newResourceId = newPriority[i];
					let existPriorityItem = await DaoNFTPriority.getNFTPriorityRecordByNftIdAndResourceId(consolidatedNFT.id, newResourceId);
					if(existPriorityItem == null) {
						await DaoNFTPriority.createNewNFTPriority(consolidatedNFT.id, newResourceId, newOrder);
					} else {
						await DaoNFTPriority.updateNFTPriorityRecordOrderByNftIdAndResourceId(consolidatedNFT.id, newResourceId, newOrder);
					}
				}
			}

		}
		catch (e) {
			console.log(e);
		}

	}
	async updateNFTChildrenRootOwner(nft, rootowner, level) {
		/*
		if ((level || 1) < 10 && nft.children && nft.children.length > 0) {
			const promises = nft.children.map(async (child) => {
				var _a, _b;
				if (((_a = this.nfts[child.id]) === null || _a === void 0 ? void 0 : _a.children) &&
					((_b = this.nfts[child.id]) === null || _b === void 0 ? void 0 : _b.children.length) > 0) {
					await this.updateNFTChildrenRootOwner(this.nfts[child.id], rootowner || nft.rootowner, (level || 1) + 1);
				}
				this.nfts[child.id] = Object.assign(Object.assign({}, this.nfts[child.id]),
								{
									forsale: BigInt(0),  //设置为not for sale
									rootowner: rootowner || nft.rootowner
								});
			});
			await Promise.all(promises);
		}
		*/

		//

	}
	async updateNFTBuy(nft, consolidatedNFT) {
//		this.nfts[consolidatedNFT.id] = Object.assign(Object.assign({}, this.nfts[consolidatedNFT.id]), { owner: nft === null || nft === void 0 ? void 0 : nft.owner, rootowner: nft === null || nft === void 0 ? void 0 : nft.rootowner, changes: nft === null || nft === void 0 ? void 0 : nft.changes, forsale: nft === null || nft === void 0 ? void 0 : nft.forsale });
	}
	async updateNFTSend(nft, consolidatedNFT) {
		/*
		this.nfts[consolidatedNFT.id] =
			Object.assign(Object.assign({}, this.nfts[consolidatedNFT.id]),
				{
					changes: nft === null || nft === void 0 ? void 0 : nft.changes,
					owner: nft === null || nft === void 0 ? void 0 : nft.owner,
					rootowner: nft === null || nft === void 0 ? void 0 : nft.rootowner,
					forsale: BigInt(0),
					pending: nft === null || nft === void 0 ? void 0 : nft.pending
					});
		*/
		let curStatusNft = await this._getNFTAndAllSubInfo(consolidatedNFT.id);
		let newStatusNft = Object.assign(Object.assign({}, curStatusNft),
			{
				changes: nft === null || nft === void 0 ? void 0 : nft.changes,
				owner: nft === null || nft === void 0 ? void 0 : nft.owner,
				rootowner: nft === null || nft === void 0 ? void 0 : nft.rootowner,
				forsale: BigInt(0),
				pending: nft === null || nft === void 0 ? void 0 : nft.pending
			});

		try {
			if(!isPolkadotAddress(curStatusNft.owner)) {
				// Remove NFT from children of previous owner
				let oldParentId = curStatusNft.owner;
				let oldOwner = await this._getNFTAndAllSubInfo(oldParentId);
				let oldOwnerChildren = oldOwner.children;
				for(let i = 0 ; i < oldOwnerChildren.length ; i++) {
					let tempChild = oldOwnerChildren[i];
					if(tempChild.id == consolidatedNFT.id) {
						await DaoNFTChild.deleteChildByNftIdAndChildId(oldOwner.id, consolidatedNFT.id);
						break;
					}
				}
			}

			await DaoNFT.updateNFTById(newStatusNft.id,
									newStatusNft.owner, newStatusNft.forsale,
									newStatusNft.pending, newStatusNft.burned);

			if(!isPolkadotAddress(newStatusNft.owner)) {
				// Add NFT as child of new owner
				let newParentId = newStatusNft.owner;
				let newOwner = await this._getNFTAndAllSubInfo(newParentId);
				let newOwnerChildren = newOwner.children;
				let childFound = false;
				for(let i = 0 ; i<newOwnerChildren.length ; i++) {
					let tempChild = newOwnerChildren[i];
					if(tempChild.id == consolidatedNFT.id) {
						childFound = true;
						break;
					}
				}
				if(!childFound) {
					let txCaller = await iwFindRootOwner(curStatusNft.id); //the old owner must be the tx caller
					let newRootOwner = await iwFindRootOwner(newOwner.id);
//					console.log(txCaller, newRootOwner);
					await DaoNFTChild.createDaoNFTChild(newOwner.id, consolidatedNFT.id, (txCaller != newRootOwner), "");
				}
			}

		} catch (e) {
			console.log(e);
		}
	}
	async updateNFTBurn(nft, consolidatedNFT) {
//		this.nfts[consolidatedNFT.id] = Object.assign(Object.assign({}, this.nfts[consolidatedNFT.id]), { burned: nft === null || nft === void 0 ? void 0 : nft.burned, changes: nft === null || nft === void 0 ? void 0 : nft.changes, equipped: "", forsale: BigInt(nft.forsale) > BigInt(0) ? BigInt(0) : nft.forsale });
	}
	async updateNFTMint(nft) {
//		this.nfts[nft.getId()] = Object.assign(Object.assign({}, nft), { symbol: nft.symbol, id: nft.getId() });
		let tempNFT = Object.assign(Object.assign({}, nft), { symbol: nft.symbol, id: nft.getId() });
		try {
			await DaoNFT.createNewNFTRecord(tempNFT.id,
											tempNFT.block, tempNFT.collection, tempNFT.symbol, tempNFT.sn,
											tempNFT.owner, tempNFT.metadata);
//			console.log(`when nft ${tempNFT.id} mint`);
//			console.log(`resources:`, tempNFT.resources);
//			console.log(`priority:`, tempNFT.priority);
//			console.log(`children:`, tempNFT.children);
//			console.log(`\n`);
		} catch (e) {
			console.log(e);
		}
	}
	async updateCollectionMint(collection) {
		/*
		return (this.collections[collection.id] = collection);
		*/
		try {
			await DaoCollection.createNewCollectionRecord(collection.id, collection.issuer,
														collection.symbol, collection.max,
														collection.metadata, collection.block);
		} catch (e) {
			console.log(e);
		}
	}
	async updateBase(base) {
		/*
		return (this.bases[base.getId()] = Object.assign(Object.assign({}, base), { id: base.getId() }));
		*/
		let tempBase = Object.assign(Object.assign({}, base), { id: base.getId() });
		let ok = false;
		try {
			await DaoBase.createNewBaseRecord(tempBase.id, tempBase.issuer, tempBase.symbol, tempBase.type, tempBase.block);
			let parts = tempBase.parts;
			for(let i = 0 ; i < parts.length ; i++) {
				let tempPart = parts[i];
				await DaoBasePart.createNewBasePartRecord(tempBase.id, tempPart.id, tempPart.type, tempPart.src, tempPart.z);
				if(tempPart.type == "slot" && tempPart.equippable.length > 0) {
					for(let j=0 ; j<tempPart.equippable.length ; j++) {
						let tempEquipCollectionId = tempPart.equippable[j];
						await DaoBasePartEquippable.createNewBasePartEquippableRecord(tempBase.id, tempPart.id, tempEquipCollectionId);
					}
				}
			}
			ok = true;
		} catch (e) {
			console.log(e);
		}
		if(!ok) {
			throw new ResponseCodeError(ResponseCode.SYSTEM_ERROR);
		}
		return tempBase;
	}
	async updateBaseThemeAdd(base, consolidatedBase) {
//		this.bases[consolidatedBase.id] = Object.assign(Object.assign({}, this.bases[consolidatedBase.id]), { themes: base === null || base === void 0 ? void 0 : base.themes });
	}
	async updateCollectionIssuer(collection, consolidatedCollection) {
//		this.collections[consolidatedCollection.id] = Object.assign(Object.assign({}, this.collections[consolidatedCollection.id]), { issuer: collection === null || collection === void 0 ? void 0 : collection.issuer, changes: collection === null || collection === void 0 ? void 0 : collection.changes });
	}
	async updateBaseIssuer(base, consolidatedBase) {
//		this.bases[consolidatedBase.id] = Object.assign(Object.assign({}, this.bases[consolidatedBase.id]), { issuer: base === null || base === void 0 ? void 0 : base.issuer, changes: base === null || base === void 0 ? void 0 : base.changes });
	}
	async getNFTById(id) {
		//return this.nfts[id];
		return await this._getNFTAndAllSubInfo(id);
	}
	async getCollectionById(id) {
		/*
		return this.collections[id];
		*/
		return DaoCollection.getCollectionRecordsById(id);
	}
	/**
	 * Find existing NFT by id
	 */
	async getNFTByIdUnique(id) {
		//return this.nfts[id];
		return await this._getNFTAndAllSubInfo(id);
	}
	async getBaseById(id) {
		/*
		return this.bases[id]; //create cache?
		*/
		let tgtBase = await DaoBase.getBaseRecordsById(id);
		if(tgtBase != null) {
			let parts = await DaoBasePart.getBasePartRecordsByBaseId(id);
			for(let i = 0 ; i < parts.length ; i++) {
				let tmpPart = parts[i];
				if(tmpPart.type == "slot") {
					tmpPart.equippable = await DaoBasePartEquippable.getCollectionIdsByBaseIdAndPartId(tgtBase.id, tmpPart.id);
				}
			}
			tgtBase.parts = parts;
		}
		return tgtBase;
	}

	async _getNFTAndAllSubInfo(id) {
		let tgtNft = await DaoNFT.getNFTRecordsById(id);
		if(tgtNft != null) {
			// load resources from db
			let resources = await DaoNFTResource.getNFTResourceRecordsByNftId(id);
			for(let i = 0 ; i < resources.length ; i++) {
				let tempRes = resources[i];
				if(tempRes.base != null) {
					//the resource is base
					tempRes.parts = await DaoNFTResourceBasePart.getNFTResourceBasePartsByNftIdAndResourceId(tgtNft.id, tempRes.id);
				} else {
					//the resource is media or others
				}
			}
			tgtNft.resources = resources;

			// load priority from db
			let priorityRecs = await DaoNFTPriority.getNFTPriorityRecordsByNftId(id);
			priorityRecs = priorityRecs.sort(function (a ,b) {
				return b.order - a.order;
			});
			let priority = [];
			for(let i = 0 ; i < priorityRecs.length ; i++) {
				priority.push(priorityRecs[i].resourceId);
			}
			tgtNft.priority = priority;

			// load children from db
			let children = await DaoNFTChild.getNFTChildrenByNftId(id);
			tgtNft.children = children || [];

			// logic
		}
		return tgtNft;
	}

}

//call once to create the instance
InitWorldAdapter.getInstance();
module.exports = InitWorldAdapter;
