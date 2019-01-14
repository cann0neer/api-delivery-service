const { baseResolver } = require('../../general');

module.exports = {
	items:  baseResolver.createResolver(async (root, args, { controllers }) => {
		return await controllers.client.findItems(args);
	}),
};