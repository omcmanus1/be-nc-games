const apiRouter = require("express").Router();

const { getEndpoints } = require("../controllers/endpoints-controllers");

apiRouter.get("/", getEndpoints);

module.exports = apiRouter;
