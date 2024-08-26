const express = require("express");
const slimeController = require("./../controllers/slimeController");

const router = express.Router();

router
	.route("/")
	.get(slimeController.getAllSlimes)
	.post(slimeController.createSlime);

router
	.route("/:id")
	.get(slimeController.getSlime)
	.patch(slimeController.updateSlime)
	.delete(slimeController.deleteSlime);

module.exports = router;
