const express = require("express");
const slimeController = require("./../controllers/slimeController");

const router = express.Router();

// Default route
router
	.route("/")
	.get(slimeController.getAllSlimes)
	.post(slimeController.createSlime);

// Route to get all slimes (general listing)
router
	.route("/slimes")
	.get(slimeController.getAllSlimes)
	.post(slimeController.createSlime);

// Middleware to alias route parameters
router
	.route("/game/:gameId/slimes")
	.get(slimeController.extractGameId, slimeController.getAllSlimes);

// Route to handle a specific slime by ID
router
	.route("/slimes/:id")
	.get(slimeController.getSlime)
	.patch(slimeController.updateSlime)
	.delete(slimeController.deleteSlime);

// Route to get list of slimes by location
router.route("/slimes-by-location").get(slimeController.getSlimesByLocation);

// Route to get list of slimes by type
router.route("/slimes-by-type").get(slimeController.getSlimesByType);

module.exports = router;
