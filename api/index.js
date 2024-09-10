const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
	console.log("UNCAUGHT EXCEPTION! Shutting down...");
	console.log(err.name, err.message);
	process.exit(1);
});

dotenv.config({ path: "./src/config/config.env" });

const app = require("./../src/app");

const connectDB = async () => {
	// Set up connection to database
	const DB = process.env.DATABASE.replace(
		"<PASSWORD>",
		process.env.DATABASE_PASSWORD
	);

	// Set global Mongoose options
	mongoose.set("strictQuery", false);

	// Connect
	mongoose
		.connect(DB)
		.then((con) => {
			console.log("Connected to MongoDB");
		})
		.catch((err) => {
			console.error("Error connecting to MongoDB", err);
		});
};

if (mongoose.connection.readyState === 0) {
	// Connect to the database
	connectDB();
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
