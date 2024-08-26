const Slime = require("./../models/slimeModel");

exports.getAllSlimes = async (req, res) => {
	try {
		const slimes = await Slime.find();

		res.status(200).json({
			status: "success",
			requestedAt: req.requestTime,
			results: slimes.length,
			data: { slimes },
		});
	} catch (err) {
		res.status(404).json({
			status: "fail",
			message: err,
		});
	}
};

exports.getSlime = async (req, res) => {
	try {
		const slime = await Slime.findById(req.params.id);

		res.status(200).json({
			status: "success",
			requestedAt: req.requestTime,
			data: { slime },
		});
	} catch (err) {
		res.status(404).json({
			status: "fail",
			message: err,
		});
	}
};

exports.createSlime = async (req, res) => {
	try {
		const newSlime = await Slime.create(req.body);

		res.status(201).json({
			status: "success",
			data: {
				slime: newSlime,
			},
		});
	} catch (err) {
		res.status(400).json({
			status: "fail",
			message: err,
		});
	}
};

exports.updateSlime = async (req, res) => {
	try {
		const updatedSlime = await Slime.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true, // returns the new modified document rather than original.
				runValidators: true, // validate the update operation against the model's schema
			}
		);

		res.status(200).json({
			status: "success",
			data: {
				slime: updatedSlime,
			},
		});
	} catch (err) {
		res.status(404).json({
			status: "fail",
			message: err,
		});
	}
};

exports.deleteSlime = async (req, res) => {
	try {
		await Slime.findByIdAndDelete(req.params.id);

		res.status(204).json({
			status: "success",
			data: {
				slime: null,
			},
		});
	} catch (err) {
		res.status(404).json({
			status: "fail",
			message: err,
		});
	}
};
