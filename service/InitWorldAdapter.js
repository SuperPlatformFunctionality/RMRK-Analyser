'use strict';
import DaoBase from "../dao/DaoBase.js";
import DaoBasePart from "../dao/DaoBasePart.js"
import DaoBasePartEquippable from "../dao/DaoBasePartEquippable.js"
import DaoCollection from "../dao/DaoCollection.js"
import DaoNFT from "../dao/DaoNFT.js"
import DaoNFTResource from "../dao/DaoNFTResource.js"
import DaoNFTResourceBasePart from "../dao/DaoNFTResourceBasePart.js"

import ResponseCode from "../utils/ResponseCode";
import ResponseCodeError from "../utils/ResponseCodeError";

// temporarily use es6 (compatible with commonjs with babel)
// need to rewrite with ts
class InitWorldAdapter {
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
//		this.nfts[consolidatedNFT.id] = Object.assign(Object.assign({}, this.nfts[consolidatedNFT.id]), { children: nft.children });
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
		let newNftInst = Object.assign(Object.assign({}, this.nfts[consolidatedNFT.id]),
			{
				resources: nft === null || nft === void 0 ? void 0 : nft.resources,
				priority: (nft === null || nft === void 0 ? void 0 : nft.priority) || this.nfts[consolidatedNFT.id].priority
			});
		try {
			let newResources = newNftInst.resources;
			if(newResources && newResources.length > 0) {
				for(let i = 0 ; i < newResources.length ; i++) {
					let resItem = newResources[i];
					let existResItem = await DaoNFTResource.getNFTResourceRecordsByNftIdAndId(consolidatedNFT.id, resItem.id);
					if(existResItem == null) {
						await DaoNFTResource.createNewNFTResourceRecord(consolidatedNFT.id, resItem.id,
							resItem.base,
							resItem.src, resItem.metadata);
						if(resItem.base != null) {
							for(let i= 0 ; i < resItem.parts.length ; i++) {
								let tempResBasePart = resItem.parts[i];
								await DaoNFTResourceBasePart.createNewNFTResourceBasePart(consolidatedNFT.id, resItem.id, tempResBasePart);
							}
						}
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
				this.nfts[child.id] = Object.assign(Object.assign({}, this.nfts[child.id]), { forsale: BigInt(0), rootowner: rootowner || nft.rootowner });
			});
			await Promise.all(promises);
		}
		*/
	}
	async updateNFTBuy(nft, consolidatedNFT) {
//		this.nfts[consolidatedNFT.id] = Object.assign(Object.assign({}, this.nfts[consolidatedNFT.id]), { owner: nft === null || nft === void 0 ? void 0 : nft.owner, rootowner: nft === null || nft === void 0 ? void 0 : nft.rootowner, changes: nft === null || nft === void 0 ? void 0 : nft.changes, forsale: nft === null || nft === void 0 ? void 0 : nft.forsale });
	}
	async updateNFTSend(nft, consolidatedNFT) {
//		this.nfts[consolidatedNFT.id] = Object.assign(Object.assign({}, this.nfts[consolidatedNFT.id]), { changes: nft === null || nft === void 0 ? void 0 : nft.changes, owner: nft === null || nft === void 0 ? void 0 : nft.owner, rootowner: nft === null || nft === void 0 ? void 0 : nft.rootowner, forsale: BigInt(0), pending: nft === null || nft === void 0 ? void 0 : nft.pending });
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
		return DaoBase.getBaseRecordsById(id);
	}

	async _getNFTAndAllSubInfo(id) {
		let tgtNft = await DaoNFT.getNFTRecordsById(id);
		if(tgtNft != null) {
			// resources
			let resources = await DaoNFTResource.getNFTResourceRecordsByNftId(id);
			tgtNft.resources = resources;
			for(let i = 0 ; i < resources.length ; i++) {
				let tempRes = resources[i];
				if(tempRes.base != null) {
					//the resource is base
					tempRes.parts = await DaoNFTResourceBasePart.getNFTResourceBasePartsByNftIdAndResourceId(tgtNft.id, tempRes.id);
				} else {
					//the resource is media or others
				}
			}

			// priority, need to load from db
			tgtNft.priority = [];

			// children
			// logic
		}
		return tgtNft;
	}
}

export default InitWorldAdapter;
