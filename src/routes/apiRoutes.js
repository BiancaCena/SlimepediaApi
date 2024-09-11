const express = require("express");
const slimeRouter = require("./slimeRoutes"); // Adjust the path as necessary

const apiRouter = express.Router();

// Mount the slime router under `/api`
apiRouter.use("/api", slimeRouter);

module.exports = apiRouter;
