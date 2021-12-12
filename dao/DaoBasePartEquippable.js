let DataTypes = require("sequelize").DataTypes;
let lindb = require("./linkDb");
let sequelize = lindb.sequelize;

const DaoBasePartEquippable = sequelize.define('DaoBasePartEquippable', {
	baseId: {
		type:DataTypes.STRING(48),
		field:"base_id"
	},
	partId: {
		type:DataTypes.STRING(48),
		field:"party_id"
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

async function createNewBasePartEquippableRecord(baseId, partyId, collectionId, transaction) {
    let newRecordModel = await DaoBasePartEquippable.create({
		baseId:baseId,
		partyId:partyId,
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

exports.createNewBasePartEquippableRecord = createNewBasePartEquippableRecord;
