const { ApolloServer } = require('apollo-server-express');
const fs = require('fs');
const { makeExecutableSchema } = require('graphql-tools');

/**
 * Makes a proper GraphQL schema according to the path
 * @param path
 * @returns {Object}
 * @private
 */
const _makeSchema = (path) => {
	const Query = require(`./resolvers/${path}/queries`);
	const Mutation = require(`./resolvers/${path}/mutations`);

	const typeDefsGeneral = `${fs.readFileSync(__dirname.concat(`/schemas/common.graphqls`), 'utf8')}`;
	const typeDefs = `${fs.readFileSync(__dirname.concat(`/schemas/${path}.graphqls`), 'utf8')}`;
	const resolvers = {
		Query: Query,
		Mutation: Mutation
	};

	return makeExecutableSchema({
		typeDefs: [ typeDefs, typeDefsGeneral ],
		resolvers
	});
};

/**
 * Starts a GraphQl server according to the name,
 * applies it to the express app as a middleware
 * @param serverName
 * @param app
 * @param options
 */
module.exports.startGraphqlServer = (serverName, app, options) => {
	const path = serverName.toLowerCase();

	const serverClient = new ApolloServer({
		... options,
		schema: _makeSchema(path),
		debug: false
	});
	serverClient.applyMiddleware({ app, path: `/${path}` });
};
