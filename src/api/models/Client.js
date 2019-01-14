const { mongoose } = require('./db');

const modelName = 'Client';

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
		updated: { type: Date, default: Date.now() },
		created: { type: Date, default: Date.now() },
	},
	{
		collection: 'clients'
	}
);

Schema.virtual('id').get(function () {
	return this._id.toString();
});

Schema.pre('save', function (next) {
	this.updated = new Date();
	next();
});

const Model = mongoose.model(modelName, Schema);

module.exports = Model;