const Slime = require("./../models/slimeModel");
const QueryHandler = require("../utils/queryHandler");
const catchAsync = require("../utils/catchAsync");
const ErrorHandler = require("../utils/errorHandler");

// Middleware to extract gameId from route parameters and add to query
exports.extractGameId = (req, res, next) => {
	if (req.params.gameId) {
		// Extract the gameId from route parameters
		req.query.games = req.params.gameId;
	}

	next();
};

// To get all slimes, wrapped with catchAsync for error handling
exports.getAllSlimes = catchAsync(async (req, res) => {
	// Pass the query object and string
	const queryHandler = new QueryHandler(Slime.find(), req.query)
		.filter()
		.sort()
		.limitFields()
		.paginate();

	// Execute the query to fetch the slimes from the database
	const slimes = await queryHandler.query;

	// Send a successful response with the fetched data
	res.status(200).json({
		status: "success",
		requestedAt: req.requestTime,
		results: slimes.length,
		data: { slimes },
	});
});

// To get a single slime by ID, wrapped with catchAsync
exports.getSlime = catchAsync(async (req, res, next) => {
	// Get the ID from request parameters
	const requestedId = req.params.id;

	let slime;
	// Check if the requestedId is a valid MongoDB ObjectId
	if (mongoose.Types.ObjectId.isValid(requestedId)) {
		// Query by _id if the requestedId is a valid ObjectId
		slime = await Slime.findById(requestedId);
	} else {
		// Otherwise, query by custom id field
		slime = await Slime.findOne({ id: requestedId });
	}

	if (!slime) {
		// If no slime is found, create an instance of ErrorHandler and pass it to the error-handling middleware
		return next(new ErrorHandler("No slime found with that ID", 404));
	}

	res.status(200).json({
		status: "success",
		requestedAt: req.requestTime,
		data: { slime },
	});
});

// To create a new slime, wrapped with catchAsync
exports.createSlime = catchAsync(async (req, res) => {
	const newSlime = await Slime.create(req.body);

	res.status(201).json({
		status: "success",
		requestedAt: req.requestTime,
		data: {
			slime: newSlime,
		},
	});
});

// To update an existing slime by ID, wrapped with catchAsync
exports.updateSlime = catchAsync(async (req, res) => {
	const updatedSlime = await Slime.findByIdAndUpdate(req.params.id, req.body, {
		new: true, // returns the new modified document rather than original.
		runValidators: true, // validate the update operation against the model's schema
	});

	if (!updatedSlime) {
		// If no slime is found, create an instance of AppError and pass it to next
		return next(new ErrorHandler("No slime found with that ID", 404));
	}

	res.status(200).json({
		status: "success",
		requestedAt: req.requestTime,
		data: {
			slime: updatedSlime,
		},
	});
});

// To delete a slime by ID, wrapped with catchAsync
exports.deleteSlime = catchAsync(async (req, res) => {
	const deletedSlime = await Slime.findByIdAndDelete(req.params.id);

	if (!deletedSlime) {
		// If no slime is found, create an instance of AppError and pass it to next
		return next(new ErrorHandler("No slime found with that ID", 404));
	}

	res.status(204).json({
		status: "success",
		requestedAt: req.requestTime,
		data: {
			slime: null,
		},
	});
});

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
