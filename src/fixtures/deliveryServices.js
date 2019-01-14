const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

module.exports = { DeliveryService: [
	{
		"_id" : ObjectId("5c3840a5db9afc1cc7b7f639"),
		"name" : "delivery service 1",
		"description" : "some description",
		"itemTypes" : {
			"DEFAULT" : true,
			"LARGE" : true
		},
		"geos" : {
			"UKR" : true,
			"KAZ" : true,
			"DEU" : true
		},
	},
	{
		"_id" : ObjectId("5c3841a99151321d42cd7a4f"),
		"name" : "delivery service 2",
		"description" : "some description",
		"itemTypes" : {
			"FRAGILE" : true
		},
		"geos" : {
			"UKR" : true
		},
	},
	{
		"_id" : ObjectId("5c3841c49151321d42cd7a51"),
		"name" : "delivery service 3",
		"description" : "some description",
		"itemTypes" : {
			"LARGE" : true
		},
		"geos" : {
			"UKR" : true
		},
	},
	{
		"_id" : ObjectId("5c3841e29151321d42cd7a53"),
		"name" : "delivery service 4",
		"description" : "some description",
		"itemTypes" : {
			"DEFAULT" : true,
		},
		"geos" : {
			"UKR" : true,
			"KAZ" : true,
			"DEU" : true
		},
	},
	{
		"_id" : ObjectId("5c3b227d12889e2f3f1e6f0b"),
		"name" : "delivery service 5",
		"description" : "some description",
		"itemTypes" : {
			"FRAGILE" : true,
		},
		"geos" : {
			"DEU" : true
		},
	}
]};