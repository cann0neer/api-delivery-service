const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

module.exports = { Item: [
	{
		"_id" : ObjectId("5c34b4324da30d3411c78c71"),
		"type" : "DEFAULT",
		"name" : "good1",
		"description" : "some desc",
	},
	{
		"_id" : ObjectId("5c34b4324da30d3411c78c72"),
		"type" : "LARGE",
		"name" : "good2",
		"description" : "some desc",
	},
	{
		"_id" : ObjectId("5c34b4324da30d3411c78c73"),
		"type" : "FRAGILE",
		"name" : "good3",
		"description" : "some desc",
	}
]};