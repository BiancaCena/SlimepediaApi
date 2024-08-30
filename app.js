const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const path = require("path");

// Import routes and error handling utilities
const slimeRouter = require("./routes/slimeRoutes");
const ErrorHandler = require("./utils/errorHandler");
const ErrorController = require("./controllers/errorController");

const app = express();

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
app.use(express.json({}));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Basic middleware to log request time
app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	console.log(`Request received at ${req.requestTime}`);
	next();
});

// Declare routes
app.use("/api", slimeRouter);

// Catch-all route for undefined routes
app.all("*", (req, res, next) => {
	next(new ErrorHandler(`Cannot find ${req.originalUrl} on this server.`, 404));
});

// Global error handling middleware
app.use(ErrorController);

module.exports = app;
