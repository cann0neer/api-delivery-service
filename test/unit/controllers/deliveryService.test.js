const deliveryService = require('../../../src/api/logic/controllers/deliveryService');
const { ItemTypes } = require('../../../src/api/helpers/enums');
const _noop = require('lodash/noop');
const sinon = require('sinon');
const assert = require('assert');
const { arr2Obj } = require('../../../src/api/helpers/utils');

const getResources = () => {
	return {
		models: {
			DeliveryService: {
				create: _noop,
				updateOneSafe: _noop
			}
		}
	};
};

describe('DeliveryService controller test cases', () => {

	describe('signup method test cases', () => {

		test('Should create a new delivery service successfully', async () => {
			const resources = getResources();

			const name = 'mock-name';
			const description = 'mock-description';
			const geos = [ 'UKR' ];
			const itemTypes = [ ItemTypes.FRAGILE ];
			const deliveryServiceId = 'mock-delivery-service-id';
			const input = { name, description, geos, itemTypes };

			const mockDeliveryService = sinon.mock(resources.models.DeliveryService);

			mockDeliveryService.expects('create')
				.once()
				.withArgs({
					name,
					description,
					geos: arr2Obj(geos),
					itemTypes: arr2Obj(itemTypes),
				})
				.returns(Promise.resolve({ id: deliveryServiceId }));

			const expectedResponse = {
				success: true,
				deliveryServiceId
			};

			const response = await deliveryService.init(resources).signup({ input });

			assert.deepStrictEqual(response, expectedResponse);
			mockDeliveryService.verify();
		});

	});

	describe('updateGeos method test cases', () => {

		test('Should update a delivery service with new geos successfully', async () => {
			const resources = getResources();

			const geos = [ 'UKR' ];
			const deliveryServiceId = 'mock-delivery-service-id';
			const input = { deliveryServiceId, geos };

			const mockDeliveryService = sinon.mock(resources.models.DeliveryService);

			mockDeliveryService.expects('updateOneSafe')
				.once()
				.withArgs({ _id: deliveryServiceId }, { $set: { geos: arr2Obj(geos) } })
				.returns(Promise.resolve({ n: 1, ok: 1 }));

			const expectedResponse = {
				success: true
			};

			const response = await deliveryService.init(resources).updateGeos({ input });

			assert.deepStrictEqual(response, expectedResponse);
			mockDeliveryService.verify();
		});

	});

	describe('updateItemTypes method test cases', () => {

		test('Should update a delivery service with new item types successfully', async () => {
			const resources = getResources();

			const itemTypes = [ ItemTypes.FRAGILE ];
			const deliveryServiceId = 'mock-delivery-service-id';
			const input = { deliveryServiceId, itemTypes };

			const mockDeliveryService = sinon.mock(resources.models.DeliveryService);

			mockDeliveryService.expects('updateOneSafe')
				.once()
				.withArgs({ _id: deliveryServiceId }, { $set: { itemTypes: arr2Obj(itemTypes) } })
				.returns(Promise.resolve({ n: 1, ok: 1 }));

			const expectedResponse = {
				success: true
			};

			const response = await deliveryService.init(resources).updateItemTypes({ input });

			assert.deepStrictEqual(response, expectedResponse);
			mockDeliveryService.verify();
		});

	});

});