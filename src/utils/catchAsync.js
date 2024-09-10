// Utility function to handle asynchronous errors in route handlers
// Instead of wrapping each async route handler in a try-catch block, use catchAsync to streamline error handling.
module.exports = (fn) => {
	return (req, res, next) => {
		// Execute the async function (fn) and catch any errors that occur.
		// If an error is thrown or a promise is rejected, it will be caught here.
		fn(req, res, next).catch(next);
	};
};
