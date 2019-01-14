const modelsModule = require('./api/models');
const db = require('./api/models/db');
const fixtures = require('node-mongoose-fixtures');

modelsModule.init();
db.init();

const clientData = require('./fixtures/clients');
const deliveryServiceData = require('./fixtures/deliveryServices');
const itemsData = require('./fixtures/items');

fixtures.reset((err) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}

	fixtures(
		{
			...clientData,
			...deliveryServiceData,
			...itemsData
		}, (err) => {
			if (err) {
				console.error(err);
				process.exit(1);
			}

			console.log('Success!');
			process.exit();
		}
	);

});
