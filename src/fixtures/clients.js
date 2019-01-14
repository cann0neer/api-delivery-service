const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

module.exports = { Client: [
	{
		"_id" : ObjectId("5c3847aa83579f221094b296"),
		"name" : "client 1",
		"description" : "some description"
	},
	{
		"_id" : ObjectId("5c3847c9f69bb422370f48d2"),
		"name" : "client 2",
		"description" : "some description",
	},
	{
		"_id" : ObjectId("5c3b7504306ab2286482ef91"),
		"name" : "client 3",
		"description" : "some description"
	}
]};