const QueryHandler = require("../utils/queryHandler");
const catchAsync = require("../utils/catchAsync");
const ErrorHandler = require("../utils/errorHandler");

// To get a single document by Object Id, wrapped with catchAsync
exports.getOneByObjectId = (Model) =>
	catchAsync(async (req, res, next) => {
		const document = await Model.findById(req.params.id);

		if (!document) {
			// If no document is found, create an instance of ErrorHandler and pass it to the error-handling middleware
			return next(
				new ErrorHandler("No document found with that object ID", 404)
			);
		}

		res.status(200).json({
			status: "success",
			requestedAt: req.requestTime,
			data: document,
		});
	});

// To get all documents, wrapped with catchAsync
exports.getAll = (Model) =>
	catchAsync(async (req, res, next) => {
		// Pass the query object and string
		const queryHandler = new QueryHandler(Model.find(), req.query)
			.filter()
			.sort()
			.limitFields()
			.paginate();

		// Execute the query to fetch the documents from the database
		const documents = await queryHandler.query;

		// Get pagination info
		const pagination = await queryHandler.getPaginationInfo(Model);

		// Send a successful response with the fetched data
		res.status(200).json({
			status: "success",
			requestedAt: req.requestTime,
			results: documents.length,
			pagination,
			data: documents,
		});
	});

/*
// To create a new document, wrapped with catchAsync
exports.createOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const document = await Model.create(req.body);

		res.status(201).json({
			status: "success",
			requestedAt: req.requestTime,
			data: document,
		});
	});

// To update an existing document by Object ID, wrapped with catchAsync
exports.updateOneByObjectId = (Model) =>
	catchAsync(async (req, res, next) => {
		const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
			new: true, // returns the new modified document rather than original.
			runValidators: true, // validate the update operation against the model's schema
		});

		if (!document) {
			// If no document is found, create an instance of ErrorHandler and pass it to next
			return next(new ErrorHandler("No document found with that ID", 404));
		}

		res.status(200).json({
			status: "success",
			requestedAt: req.requestTime,
			data: document,
		});
	});

// To delete a document by Object ID, wrapped with catchAsync
exports.deleteOneByObjectId = (Model) =>
	catchAsync(async (req, res) => {
		const document = await Model.findByIdAndDelete(req.params.id);

		if (!document) {
			// If no document is found, create an instance of ErrorHandler and pass it to next
			return next(new ErrorHandler("No document found with that ID", 404));
		}

		res.status(204).json({
			status: "success",
			requestedAt: req.requestTime,
			data: null,
		});
	});
*/
