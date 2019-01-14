const ItemTypes = {
	DEFAULT: 'DEFAULT',
	LARGE: 'LARGE',
	FRAGILE: 'FRAGILE',
};

const OrderStatus = {
	CREATED: 'CREATED',
	PENDING: 'PENDING',
	COMPLETED: 'COMPLETED',
	CANCELED: 'CANCELED',
};

const ServerName = {
	CLIENT: 'CLIENT',
	DELIVERY: 'DELIVERY'
};

module.exports = {
	ItemTypes,
	OrderStatus,
	ServerName
};