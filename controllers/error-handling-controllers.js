exports.nonExistentPath404 = (req, res, next) => {
  res.status(404).send({ msg: "Path Not Found" });
};

exports.errorHandler400 = (err, req, res, next) => {
  if (err === "Invalid ID provided") {
    res.status(400).send({ msg: err });
  } else next(err);
};

exports.errorHandler404 = (err, req, res, next) => {
  if (err === "ID not found") {
    res.status(404).send({ msg: err });
  } else next(err);
};

exports.errorHandler500 = (err, req, res, next) => {
  res.status(500).send({ msg: "Server Error" });
};
