exports.nonExistentPath404 = (req, res, next) => {
  res.status(404).send({ message: "Path Not Found" });
};

exports.customErrorHandler = (err, req, res, next) => {
  const psqlInvalidError = ["22P02"];
  const psqlNotFound = ["23503"];
  const psqlInvalidInput = ["42601", "42703", "23502"];
  if (err.status_code && err.message) {
    res.status(err.status_code).send({ message: err.message });
  } else if (psqlInvalidError.includes(err.code)) {
    res.status(400).send({ message: "Invalid ID provided" });
  } else if (psqlNotFound.includes(err.code)) {
    res.status(404).send({ message: "ID not found" });
  } else if (psqlInvalidInput.includes(err.code)) {
    res.status(400).send({ message: "Invalid input provided" });
  } else next(err);
};

exports.errorHandler500 = (err, req, res, next) => {
  res.status(500).send({ msg: "Server Error" });
};
