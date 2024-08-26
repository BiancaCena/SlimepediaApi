const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const app = require("./app");

// Set up connection to database
const DB = process.env.DATABASE.replace(
	"<PASSWORD>",
	process.env.DATABASE_PASSWORD
);

mongoose
	.connect(DB)
	.then((con) => {
		// console.log(con.connections);
		console.log("Connected to MongoDB");
	})
	.catch((err) => {
		console.error("Error connecting to MongoDB", err);
	});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`App running on port ${port}...`);
});
