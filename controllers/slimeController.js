const Slime = require("./../models/slimeModel");
const QueryHandler = require("../utils/queryHandler");

exports.extractGameId = async (req, res, next) => {
	if (req.params.gameId) {
		// Extract the gameId from route parameters
		req.query.games = req.params.gameId;
	}

	next();
};

exports.getAllSlimes = async (req, res) => {
	try {
		// ---------------- BUILD QUERY ---------------- //
		// Pass the query object and string
		const queryHandler = new QueryHandler(Slime.find(), req.query)
			.filter()
			.sort()
			.limitFields()
			.paginate();

		// ---------------- EXECUTE QUERY ---------------- //
		// Execute the query to fetch the slimes from the database
		const slimes = await queryHandler.query;

		// ---------------- RESPONSE ---------------- //
		// Send a successful response with the fetched data
		res.status(200).json({
			status: "success",
			requestedAt: req.requestTime,
			results: slimes.length,
			data: { slimes },
		});
	} catch (err) {
		// Handle errors and send a failure response
		res.status(404).json({
			status: "fail",
			message: err.message || "An error occurred",
		});
	}
};

exports.getSlime = async (req, res) => {
	try {
		const slime = await Slime.findById(req.params.id);

		res.status(200).json({
			status: "success",
			requestedAt: req.requestTime,
			data: { slime },
		});
	} catch (err) {
		res.status(404).json({
			status: "fail",
			message: err,
		});
	}
};

exports.createSlime = async (req, res) => {
	try {
		const newSlime = await Slime.create(req.body);

		res.status(201).json({
			status: "success",
			requestedAt: req.requestTime,
			data: {
				slime: newSlime,
			},
		});
	} catch (err) {
		res.status(400).json({
			status: "fail",
			requestedAt: req.requestTime,
			message: err,
		});
	}
};

exports.updateSlime = async (req, res) => {
	try {
		const updatedSlime = await Slime.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true, // returns the new modified document rather than original.
				runValidators: true, // validate the update operation against the model's schema
			}
		);

		res.status(200).json({
			status: "success",
			requestedAt: req.requestTime,
			data: {
				slime: updatedSlime,
			},
		});
	} catch (err) {
		res.status(404).json({
			status: "fail",
			message: err,
		});
	}
};

exports.deleteSlime = async (req, res) => {
	try {
		await Slime.findByIdAndDelete(req.params.id);

		res.status(204).json({
			status: "success",
			requestedAt: req.requestTime,
			data: {
				slime: null,
			},
		});
	} catch (err) {
		res.status(404).json({
			status: "fail",
			message: err,
		});
	}
};

exports.getSlimesByLocation = async (req, res) => {
	try {
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
					slimes: { $addToSet: "$_id" },
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
	} catch (err) {
		res.status(404).json({
			status: "fail",
			message: err.message,
		});
	}
};

exports.getSlimesByType = async (req, res) => {
	try {
		// Run the aggregation pipeline on the Slime collection
		const types = await Slime.aggregate([
			// Group documents by the 'type' field, count occurrences, and aggregate the slime IDs.
			{
				$group: {
					// Group by the 'type' field
					_id: "$type",
					// Count the number of slimes per type
					count: { $sum: 1 },
					// Aggregate unique slime IDs for each type
					slimes: { $addToSet: "$_id" },
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
	} catch (err) {
		res.status(404).json({
			status: "fail",
			message: err.message,
		});
	}
};
