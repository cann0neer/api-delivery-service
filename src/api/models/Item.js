const { mongoose } = require('./db');
const { ItemTypes } = require('../helpers/enums');

const modelName = 'Item';

const Schema = new mongoose.Schema(
	{
		name       : { type: String },
		description: { type: String },
		type       : {
			type: String,
			enum: Object.values(ItemTypes),
			default: ItemTypes.DEFAULT,
			index: true
		},
		created    : { type: Date, default: Date.now() },
	},
	{
		collection: 'items'
	}
);

Schema.virtual('id').get(function () {
	return this._id.toString();
});

const Model = mongoose.model(modelName, Schema);

module.exports = Model;