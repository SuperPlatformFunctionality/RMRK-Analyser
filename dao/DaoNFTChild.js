let DataTypes = require("sequelize").DataTypes;
let lindb = require("./linkDb");
let sequelize = lindb.sequelize;

const DaoNFTChild = sequelize.define('DaoNFTChild', {
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
	pending:{
		type:DataTypes.BOOLEAN,
		field:"pending"
	},
	equipped:{
		type:DataTypes.STRING(48),
		field:"equipped"
	}
}, {
    // Other model options go here
    tableName: 'nft_child',
    timestamps: false
});

async function createDaoNFTChild(nftId, id, pending, equipped, transaction) {
    let newNFTChildModel = await DaoNFTChild.create({
		nftId:nftId,
		id:id,
		pending:pending,
		equipped:equipped
    },{
        transaction:transaction,
        logging:false
    });
    let newNFTChildObj = null;
    if(newNFTChildModel != null) {
		newNFTChildObj = newNFTChildModel.toJSON();
    }
    return newNFTChildObj;
}

async function getNFTChildrenByNftId(nftId, transaction, forUpdate) {
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

	let tgtModels = await DaoNFTChild.findAll(options);
	let tgtObjs = [];
	for(let i = 0 ; i < tgtModels.length; i++) {
		let tmpModel = tgtModels[i];
		let tmpObj = tmpModel.toJSON();
		tgtObjs.push(tmpObj);
	}
	return tgtObjs;

}

async function deleteChildByNftIdAndChildId(nftId, id, transaction, forUpdate) {
	let options = {
		where: {
			nftId:nftId,
			id:id,
		},
		logging:false
	}
	if(transaction != null) {
		options.transaction = transaction;
		if(forUpdate != null) {
			options.lock = forUpdate?transaction.LOCK.UPDATE:transaction.LOCK.SHARE;
		}
	}

	let affectedRow = await DaoNFTChild.destroy(options);
	if(affectedRow > 1) {
		console.log("delete multiple record's status");
	}
	return true;
}


exports.createDaoNFTChild = createDaoNFTChild;
exports.getNFTChildrenByNftId = getNFTChildrenByNftId;
exports.deleteChildByNftIdAndChildId = deleteChildByNftIdAndChildId;
