exports.nonExistentPath404 = (req, res, next) => {
  res.status(404).send({ msg: "Path Not Found" });
};

exports.customErrorHandler = (err, req, res, next) => {
  if (err.msg === "Invalid ID provided" || "ID not found") {
    res.status(err.status_code).send({ msg: err.msg });
  } else next(err);
};

exports.errorHandler500 = (err, req, res, next) => {
  res.status(500).send({ msg: "Server Error" });
};
