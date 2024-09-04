const express = require("express");
const slimeController = require("./../controllers/slimeController");

const slimeRouter = express.Router();

// Route to get all slimes
slimeRouter
	.route("/")
	.get(slimeController.getAllSlimes)
	.post(slimeController.createSlime);

// Route to handle a specific slime by Object ID
slimeRouter
	.route("/:id")
	.get(slimeController.getSlimeByObjectId) // Updated controller method for clarity
	.patch(slimeController.updateSlimeByObjectId)
	.delete(slimeController.deleteSlimeByObjectId);

// Route to get slimes by custom property (as a parameter)
slimeRouter
	.route("/:propertyName/:propertyValue")
	.get(slimeController.extractProperty, slimeController.getAllSlimes);

// Route to get list of slimes by location
slimeRouter.route("/by-location").get(slimeController.getSlimesByLocation);

// Route to get list of slimes by type
slimeRouter.route("/by-type").get(slimeController.getSlimesByType);

module.exports = slimeRouter;
