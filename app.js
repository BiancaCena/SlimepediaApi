const express = require("express");
const morgan = require("morgan");
const path = require("path");

// import routes
const slimeRouter = require("./routes/slimeRoutes");
const ErrorHandler = require("./utils/errorHandler");
const ErrorController = require("./controllers/errorController");

const app = express();

// Middleware for development logging
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// Middleware to parse JSON bodies
app.use(express.json());

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

// Error handling middleware
app.use(ErrorController);

module.exports = app;
