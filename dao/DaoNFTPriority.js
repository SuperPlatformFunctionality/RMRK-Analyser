let DataTypes = require("sequelize").DataTypes;
let lindb = require("./linkDb");
let sequelize = lindb.sequelize;

const DaoNFTPriority = sequelize.define('DaoNFTPriority', {
	nftId: {
		type:DataTypes.STRING(128),
		primaryKey:true,
		field:"nft_id"
	},
	resourceId: {
		type:DataTypes.STRING(128),
		primaryKey:true,
        field:"resource_id"
    },
	order:{
		type:DataTypes.INTEGER.UNSIGNED,
		field:"order"
	}
}, {
    // Other model options go here
    tableName: 'nft_priority',
    timestamps: false
});

async function createNewNFTPriority(nftId, resourceId, order, transaction) {
    let newNFTResModel = await DaoNFTPriority.create({
		nftId:nftId,
		resourceId:resourceId,
		order:order
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

async function getNFTPriorityRecordByNftIdAndResourceId(nftId, resourceId, transaction, forUpdate) {
	let options = {
		where: {
			nftId:nftId,
			resourceId: resourceId
		},
		logging:false
	}
	if(transaction != null) {
		options.transaction = transaction;
		if(forUpdate != null) {
			options.lock = forUpdate?transaction.LOCK.UPDATE:transaction.LOCK.SHARE;
		}
	}

	let tgtRecordModel = await DaoNFTPriority.findOne(options);
	let tgtRecordObj = null;
	if (tgtRecordModel != null) {
		tgtRecordObj = tgtRecordModel.toJSON();
	}
	return tgtRecordObj;
}

async function getNFTPriorityRecordsByNftId(nftId, transaction, forUpdate) {
    let options = {
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

	let tgtModels = await DaoNFTPriority.findAll(options);
	let tgtObjs = [];
	for(let i = 0 ; i < tgtModels.length; i++) {
		let tmpModel = tgtModels[i];
		let tmpObj = tmpModel.toJSON();
		tgtObjs.push(tmpObj);
	}
	return tgtObjs;

}

async function updateNFTPriorityRecordOrderByNftIdAndResourceId(nftId, resourceId, newOrder){
	let retArray = await DaoNFTPriority.update({
		order:newOrder
	},{
		where:{
			nftId:nftId,
			resourceId:resourceId
		},
		logging:false
	});
	let affectedRow = retArray[0];
	if(affectedRow > 1) {
		console.log("update multiple record's status, it is impossible");
	}
	return true;
}

exports.createNewNFTPriority = createNewNFTPriority;
exports.getNFTPriorityRecordByNftIdAndResourceId = getNFTPriorityRecordByNftIdAndResourceId;
exports.getNFTPriorityRecordsByNftId = getNFTPriorityRecordsByNftId;
exports.updateNFTPriorityRecordOrderByNftIdAndResourceId = updateNFTPriorityRecordOrderByNftIdAndResourceId;
