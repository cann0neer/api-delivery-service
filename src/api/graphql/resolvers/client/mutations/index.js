const { baseResolver } = require('../../general');

module.exports = {

	signup: baseResolver.createResolver((root, args, { controllers }) => {
		return controllers.client.signup(args);
	}),

	request: baseResolver.createResolver((root, args, { controllers }) => {
		return controllers.client.makeOrder(args);
	})
};