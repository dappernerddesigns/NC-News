const express = require("express");
const apiRouter = require("./routers/api.router");
const { catchAllErrors, handleServerErrors } = require("./errors/errors");
const app = express();

app.use("/api", apiRouter);
app.use(handleServerErrors);
module.exports = app;
