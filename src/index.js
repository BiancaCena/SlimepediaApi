// Import dependencies
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const path = require("path");
const compression = require("compression");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Import routes and error handling utilities
const apiRouter = require("./routes/apiRoutes");
const ErrorHandler = require("./utils/errorHandler");
const ErrorController = require("./controllers/errorController");

process.on("uncaughtException", (err) => {
	console.log("UNCAUGHT EXCEPTION! Shutting down...");
	console.log(err.name, err.message);
	process.exit(1);
});

dotenv.config({ path: "./src/config/config.env" });

// Initialize Express app
const app = express();

// Trust the first proxy
app.set("trust proxy", 1);

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

// Apply rate limiting to all requests
app.use(limiter);

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
app.use("/", apiRouter);

// Catch-all route for undefined routes
app.all("*", (req, res, next) => {
	next(new ErrorHandler(`Cannot find ${req.originalUrl} on this server.`, 404));
});

// Global error handling middleware
app.use(ErrorController);

// Connect to the database
if (mongoose.connection.readyState === 0) {
	// Set up connection to database
	const DB = process.env.DATABASE.replace(
		"<PASSWORD>",
		process.env.DATABASE_PASSWORD
	);

	// Set global Mongoose options
	mongoose.set("strictQuery", false);

	// Connect to the database
	mongoose
		.connect(DB)
		.then((con) => {
			console.log("Connected to MongoDB");
		})
		.catch((err) => {
			console.error("Error connecting to MongoDB", err);
		});
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`App running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
	console.log("UNHANDLED REJECTION! Shutting down...");
	console.log(err.name, err.message);
	server.close(() => {
		process.exit(1);
	});
});

// Export the Express API
module.exports = app;
