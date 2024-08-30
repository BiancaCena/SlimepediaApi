class ErrorHandler extends Error {
	constructor(message, statusCode) {
		// Call the parent class (Error) constructor with the error message
		super(message);

		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
		this.isOperational = true;

		// Capture stack trace excluding the ErrorHandler constructor
		Error.captureStackTrace(this, this.constructor);
	}
}

module.exports = ErrorHandler;
