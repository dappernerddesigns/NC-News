exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
  const invalidDataType = "22P02";
  const notNullViolation = "23502";
  const violateForeignKey = "23503";

  if (err.code === invalidDataType || err.code === notNullViolation) {
    res.status(400).send({ msg: "Invalid input" });
  } else if (err.code === violateForeignKey) {
    res.status(404).send({ msg: "Resource not found" });
  } else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
};
