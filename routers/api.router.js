const apiRouter = require("express").Router();
const topicRouter = require("./topics.router");

apiRouter.get("/", (req, res) => {
  res.status(200).send({ msg: "Server Running ok" });
});

apiRouter.use("/topics", topicRouter);

module.exports = apiRouter;
