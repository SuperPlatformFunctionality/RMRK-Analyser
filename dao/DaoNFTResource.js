let DataTypes = require("sequelize").DataTypes;
let lindb = require("./linkDb");
let sequelize = lindb.sequelize;

const DaoNFTResource = sequelize.define('DaoNFTResource', {
	nftId: {
		type:DataTypes.STRING(128),
		primaryKey:true,
		field:"nft_id"
	},
    id: {
		type:DataTypes.STRING(128),
        primaryKey:true,
        field:"id"
    },
	base:{
		type:DataTypes.STRING(48),
		field:"base"
	},
	/*
	parts :{

	}
	*/
	src:{
		type:DataTypes.STRING(255),
		field:"src"
	},
	metadata: {
		type:DataTypes.STRING(255),
		field:"metadata"
	}
}, {
    // Other model options go here
    tableName: 'nft_resource',
    timestamps: false
});

async function createNewNFTResourceRecord(nftId, id, base, src, metadata, transaction) {
    let newNFTResModel = await DaoNFTResource.create({
		nftId:nftId,
		id:id,
		base:base,
		src:src,
		metadata:metadata
    },{
        transaction:transaction,
        logging:false
    });
    let newNFTResObj = null;
    if(newNFTResModel != null) {
		newNFTResObj = newNFTResModel.toJSON();
    }
    return newNFTResObj;
}

async function getNFTResourceRecordByNftIdAndId(nftId, id, transaction, forUpdate) {
	let options = {
		where: {
			nftId:nftId,
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

	let tgtRecordModel = await DaoNFTResource.findOne(options);
	let tgtRecordObj = null;
	if (tgtRecordModel != null) {
		tgtRecordObj = tgtRecordModel.toJSON();
	}
	return tgtRecordObj;
}

async function getNFTResourceRecordsByNftId(nftId, transaction, forUpdate) {
    let options = {
		attributes:{
			exclude: ["nftId"]
		},
        where: {
			nftId: nftId
        },
        logging:false
    }
    if(transaction != null) {
        options.transaction = transaction;
        if(forUpdate != null) {
            options.lock = forUpdate?transaction.LOCK.UPDATE:transaction.LOCK.SHARE;
        }
    }

	let tgtModels = await DaoNFTResource.findAll(options);
	let tgtObjs = [];
	for(let i = 0 ; i < tgtModels.length; i++) {
		let tmpModel = tgtModels[i];
		let tmpObj = tmpModel.toJSON();
		tgtObjs.push(tmpObj);
	}
	return tgtObjs;

}

exports.createNewNFTResourceRecord = createNewNFTResourceRecord;
exports.getNFTResourceRecordByNftIdAndId = getNFTResourceRecordByNftIdAndId;
exports.getNFTResourceRecordsByNftId = getNFTResourceRecordsByNftId;
