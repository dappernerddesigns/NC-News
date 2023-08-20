const topicRouter = require("express").Router();
const { getTopic } = require("../controllers/topics.controller");

topicRouter.route("/").get(getTopic);

module.exports = topicRouter;
