const config = require('config');
const mongoose = require('mongoose');

module.exports.init = () => {
	mongoose.connect(config.get('db.uri'), { useNewUrlParser: true });
	mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
};

module.exports.mongoose = mongoose;
