'use strict';

const { Consolidator, OP_TYPES } = require('rmrk-tools');
const DaoInvalidCall = require("../dao/DaoInvalidCall.js");

class InitWorldConsolidator extends Consolidator {
	constructor(ss58Format, dbAdapter, emitEmoteChanges, emitInteractionChanges) {
		super(ss58Format, dbAdapter, emitEmoteChanges, emitInteractionChanges);
	}

	//it is a private method in ts source code
	updateInvalidCalls(op_type, remark) {
		const invalidCallBase = {
			op_type,
			block: remark.block,
			caller: remark.caller,
		};
		return async function update(object_id, message) {
			/*
			this.invalidCalls.push(Object.assign(Object.assign({}, invalidCallBase), { object_id,
				message }));
			*/
			try {
				await DaoInvalidCall.createNewInvalidCallRecord(invalidCallBase.op_type,
					invalidCallBase.block, invalidCallBase.caller,
					object_id, message);
			} catch (e) {
				console.log("DaoInvalidCall.createNewInvalidCallRecord exception:", e);
			}
		};
	}

	async consolidateToDB(rmrks) {
		const remarks = rmrks || [];
		// console.log(remarks);
		for (const remark of remarks) {
			// console.log('==============================');
			// console.log('Remark is: ' + remark.remark);
			switch (remark.interaction_type) {
				case OP_TYPES.CREATE:
					if (await this.create(remark)) {
						continue;
					}
					break;
				case OP_TYPES.MINT:
					if (await this.mint(remark)) {
						continue;
					}
					break;
				case OP_TYPES.SEND:
					if (await this.send(remark)) {
						continue;
					}
					break;
				case OP_TYPES.BUY:
					// An NFT was bought after being LISTed
					if (await this.buy(remark)) {
						continue;
					}
					break;
				case OP_TYPES.BURN:
					// An NFT was burned
					if (await this.burn(remark)) {
						continue;
					}
					break;
				case OP_TYPES.LIST:
					// An NFT was listed for sale
					if (await this.list(remark)) {
						continue;
					}
					break;
				case OP_TYPES.EMOTE:
					if (await this.emote(remark)) {
						continue;
					}
					break;
				case OP_TYPES.CHANGEISSUER:
					if (await this.changeIssuer(remark)) {
						continue;
					}
					break;
				case OP_TYPES.BASE:
					if (await this.base(remark)) {
						continue;
					}
					break;
				case OP_TYPES.EQUIPPABLE:
					if (await this.equippable(remark)) {
						continue;
					}
					break;
				case OP_TYPES.RESADD:
					if (await this.resadd(remark)) {
						continue;
					}
					break;
				case OP_TYPES.ACCEPT:
					if (await this.accept(remark)) {
						continue;
					}
					break;
				case OP_TYPES.EQUIP:
					if (await this.equip(remark)) {
						continue;
					}
					break;
				case OP_TYPES.SETPRIORITY:
					if (await this.setpriority(remark)) {
						continue;
					}
					break;
				case OP_TYPES.SETPROPERTY:
					if (await this.setproperty(remark)) {
						continue;
					}
					break;
				case OP_TYPES.THEMEADD:
					if (await this.themeadd(remark)) {
						continue;
					}
					break;
			}
		}
		// deeplog(this.nfts);
		// deeplog(this.collections);
		//console.log(this.invalidCalls);
		// console.log(
		//   `${this.nfts.length} NFTs across ${this.collections.length} collections.`
		// );
		// console.log(`${this.invalidCalls.length} invalid calls.`);
		/*
		const result = {
			nfts: this.dbAdapter.getAllNFTs
				? await this.dbAdapter.getAllNFTs()
				: {},
			collections: this.dbAdapter.getAllCollections
				? await this.dbAdapter.getAllCollections()
				: {},
			bases: this.dbAdapter.getAllBases
				? await this.dbAdapter.getAllBases()
				: {},
			invalid: this.invalidCalls,
		};
		if (this.emitInteractionChanges) {
			result.changes = this.interactionChanges;
		}
		return result;
		*/
		return true;
	}

}

module.exports = InitWorldConsolidator;
