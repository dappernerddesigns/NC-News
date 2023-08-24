const apiRouter = require("express").Router();
const { articlesRouter } = require("./articles.router");
const commentsRouter = require("./comments.router");
const topicRouter = require("./topics.router");
const userRouter = require("./users.router");

apiRouter.get("/", (req, res) => {
  res.status(200).send({ msg: "Server Running ok" });
});

apiRouter.use("/topics", topicRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/users", userRouter);
module.exports = apiRouter;
