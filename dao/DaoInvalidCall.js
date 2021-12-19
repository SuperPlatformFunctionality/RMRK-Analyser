let DataTypes = require("sequelize").DataTypes;
let lindb = require("./linkDb");
let sequelize = lindb.sequelize;

const DaoInvalidCall = sequelize.define('DaoInvalidCall', {
    id: {
        type:DataTypes.INTEGER.UNSIGNED,
        primaryKey:true,
        autoIncrement:true,
        field:"id"
    },
    opType: {
		type:DataTypes.STRING(16),
		field:"op_type"
    },
	block: {
		type:DataTypes.INTEGER.UNSIGNED,
		field:"block"
	},
	caller: {
		type:DataTypes.STRING(48),
		field:"caller"
	},
	objectId:{
		type:DataTypes.STRING(512),
		field:"object_id"
	},
	message: {
		type:DataTypes.STRING(512),
		field:"message"
	}
}, {
    // Other model options go here
    tableName: 'invalid_call',
    timestamps: false
});

async function createNewInvalidCallRecord(opType, block, caller, objectId, message, transaction) {
    let newRecordModel = await DaoInvalidCall.create({
		opType:opType,
		block:block,
		caller:caller,
		objectId:objectId,
		message:message
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

async function getInvalidCallsByCaller(caller, transaction, forUpdate) {
    let options = {
        where: {
			caller: caller
        },
        logging:false
    }
    if(transaction != null) {
        options.transaction = transaction;
        if(forUpdate != null) {
            options.lock = forUpdate?transaction.LOCK.UPDATE:transaction.LOCK.SHARE;
        }
    }

    let tgtRecordModels = await DaoInvalidCall.findAll(options);
    let recordObjs = [];
	for(let i = 0 ; i < tgtRecordModels.length; i++) {
		let tmpModel = tgtRecordModels[i];
		let tmpObj = tmpModel.toJSON();
		recordObjs.push(tmpObj);
	}
	return recordObjs;
}

exports.createNewInvalidCallRecord = createNewInvalidCallRecord;
exports.getInvalidCallsByCaller = getInvalidCallsByCaller;

