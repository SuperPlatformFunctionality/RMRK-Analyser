let DataTypes = require("sequelize").DataTypes;
let lindb = require("./linkDb");
let sequelize = lindb.sequelize;

const DaoBase = sequelize.define('DaoBase', {
    id: {
		type:DataTypes.STRING(48), //should be calculated in protocol, but be stored in db when implemented
        primaryKey:true,
        field:"id"
    },
	issuer:{
		type:DataTypes.STRING(48),
		field:"issuer"
	},
	symbol: {
		type:DataTypes.STRING(48),
		field:"symbol"
	},
	type: {
		type:DataTypes.STRING(16),
		field:"type"
	},
	/*
	parts:{

	},
	themes: {

	},
	changes:{

	},
	*/
	block:{
		type:DataTypes.INTEGER.UNSIGNED,
		field:"block"
	}
}, {
    // Other model options go here
    tableName: 'base',
    timestamps: false
});

async function createNewBaseRecord(id, issuer, symbol, type, block, transaction) {
    let newBaseModel = await DaoBase.create({
		id:id,
		issuer:issuer,
		symbol:symbol,
		type:type,
		block:block
    },{
        transaction:transaction,
        logging:true
    });
    let newBaseObj = null;
    if(newBaseModel != null) {
		newBaseObj = newBaseModel.toJSON();
    }
    return newBaseObj;
}

async function getBaseRecordsById(id, transaction, forUpdate) {
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

    let tgtRecordModel = await DaoBase.findOne(options);
	let tgtRecordObj = null;
	if (tgtRecordModel != null) {
		tgtRecordObj = tgtRecordModel.toJSON();
	}
	return tgtRecordObj;
}

/*
async function setInvestRecordStatusByRecordId(recordId, newStatus) {
	let retArray = await InvestRecordDao.update({
		status:newStatus,
	},{
		where:{
			recordId: recordId
		},
		logging:false
	});
	let affectedRow = retArray[0];
	if(affectedRow > 1) {
		console.log("update multiple record's status, it is impossible");
	}
	return true;
}
*/

exports.createNewBaseRecord = createNewBaseRecord;
exports.getBaseRecordsById = getBaseRecordsById;
