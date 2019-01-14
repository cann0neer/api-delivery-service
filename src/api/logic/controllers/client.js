const { ApolloError } = require('apollo-server-express');

module.exports.init = ({ models = {} }) => {
	const { Client, Item, DeliveryService, Order } = models;

	return {
		/**
		 * Creates a new client, returns ID
		 * @param input
		 * @returns {Promise<{clientId, success: boolean}>}
		 */
		signup:  async ({ input }) => {
			const { name, description } = input;
			const { id } = await Client.create({ name, description });
			return {
				success: Boolean(id),
				clientId: id
			};
		},

		/**
		 * Finds all items (inventories) in the system,
		 * if geo is passed, returns only items which delivery service is available for
		 * @param input
		 * @returns {Promise<{items: *}>}
		 */
		findItems: async ({ input }) => {
			const { geo } = input;

			const filter = {};

			if (geo) {
				// find available delivery services for given geo
				const deliveryServices = await DeliveryService.find({ [ `geos.${geo}` ]: true });

				// get all item types which available delivery services support
				let itemTypesSupported = deliveryServices.reduce((acc, { itemTypesList }) => {
					acc.push(...itemTypesList);
					return acc;
				}, []);

				// get unique value only
				itemTypesSupported = Array.from(new Set(itemTypesSupported));

				filter.type = { $in: itemTypesSupported };
			}

			const items = await Item.find(filter);
			return { items };
		},

		/**
		 * Creates a new order.
		 * All given items should exist and
		 * at least 1 delivery service should support both given geo and item types
		 * @param input
		 * @returns {Promise<*>}
		 */
		makeOrder: async ({ input }) => {
			const { geo, clientId } = input;
			const itemIds = Array.from(new Set(input.itemIds));

			const items = await Item.find({ _id: { $in: itemIds } });

			if (items.length < itemIds.length) {
				throw new ApolloError('At least 1 item is not found', 404);
			}

			const filter = {
				[ `geos.${geo}` ]: true
			};

			items.forEach(item => {
				filter[ `itemTypes.${item.type}` ] = true;
			});

			const deliveryService = await DeliveryService.findOne(filter);

			if (!deliveryService) {
				throw new ApolloError('No delivery service to support given geo and item types', 422);
			}

			const order = await Order.create({
				clientId,
				itemIds,
				deliveryServiceId: deliveryService.id,
				geo
			});

			return {
				success: Boolean(order && order.id),
				order,
				deliveryService
			};
		}
	};
};
