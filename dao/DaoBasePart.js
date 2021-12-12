let DataTypes = require("sequelize").DataTypes;
let lindb = require("./linkDb");
let sequelize = lindb.sequelize;

const DaoBasePart = sequelize.define('DaoBasePart', {
	baseId:{
		type:DataTypes.STRING(42),
			field:"base_id"
	},
	id: {
		type:DataTypes.STRING(48),
		primaryKey:true,
		field:"id"
	},
	type: {
		type:DataTypes.STRING(16),
		field:"type"
	},
	src:{
		type:DataTypes.STRING(255),
		field:"src"
	},
	z:{
		type:DataTypes.INTEGER,
		field:"z"
	},
	/*
	equippable: {
		type:DataTypes.STRING(42),   //when type is slot, need equippable list
		field:"equippable"
	}, //需要一个关联表?
	themable:{
		type:DataTypes.BOOLEAN,
		field:"equippable"
	},
	*/

}, {
    // Other model options go here
    tableName: 'base_part',
    timestamps: false
});

async function createNewBasePartRecord(baseId, id, type, src, z, transaction) {
    let newRecordModel = await DaoBasePart.create({
		baseId:baseId,
		id:id,
		type:type,
		src:src,
		z:z
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

async function getBasePartRecordsByMBaseIdAndId(baseId, id, transaction, forUpdate) {
    let options = {
        where: {
			baseId: baseId,
			id : id
        },
        logging:false
    }
    if(transaction != null) {
        options.transaction = transaction;
        if(forUpdate != null) {
            options.lock = forUpdate?transaction.LOCK.UPDATE:transaction.LOCK.SHARE;
        }
    }

    let tgtRecordModels = await DaoBasePart.findAll(options);
    let recordObjs = [];
	for(let i = 0 ; i < tgtRecordModels.length; i++) {
		let tmpModel = tgtRecordModels[i];
		let tmpObj = tmpModel.toJSON();
		recordObjs.push(tmpObj);
	}
	return recordObjs;
}

exports.createNewBasePartRecord = createNewBasePartRecord;
exports.getBasePartRecordsByMBaseIdAndId = getBasePartRecordsByMBaseIdAndId;
