const { createResolver } =  require('apollo-resolvers');
const { ApolloError } = require('apollo-server-express');

const baseResolver = createResolver(
	null,
	(root, args, context, error) => {
		console.error(error);

		if (error instanceof ApolloError) {
			return error;

		} else if (error.name === 'ValidationError') {
			return new ApolloError(error.message || 'Validation error', 422);

		} else if (error.name === 'CastError' && error.kind === 'ObjectId') {
			// mask cast to ObjectId error, a user should see only NotFound
			return new ApolloError('Not found', 404);

		} else if (error.name === 'MongoError' && error.code === 11000) {
			// breaking a unique constraint, duplication
			return new ApolloError('Conflict error', 409);

		} else {
			return new ApolloError('An unknown error has occurred! Please try again later', 500);
		}
	}
);

module.exports = {
	baseResolver
};
