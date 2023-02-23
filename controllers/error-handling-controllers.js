exports.nonExistentPath404 = (req, res, next) => {
  res.status(404).send({ msg: "Path Not Found" });
};

exports.customErrorHandler = (err, req, res, next) => {
  if ((err.code = "22P02")) {
    res.status(400).send({ message: "Invalid ID provided" });
  }
  if (err.status_code && err.message) {
    res.status(err.status_code).send({ message: err.message });
  } else next(err);
};

exports.errorHandler500 = (err, req, res, next) => {
  res.status(500).send({ msg: "Server Error" });
};

// if (err.code === "23503") {
//     res.status(404).send({ message: "Sorry, review ID not found" });
//   } else if ((err.code = "22P02")) {
//     res.status(400).send({ message: "Invalid ID provided" });
//   } else
