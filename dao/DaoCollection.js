let DataTypes = require("sequelize").DataTypes;
let lindb = require("./linkDb");
let sequelize = lindb.sequelize;

const DaoCollection = sequelize.define('DaoCollection', {
    id: {
		type:DataTypes.STRING(96),
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
	max:{
		type:DataTypes.INTEGER.UNSIGNED,
		field:"max"
	},
	metadata: {
		type:DataTypes.STRING(255),
		field:"metadata"
	},
	/*
	properties :{

	}
	*/
	block:{
		type:DataTypes.INTEGER.UNSIGNED,
		field:"block"
	}
}, {
    // Other model options go here
    tableName: 'collection',
    timestamps: false
});

async function createNewCollectionRecord(id, issuer, symbol, max, metadata, block, transaction) {
    let newCollectionModel = await DaoCollection.create({
		id:id,
		issuer:issuer,
		symbol:symbol,
		max:max,
		metadata:metadata,
		block:block
    },{
        transaction:transaction,
        logging:false
    });
    let newCollectionObj = null;
    if(newCollectionModel != null) {
		newCollectionObj = newCollectionModel.toJSON();
    }
    return newCollectionObj;
}

async function getCollectionRecordsById(id, transaction, forUpdate) {
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

    let tgtRecordModel = await DaoCollection.findOne(options);
	let tgtRecordObj = null;
	if (tgtRecordModel != null) {
		tgtRecordObj = tgtRecordModel.toJSON();
	}
	return tgtRecordObj;
}

exports.createNewCollectionRecord = createNewCollectionRecord;
exports.getCollectionRecordsById = getCollectionRecordsById;
