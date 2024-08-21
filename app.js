const express = require("express");
const morgan = require("morgan");
const path = require("path");

// import routes when initialized
// ex. const userRouter = require('./routes/userRoutes');

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

// Declare routes when initialized
// ex. app.use('/api/v1/users', userRouter);

module.exports = app;
