const { mongoose } = require('./db');
const { OrderStatus } = require('../helpers/enums');
const countries = require('country-data').countries;

const modelName = 'Order';

const Schema = new mongoose.Schema(
	{
		clientId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true
		},
		_deliveryServiceId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true
		},
		_itemIds: {
			type: [ mongoose.Schema.Types.ObjectId ],
			required: true,
			validate: {
				validator: function(v) {
					return Boolean(v.length);
				},
				message: 'Item ids can not be empty'
			},
		},
		geo: {
			type: String,
			required: true,
			validate: {
				validator: function(v) {
					return countries[v] && countries[v].alpha3 === v;
				},
				message: 'Invalid geo'
			},
		},
		status: {
			type: String,
			enum: Object.values(OrderStatus),
			default: OrderStatus.CREATED
		},
		updated: { type: Date, default: Date.now() },
		created: { type: Date, default: Date.now() },
	},
	{
		collection: 'orders'
	}
);

Schema.virtual('id').get(function () {
	return this._id.toString();
});

Schema.virtual('deliveryServiceId')
	.get(function () {
		return this._deliveryServiceId.toString();
	})
	.set(function (v) {
		this._deliveryServiceId = v;
	});

Schema.virtual('itemIds')
	.get(function () {
		return this._itemIds.map(itemId => itemId.toString());
	})
	.set(function (v) {
		this._itemIds = v;
	});

Schema.pre('save', function (next) {
	this.updated = new Date();
	next();
});

const Model = mongoose.model(modelName, Schema);

module.exports = Model;