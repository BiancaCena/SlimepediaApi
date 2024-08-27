const { query } = require("express");
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
			data: {
				slime: newSlime,
			},
		});
	} catch (err) {
		res.status(400).json({
			status: "fail",
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
