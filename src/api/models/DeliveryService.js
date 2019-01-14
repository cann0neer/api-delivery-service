const { mongoose } = require('./db');
const { ItemTypes } = require('../helpers/enums');
const _ = require('lodash');
const countries = require('country-data').countries;

const modelName = 'DeliveryService';

const Schema = new mongoose.Schema(
	{
		name: {
			type: String,
			unique: true,
			validate: {
				validator: function(v) {
					return /^[a-zA-Z0-9_\s]+$/.test(v);
				},
				message: 'Invalid name'
			},
		},
		description: { type: String },
		itemTypes: {
			type: Object,
			default: {},
			validate: {
				validator: function(v) {
					const itemTypes = Object.keys(v);

					for (let i = 0; i < itemTypes.length; i++) {
						const type = itemTypes[i];

						if (!ItemTypes[type]) {
							return false;
						}
					}

					return true;
				},
				message: 'Invalid itemTypes'
			},
		},
		/**
		 * Example:
		 *
		 * geos: {
		 *     UKR: true,
		 *     KAZ: true
		 * }
		 *
		 * In comparison with an array format, this one is easier to extend.
		 * For instance, if it's needed to support regions and cities, we can do it in a such way:
		 *
		 * geos: {
		 *     UKR: {
		 *     		LVIV_REGION_ID: true,
		 *			KYIV_REGION_ID: {
		 *				KYIV_CITY_ID: true
		 *			}
		 *     }
		 *     KAZ: true
		 * }
		 *
		 */
		geos: {
			type: Object,
			default: {},
			validate: {
				validator: function(v) {
					if (!_.isObject(v)) {
						return false;
					}

					const countryCodes = Object.keys(v);

					for (let i = 0; i < countryCodes.length; i++) {
						const code = countryCodes[i];

						// only alpha3 matches are allowed
						if (!countries[code] || countries[code].alpha3 !== code) {
							return false;
						}
					}

					return true;
				},
				message: 'Invalid GEO code'
			},
			required: true
		},
		updated: { type: Date, default: Date.now() },
		created: { type: Date, default: Date.now() },
	},
	{
		collection: 'delivery_services'
	}
);

Schema.pre('save', function (next) {
	this.updated = new Date();
	next();
});

Schema.virtual('id').get(function () {
	return this._id.toString();
});

Schema.virtual('itemTypesList').get(function () {
	return Object.keys(this.itemTypes);
});

/**
 * Guarantees that update is always called with validation
 * @param filter
 * @param data
 * @param options
 * @returns {Promise<void>}
 */
Schema.statics.updateOneSafe = async function (filter, data, options = {}) {
	Object.assign(options, { runValidators: true });
	return await this.updateOne(filter, data, options);
};

const Model = mongoose.model(modelName, Schema);

module.exports = Model;