const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const Slime = require("../models/slimeModel");

dotenv.config({ path: "./config.env" });

// Set up connection to database
const DB = process.env.DATABASE.replace(
	"<PASSWORD>",
	process.env.DATABASE_PASSWORD
);

// mongoose.set("debug", true);

// Connect to MongoDB
mongoose
	.connect(DB)
	.then((con) => {
		// console.log(con.connections);
		console.log("Connected to MongoDB");
	})
	.catch((err) => {
		console.error("Error connecting to MongoDB", err);
	});

// Read json file
const slimes = JSON.parse(
	fs.readFileSync(path.join(__dirname, "slimes.json"), "utf-8")
);

// Import data to database
const importData = async () => {
	try {
		// Save slimes to the database
		await Slime.insertMany(slimes);

		process.exit();
	} catch (err) {
		console.log(err);
	}
};

// Delete all data from collection
const deleteData = async () => {
	try {
		await Slime.deleteMany({});
		console.log("Data successfully deleted!");
		process.exit();
	} catch (err) {
		console.log(err);
	}
};

// console.log(process.argv);
if (process.argv[2] === "--import") {
	importData();
} else if (process.argv[2] === "--delete") {
	deleteData();
}
