const express = require("express");
const apiRouter = require("./routers/api.router");
const { handleServerErrors } = require("./errors/errors");
const app = express();

app.use("/api", apiRouter);
app.use((err, req, res, next) => {
  if (err) {
    console.log(err);
  }
});
app.use(handleServerErrors);
module.exports = app;
