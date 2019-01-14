const { baseResolver } = require('../../general');

module.exports = {

	signup: baseResolver.createResolver((root, args, { controllers }) => {
		return controllers.deliveryService.signup(args);
	}),

	updateGeos: baseResolver.createResolver((root, args, { controllers }) => {
		return controllers.deliveryService.updateGeos(args);
	}),

	updateItemTypes: baseResolver.createResolver((root, args, { controllers }) => {
		return controllers.deliveryService.updateItemTypes(args);
	})
};