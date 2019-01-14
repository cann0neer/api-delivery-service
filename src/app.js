const express = require('express');

const logger = require('morgan');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');

const { ServerName } = require('./api/helpers/enums');
const { startGraphqlServer } = require('./api/graphql');

const db = require('./api/models/db');
db.init();

const app = express();

app.use(helmet());

app.use(logger('dev'));
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(compression()); // Compress all routes

let httpServer;

module.exports = {
	start: (resources) => {

		const options = {
			context: { controllers: resources.logic.controllers }
		};

		startGraphqlServer(ServerName.CLIENT, app, options);
		startGraphqlServer(ServerName.DELIVERY, app, options);

		app.listen({ port: 5000 }, () =>
			console.log(`🚀 Server ready at http://localhost:5000`)
		);
	},
	stop: () => {
		if (httpServer) {
			httpServer.stop();
		}
	}
};
