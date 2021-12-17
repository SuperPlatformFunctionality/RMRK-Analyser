let DataTypes = require("sequelize").DataTypes;
let lindb = require("./linkDb");
let sequelize = lindb.sequelize;

const DaoNFTResourceBasePart = sequelize.define('DaoNFTResourceBasePart', {
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
	partId:{
		type:DataTypes.STRING(48),
		primaryKey:true,
		field:"part_id"
	},
}, {
    // Other model options go here
    tableName: 'nft_resource_base_part',
    timestamps: false
});

async function createNewNFTResourceBasePart(nftId, resourceId, partId, transaction) {
    let newNFTResBasePartModel = await DaoNFTResourceBasePart.create({
		nftId:nftId,
		resourceId:resourceId,
		partId:partId
    },{
        transaction:transaction,
        logging:false
    });
    let newNFTResBasePartObj = null;
    if(newNFTResBasePartModel != null) {
		newNFTResBasePartObj = newNFTResBasePartModel.toJSON();
    }
    return newNFTResBasePartObj;
}

async function getNFTResourceBasePartsByNftIdAndResourceId(nftId, resourceId, transaction, forUpdate) {
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

	let tgtModels = await DaoNFTResourceBasePart.findAll(options);
	let partIds = [];
	for(let i = 0 ; i < tgtModels.length; i++) {
		partIds.push(tgtModels[i].toJSON().partId);
	}

	return partIds;
}

exports.createNewNFTResourceBasePart = createNewNFTResourceBasePart;
exports.getNFTResourceBasePartsByNftIdAndResourceId = getNFTResourceBasePartsByNftIdAndResourceId;

