// Import dependencies
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const path = require("path");
const compression = require("compression");

// Import routes and error handling utilities
const apiRouter = require("./routes/apiRoutes");
const ErrorHandler = require("./utils/errorHandler");
const ErrorController = require("./controllers/errorController");

// Initialize Express app
const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Set security HTTP headers
app.use(helmet());

// Middleware for logging HTTP requests in development environment
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// Rate limiter middleware to limit API requests per IP
const limiter = rateLimit({
	// Allow up to 100 requests per IP address per hour
	max: 100,
	windowMs: 60 * 60 * 1000, // 1 hour in milliseconds
	message: "Too many requests from this IP, please try again in an hour.",
});
app.use("/api", limiter);

// Middleware to parse incoming JSON requests
app.use(express.json());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Prevent parameter pollution
app.use(
	hpp({
		whitelist: [
			"_id",
			"id",
			"name",
			"diet",
			"favouriteFood",
			"type",
			"locations",
			"games",
		],
	})
);

// Middleware to automatically compress HTTP responses to improve performance and reduce bandwidth usage.
app.use(compression());

// Basic middleware to log request time
app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	console.log(`Request received at ${req.requestTime}`);
	next();
});

// Declare routes
app.use("/api", apiRouter);

// Catch-all route for undefined routes
app.all("*", (req, res, next) => {
	next(new ErrorHandler(`Cannot find ${req.originalUrl} on this server.`, 404));
});

// Global error handling middleware
app.use(ErrorController);

// Export the app
module.exports = app;
