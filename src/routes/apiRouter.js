const express = require("express");
const slimeRouter = require("./slimeRouter"); // Adjust the path as necessary

const apiRouter = express.Router();

// Mount the slime router under `/api/slimes`
apiRouter.use("/api/slimes", slimeRouter);

module.exports = apiRouter;
