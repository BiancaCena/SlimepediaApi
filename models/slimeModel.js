const mongoose = require("mongoose");

const slimeSchema = new mongoose.Schema(
	{
		_id: String,
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
				values: [
					"all",
					"meat",
					"veggie",
					"fruit",
					"water",
					"ash",
					"nectar",
					"other",
				],
				message:
					"Diet must be one of the following: all, meat, veggie, fruit, water, ash, nectar, other",
			},
		},
		favouriteToy: {
			type: String,
			enum: {
				values: [
					"beachball",
					"yarn",
					"bigrock",
					"nightlight",
					"bee",
					"ducky",
					"cell",
					"octo",
					"bomb",
					"chicken",
					"crystalball",
					"puzzlecube",
					"gyro",
					"brick",
					"solmate",
					"disco",
					"stegobuddy",
				],
				message:
					"Favorite toy must be one of the following: Beach Ball, Yarn Ball, Big Rock, Night Light, Buzzy Bee, Rubber Ducky, Power Cell, Octo Buddy, Bomb Ball, Stuffed Chicken, Crystal Ball, Puzzle Cube, Gyro Top, Charcoal Brick, Sol Mate, Disco Ball, Stego Buddy",
				default: "none",
			},
		},
		favouriteFood: {
			type: String,
			enum: [
				"none",
				"ranchers",
				"roostro",
				"elderroostro",
				"hen",
				"elderhen",
				"stonyhen",
				"briarhen",
				"paintedhen",
				"chickadoo",
				"stonychickadoo",
				"briarchickadoo",
				"paintedchickadoo",
				"pogo",
				"carrot",
				"beet",
				"cuberry",
				"mango",
				"oca",
				"onion",
				"lemon",
				"pear",
				"parsnip",
				"ginger",
				"kookadoba",
				"lettuce",
				"moondewnectar",
				"pomegranite",
				"seahen",
				"seachickadoo",
			],
			message:
				"Favorite food must be one of the following: Ranchers, Roostro, Elder Roostro, Hen Hen, Elder Hen, Stony Hen, Briar Hen, Painted Hen, Chickadoo, Stony Chickadoo, Briar Chickadoo, Painted Chickadoo, Pogo Fruit, Carrot, Heart Beet, Cuberry, Mint Mango, Oca Oca, Odd Onion, Quantum Lemon, Prickle Pear, Silver Parsnip, Gilded Ginger, Kookadoba, Water Lettuce, Moondew Nectar, Pomegranite, Sea Hen, Sea Chickadoo",
			default: "none",
		},
		type: {
			type: String,
			required: [true, "A slime must have a type"],
			enum: {
				values: ["docile", "harmful", "hostile", "special"],
				message:
					"Type must be one of the following: docile, harmful, hostile, special",
			},
		},
		slimepedia: {
			slimeology: { type: String, trim: true, default: "" },
			risks: { type: String, trim: true, default: "" },
			plortonomics: { type: String, trim: true, default: "" },
		},
		locations: {
			type: [String],
			default: [],
		},
		properties: {
			type: [String],
			default: [],
		},
		games: {
			type: [Number],
			default: [],
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// Create model based on schema
const Slime = mongoose.model("Slime", slimeSchema);

module.exports = Slime;
