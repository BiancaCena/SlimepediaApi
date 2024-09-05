const express = require("express");
const slimeRouter = require("./slimeRoutes"); // Adjust the path as necessary

const apiRouter = express.Router();

// Mount the slime router
apiRouter.use("/slimes", slimeRouter);

module.exports = apiRouter;
