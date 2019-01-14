const _ = require('lodash');
const { ApolloError } = require('apollo-server-express');
const { arr2Obj } = require('../../helpers/utils');


module.exports.init = ({ models = {} }) => {
	const { DeliveryService } = models;

	return {
		/**
		 * Creates a new delivery service, returns ID
		 * @param input
		 * @returns {Promise<{clientId, success: boolean}>}
		 */
		signup:  async ({ input }) => {
			const data = _.pick(input, [ 'name', 'description' ]);
			data.geos = arr2Obj(input.geos);
			data.itemTypes = arr2Obj(input.itemTypes);

			const { id } = await DeliveryService.create(data);
			return {
				success: Boolean(id),
				deliveryServiceId: id
			};
		},

		/**
		 * Update item types which the delivery service should support
		 * @param input
		 * @returns {Promise<{success: boolean}>}
		 */
		updateItemTypes: async ({ input }) => {
			const { deliveryServiceId } = input;
			const itemTypes = arr2Obj(input.itemTypes);

			const result = await DeliveryService.updateOneSafe(
				{
					_id: deliveryServiceId
				},
				{
					$set: { itemTypes }
				}
			);

			if (!result.n) {
				throw new ApolloError('Delivery service is not found', 404);
			}

			return {
				success: Boolean(result.ok)
			};
		},

		/**
		 * Update geos which the delivery service should support
		 * @param input
		 * @returns {Promise<{success: boolean}>}
		 */
		updateGeos: async ({ input }) => {
			const { deliveryServiceId } = input;
			const geos = arr2Obj(input.geos);

			const result = await DeliveryService.updateOneSafe(
				{
					_id: deliveryServiceId
				},
				{
					$set: { geos }
				}
			);

			if (!result.n) {
				throw new ApolloError('Delivery service is not found', 404);
			}

			return {
				success: Boolean(result.ok)
			};
		}
	};
};
