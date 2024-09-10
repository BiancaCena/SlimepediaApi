const mongoose = require("mongoose");
const {
	DIETS,
	FAVORITE_TOYS,
	FAVORITE_FOODS,
	SLIME_TYPES,
	SPAWN_LOCATIONS,
	GAME_IDS,
} = require("../constants/slimeConstants");

// Define schema
const slimeSchema = new mongoose.Schema({
	id: {
		type: String,
		required: [true, "A slime must have an id"],
		unique: true,
	},
	name: {
		type: String,
		required: [true, "A slime must have a name"],
		trim: true,
		maxlength: [30, "A slime name must be 30 characters or fewer"],
		minlength: [3, "A slime name must be at least 3 characters"],
	},
	image: {
		type: String,
		trim: true,
		maxlength: [255, "An image URL must be 255 characters or fewer"],
	},
	diet: {
		type: String,
		required: [true, "A slime must have a diet"],
		enum: {
			values: DIETS,
			message: `Diet must be one of the following: ${DIETS.join(", ")}`,
		},
	},
	favouriteToy: {
		type: String,
		enum: {
			values: FAVORITE_TOYS,
			message: `Favorite toy must be one of the following: ${FAVORITE_TOYS.join(
				", "
			)}`,
			default: "none",
		},
	},
	favouriteFood: {
		type: String,
		enum: {
			values: FAVORITE_FOODS,
			message: `Favorite food must be one of the following: ${FAVORITE_FOODS.join(
				", "
			)}`,
			default: "none",
		},
	},
	type: {
		type: String,
		required: [true, "A slime must have a type"],
		enum: {
			values: SLIME_TYPES,
			message: `Type must be one of the following: ${SLIME_TYPES.join(", ")}`,
		},
	},
	slimepedia: {
		slimeology: { type: String, trim: true, default: "" },
		risks: { type: String, trim: true, default: "" },
		plortonomics: { type: String, trim: true, default: "" },
	},
	locations: {
		type: [String],
		enum: {
			values: SPAWN_LOCATIONS,
			message: `Spawn location/s must be one of the following: ${SPAWN_LOCATIONS.join(
				", "
			)}`,
		},
		default: [],
	},
	properties: {
		type: [String],
		default: [],
	},
	games: {
		type: [Number],
		// Custom validation to ensure that each game ID provided is valid
		validate: {
			validator: function (value) {
				// Allow empty array or ensure all elements are valid game IDs
				return (
					// Validates empty array
					value.length === 0 ||
					// Check if every number in the array is included in GAME_IDS
					value.every((gameId) => GAME_IDS.includes(gameId))
				);
			},
			message: `Game/s must be one of the following: ${GAME_IDS.join(", ")}`,
		},
		default: [],
	},
});

// Create model based on schema
const Slime = mongoose.model("Slime", slimeSchema);

module.exports = Slime;
