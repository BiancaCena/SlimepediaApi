const { query } = require("express");
const Slime = require("./../models/slimeModel");

exports.getAllSlimes = async (req, res) => {
	try {
		// ---------------- INITIAL SETUP ---------------- //
		// Create a copy of the query parameters from the request
		const queryObj = { ...req.query };

		// List fields to exclude from filtering (pagination, sorting, etc.)
		const excludedFields = ["page", "sort", "limit", "fields"];
		// Remove the excluded fields from the query object
		excludedFields.forEach((field) => delete queryObj[field]);

		// ---------------- FILTERING ---------------- //
		// Convert the query object to a JSON string for manipulation
		let queryStr = JSON.stringify(queryObj);

		// Replace comparison operators with MongoDB's query syntax (e.g., $gte, $gt, $lte, $lt)
		queryStr = queryStr.replace(
			/\b(gte|gt|lte|lt|eq|ne|in|nin)\b/g,
			(match) => `$${match}`
		);

		// Parse the modified query string back to an object for MongoDB query
		// Create the query with the filtered conditions
		let query = Slime.find(JSON.parse(queryStr));

		// ---------------- SORTING ---------------- //
		if (req.query.sort) {
			// Separate the sort fields by space (ex. "type,name" becomes "type name")
			const sortBy = req.query.sort.split(",").join(" ");
			query = query.sort(sortBy);
		} else {
			// If no sort parameter is provided, use a default sorting
			query = query.sort("_id");
		}

		// ---------------- LIMITING ---------------- //
		if (req.query.fields) {
			// Separate the limit fields by space (ex. "type,name" becomes "type name")
			const fields = req.query.fields.split(",").join(" ");
			// Select only the specified fields from the query results
			query = query.select(fields);
		} else {
			// If no specific fields are requested, exclude the version field from the results
			query = query.select("-__v");
		}

		// ---------------- EXECUTE QUERY ---------------- //
		// Execute the query to fetch the slimes from the database
		const slimes = await query;

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
