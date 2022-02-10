//InMemoryAdapter is copy of InMemoryAdapter in rmrk-tools
//base InMemoryAdapter can not be exported from rmrk-tools
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

	async loadRMRK2StatusFromJsonFile() {
		this.nfts = {};
		this.collections = {};
		this.bases = {};
	}

}

//call once to create the instance
InitWorldMemoryAdapter.getInstance();
module.exports = InitWorldMemoryAdapter;
