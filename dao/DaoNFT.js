let DataTypes = require("sequelize").DataTypes;
let lindb = require("./linkDb");
let sequelize = lindb.sequelize;

const DaoNFT = sequelize.define('DaoNFT', {
    id: {
		type:DataTypes.STRING(128),
        primaryKey:true,
        field:"id"
    },
	block:{
		type:DataTypes.INTEGER.UNSIGNED,
			field:"block"
	},
	collection:{
		type:DataTypes.STRING(48),
		field:"collection"
	},
	symbol: {
		type:DataTypes.STRING(48),
		field:"symbol"
	},
	sn:{
		type:DataTypes.STRING(8),
		field:"sn"
	},
	owner:{
		type:DataTypes.STRING(48),
		field:"owner"
	},
	/*
	rootowner:{ //can be found in db
		type:DataTypes.STRING(48),
		field:"rootowner"
	},
	resources:{

	}
	priority:{

	},
	children:{

	},
	logic :{

	},
	*/
	metadata: {
		type:DataTypes.STRING(255),
		field:"metadata"
	},
	transferable:{
		type:DataTypes.INTEGER,
		field:"transferable"
	},
	pending:{
		type:DataTypes.BOOLEAN,
		field:"pending"
	},
	forsale:{
		type:DataTypes.INTEGER,
		field:"forsale"
	},
	burned:{
		type:DataTypes.INTEGER,
		field:"burned"
	},
}, {
    // Other model options go here
    tableName: 'nft',
    timestamps: false
});

async function createNewNFTRecord(id, block, collection, symbol, sn, owner, metadata, transaction) {
    let newNFTModel = await DaoNFT.create({
		id:id,
		block:block,
		collection:collection,
		symbol:symbol,
		sn:sn,
		owner:owner,
		metadata:metadata
    },{
        transaction:transaction,
        logging:false
    });
    let newNFTObj = null;
    if(newNFTModel != null) {
		newNFTObj = newNFTModel.toJSON();
    }
    return newNFTObj;
}

async function getNFTRecordsById(id, transaction, forUpdate) {
    let options = {
        where: {
			id: id
        },
        logging:false
    }
    if(transaction != null) {
        options.transaction = transaction;
        if(forUpdate != null) {
            options.lock = forUpdate?transaction.LOCK.UPDATE:transaction.LOCK.SHARE;
        }
    }

    let tgtRecordModel = await DaoNFT.findOne(options);
	let tgtRecordObj = null;
	if (tgtRecordModel != null) {
		tgtRecordObj = tgtRecordModel.toJSON();
	}
	return tgtRecordObj;
}

async function getNFTIdsByOwner(owner, transaction, forUpdate) {
	let options = {
		attributes:["id"],
		where: {
			owner: owner
		},
		logging:console.log
	}
	if(transaction != null) {
		options.transaction = transaction;
		if(forUpdate != null) {
			options.lock = forUpdate?transaction.LOCK.UPDATE:transaction.LOCK.SHARE;
		}
	}

	let tgtModels = await DaoNFT.findAll(options);
	let nftIds = [];
	for(let i = 0 ; i < tgtModels.length; i++) {
		nftIds.push(tgtModels[i].toJSON().id);
	}
	return nftIds;

}

exports.createNewNFTRecord = createNewNFTRecord;
exports.getNFTRecordsById = getNFTRecordsById;
exports.getNFTIdsByOwner = getNFTIdsByOwner;
