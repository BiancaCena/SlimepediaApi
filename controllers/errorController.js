const mongoose = require("mongoose");
const ErrorHandler = require("../utils/errorHandler");

// Handle Mongoose CastError by creating a formatted ErrorHandler instance
const handleCastErrorDB = (err) => {
	const message = `Invalid ${err.path}: ${err.value}`;
	return new ErrorHandler(message, 400);
};

// Handle Mongoose ValidationError and return a formatted ErrorHandler instance
const handleValidationErrorDB = (err) => {
	const errors = Object.values(err.errors).map((el) => el.message);

	const message = `Invalid input data. ${errors.join(". ")}`;
	return new ErrorHandler(message, 400);
};

// Handle MongoDB duplicate key errors and return a formatted ErrorHandler instance
const handleDuplicateFieldsDB = (err) => {
	// Extract the duplicate field value from the error message
	const value = err.errorResponse.errmsg.match(/(["'])(\\?.)*?\1/)[0];
	const message = `Duplicate field value: ${value}. Please use another value!`;
	return new ErrorHandler(message, 400);
};

// Send error response in development mode with detailed error info
const sendErrorDevelopment = (err, res) => {
	res.status(err.statusCode).json({
		status: err.statusCode,
		// Full error details for debugging
		error: err,
		message: err.message,
		// Stack trace for debugging
		stack: err.stack,
	});
};

// Send error response in production mode with user-friendly messages
const sendErrorProduction = (err, res) => {
	console.log("Error in Production:", err);

	if (err.isOperational) {
		// Operational errors: known errors handled by the application
		res.status(err.statusCode).json({
			status: err.statusCode,
			message: err.message,
		});
	} else {
		// Programming errors: unexpected or unknown errors
		console.error("ERROR", err);

		// Send generic message
		res.status(500).json({
			status: "error",
			message: "Something went wrong!",
		});
	}
};

// Main error handling middleware
module.exports = (err, req, res, next) => {
	// Default to 500 if no status code is set
	err.statusCode = err.statusCode || 500;
	// Default to "error" if no status is set
	err.status = err.status || "error";

	if (process.env.NODE_ENV === "development") {
		// Send detailed error info in development mode
		sendErrorDevelopment(err, res);
	} else if (process.env.NODE_ENV === "production") {
		// Clone the error object for manipulation
		let error = { ...err };

		// Handle Mongoose-specific errors
		if (err instanceof mongoose.Error.CastError) {
			error = handleCastErrorDB(error);
		}
		if (err instanceof mongoose.Error.ValidationError) {
			error = handleValidationErrorDB(error);
		}

		// Handle MongoDB duplicate key errors
		if (err.code === 11000) {
			error = handleDuplicateFieldsDB(error);
		}

		// Pass error
		sendErrorProduction(error, res);
	}
};
