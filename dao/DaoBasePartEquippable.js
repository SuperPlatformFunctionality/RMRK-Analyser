let DataTypes = require("sequelize").DataTypes;
let lindb = require("./linkDb");
let sequelize = lindb.sequelize;

const DaoBasePartEquippable = sequelize.define('DaoBasePartEquippable', {
	baseId: {
		type:DataTypes.STRING(48),
		primaryKey:true,
		field:"base_id"
	},
	partId: {
		type:DataTypes.STRING(48),
		primaryKey:true,
		field:"part_id"
	},
	collectionId:{
		type:DataTypes.STRING(48),
		field:"collection_id"
	}
}, {
    // Other model options go here
    tableName: 'base_part_equippable',
    timestamps: false
});

async function createNewBasePartEquippableRecord(baseId, partId, collectionId, transaction) {
    let newRecordModel = await DaoBasePartEquippable.create({
		baseId:baseId,
		partId:partId,
		collectionId:collectionId
    },{
        transaction:transaction,
        logging:false
    });
    let newRecordObj = null;
    if(newRecordModel != null) {
		newRecordObj = newRecordModel.toJSON();
    }
    return newRecordObj;
}

async function getCollectionIdsByBaseIdAndPartId(baseId, partId, transaction, forUpdate) {
	let options = {
		attributes:["collectionId"],
		where: {
			baseId: baseId,
			partId: partId
		},
		logging:false
	}
	if(transaction != null) {
		options.transaction = transaction;
		if(forUpdate != null) {
			options.lock = forUpdate?transaction.LOCK.UPDATE:transaction.LOCK.SHARE;
		}
	}

	let tgtModels = await DaoBasePartEquippable.findAll(options);
	let collectionIds = [];
	for(let i = 0 ; i < tgtModels.length; i++) {
		collectionIds.push(tgtModels[i].toJSON().collectionId);
	}
	return collectionIds;

}

exports.createNewBasePartEquippableRecord = createNewBasePartEquippableRecord;
exports.getCollectionIdsByBaseIdAndPartId = getCollectionIdsByBaseIdAndPartId;
