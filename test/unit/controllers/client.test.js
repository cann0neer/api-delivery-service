const client = require('../../../src/api/logic/controllers/client');
const { ApolloError } = require('apollo-server-express');
const { ItemTypes } = require('../../../src/api/helpers/enums');
const _noop = require('lodash/noop');
const _get = require('lodash/get');
const sinon = require('sinon');
const assert = require('assert');

const getResources = () => {
	return {
		models: {
			Client: {
				create: _noop
			},
			Item: {
				find: _noop
			},
			DeliveryService: {
				find: _noop,
				findOne: _noop
			},
			Order: {
				create: _noop
			}
		}
	};
};

describe('Client controller test cases', () => {

	describe('signup method test cases', () => {

		test('Should create a new client successfully', async () => {
			const resources = getResources();

			const name = 'mock-name';
			const description = 'mock-description';
			const clientId = 'mock-client-id';
			const input = { name, description, additional: 'some string' };

			const mockClient = sinon.mock(resources.models.Client);

			mockClient.expects('create')
				.once()
				.withArgs({ name, description })
				.returns(Promise.resolve({ id: clientId }));

			const expectedResponse = {
				success: true,
				clientId
			};

			const response = await client.init(resources).signup({ input });

			assert.deepStrictEqual(response, expectedResponse);
			mockClient.verify();
		});

	});

	describe('findItems method test cases', () => {

		test('Should find without filtering successfully', async () => {
			const resources = getResources();

			const input = {};
			const items = [ { id: 'mock-item-id' } ];

			const mockItem = sinon.mock(resources.models.Item);

			mockItem.expects('find')
				.once()
				.withArgs({})
				.returns(Promise.resolve(items));

			const expectedResponse = { items };

			const response = await client.init(resources).findItems({ input });

			assert.deepStrictEqual(response, expectedResponse);
			mockItem.verify();
		});

		test('Should find with filtering by geo successfully', async () => {
			const resources = getResources();

			const geo = 'UKR';
			const input = { geo };
			const items = [ { id: 'mock-item-id' } ];

			const mockItem = sinon.mock(resources.models.Item);
			const mockDeliveryService = sinon.mock(resources.models.DeliveryService);

			mockDeliveryService.expects('find')
				.once()
				.withArgs({ [ `geos.${geo}` ]: true })
				.returns(Promise.resolve([
					{ itemTypesList: [ ItemTypes.DEFAULT ] },
					{ itemTypesList: [ ItemTypes.DEFAULT, ItemTypes.FRAGILE ] },
				]));

			mockItem.expects('find')
				.once()
				.withArgs({
					type: { $in: [ ItemTypes.DEFAULT, ItemTypes.FRAGILE ] }
				})
				.returns(Promise.resolve(items));

			const expectedResponse = { items };

			const response = await client.init(resources).findItems({ input });

			assert.deepStrictEqual(response, expectedResponse);
			mockItem.verify();
		});

	});

	describe('makeOrder method test cases', () => {

		const geo = 'UKR';
		const itemIds = [ 'mock-item-1', 'mock-item-2' ];
		const clientId = 'mock-client-id';
		const deliveryServiceId = 'mock-delivery-service-id';
		const orderId = 'mock-order-id';
		const input = { geo, itemIds, clientId };

		test('Should make an order successfully', async () => {
			const resources = getResources();

			const items = [
				{ type: ItemTypes.DEFAULT },
				{ type: ItemTypes.FRAGILE },
			];

			const order = {
				id: orderId
			};

			const deliveryService = {
				id: deliveryServiceId
			};

			const mockItem = sinon.mock(resources.models.Item);
			const mockDeliveryService = sinon.mock(resources.models.DeliveryService);
			const mockOrder = sinon.mock(resources.models.Order);

			mockItem.expects('find')
				.once()
				.withArgs({ _id: { $in: itemIds } })
				.returns(Promise.resolve(items));

			mockDeliveryService.expects('findOne')
				.once()
				.withArgs({
					[ `geos.${geo}` ]: true,
					[ `itemTypes.${ItemTypes.DEFAULT}` ]: true,
					[ `itemTypes.${ItemTypes.FRAGILE}` ]: true,
				})
				.returns(Promise.resolve(deliveryService));

			mockOrder.expects('create')
				.once()
				.withArgs({
					clientId,
					itemIds,
					deliveryServiceId,
					geo
				})
				.returns(Promise.resolve(order));

			const expectedResponse = {
				success: true,
				order,
				deliveryService
			};

			const response = await client.init(resources).makeOrder({ input });

			assert.deepStrictEqual(response, expectedResponse);
			mockItem.verify();
			mockDeliveryService.verify();
			mockOrder.verify();
		});

		test('Should throw 404 error if at least 1 item is not found', async () => {
			const resources = getResources();

			const items = [
				{ type: ItemTypes.DEFAULT },
			];

			const mockItem = sinon.mock(resources.models.Item);

			mockItem.expects('find')
				.returns(Promise.resolve(items));

			try {
				await client.init(resources).makeOrder({ input });
			} catch (err) {
				if (err instanceof ApolloError && _get(err, 'extensions.code') === 404) {
					return assert.ok('Exception was thrown as expected');
				}

				return assert.fail('Error code is wrong');
			}

			assert.fail('Exception was expected but did not occur');
		});

		test('Should throw 422 error if there is no delivery service supported given geo', async () => {
			const resources = getResources();

			const items = [
				{ type: ItemTypes.DEFAULT },
				{ type: ItemTypes.FRAGILE },
			];

			const mockItem = sinon.mock(resources.models.Item);
			const mockDeliveryService = sinon.mock(resources.models.DeliveryService);

			mockItem.expects('find')
				.returns(Promise.resolve(items));

			mockDeliveryService.expects('findOne')
				.returns(Promise.resolve(null));

			try {
				await client.init(resources).makeOrder({ input });
			} catch (err) {
				if (err instanceof ApolloError && _get(err, 'extensions.code') === 422) {
					return assert.ok('Exception was thrown as expected');
				}

				return assert.fail('Error code is wrong');
			}

			assert.fail('Exception was expected but did not occur');
		});

	});

});