const Slime = require("../models/slimeModel");
const catchAsync = require("../utils/catchAsync");
const dataController = require("./dataController");

// Middleware to extract propertyName and propertyValue from route parameters and add to query
exports.extractProperty = (req, res, next) => {
	// Extract params
	const key = req.params.propertyName;
	const value = req.params.propertyValue;
	if (key && value) {
		// Append only if property does not exists
		if (!req.query.hasOwnProperty(key)) {
			req.query[key] = value;
		}
	}

	next();
};

// To get all slimes using a reusable function from dataController
exports.getAllSlimes = dataController.getAll(Slime);

// To create get a slime by object id using a reusable function from dataController
exports.getSlimeByObjectId = dataController.getOneByObjectId(Slime);

// To get slimes by location, wrapped with catchAsync
exports.getSlimesByLocation = catchAsync(async (req, res) => {
	// Run the aggregation pipeline on the Slime collection
	const locations = await Slime.aggregate([
		// Deconstruct the 'locations' array field to output a document for each element.
		{
			$unwind: "$locations",
		},
		// Group documents by the 'locations' field, count occurrences, and aggregate the slime IDs.
		{
			$group: {
				// Group by the 'locations' field
				_id: "$locations",
				// Count the number of slimes per location
				count: { $sum: 1 },
				// Aggregate unique slime IDs for each location
				// Use custom id instead of object id
				slimes: { $addToSet: "$id" },
			},
		},
		// Sort the 'slimes' array by the slime ID (sort the slimes within each location).
		{
			$addFields: {
				slimes: {
					$sortArray: {
						input: "$slimes",
						sortBy: 1, // ascending order
					},
				},
			},
		},
		// Sort the location documents based on count in descending order
		{
			$sort: { count: -1 },
		},
	]);

	// Return the response with status 200 and the aggregated data
	res.status(200).json({
		status: "success",
		requestedAt: req.requestTime,
		results: locations.length,
		data: { locations },
	});
});

// To get slimes by type, wrapped with catchAsync
exports.getSlimesByType = catchAsync(async (req, res) => {
	// Run the aggregation pipeline on the Slime collection
	const types = await Slime.aggregate([
		// Group documents by the 'type' field, count occurrences, and aggregate the slime IDs.
		{
			$group: {
				// Group by the 'type' field
				_id: "$type",
				// Count the number of slimes per type
				count: { $sum: 1 },
				// Aggregate unique slime IDs for each location
				// Use custom id instead of object id
				slimes: { $addToSet: "$id" },
			},
		},
		// Sort the 'slimes' array by the slime ID (sort the slimes within each type).
		{
			$addFields: {
				slimes: {
					$sortArray: {
						input: "$slimes",
						sortBy: 1, // ascending order
					},
				},
			},
		},
		// Sort the type documents based on count in descending order
		{
			$sort: { count: -1 },
		},
	]);

	// Return the response with status 200 and the aggregated data
	res.status(200).json({
		status: "success",
		requestedAt: req.requestTime,
		results: types.length,
		data: { types },
	});
});

/*
// To create a new slime using a reusable function from dataController
exports.createSlime = dataController.createOne(Slime);

// To update an existing slime by ID using a reusable function from dataController
exports.updateSlimeByObjectId = dataController.updateOneByObjectId(Slime);

// To delete a slime by Object ID using a reusable function from dataController
exports.deleteSlimeByObjectId = dataController.deleteOneByObjectId(Slime);
*/
