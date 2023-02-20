exports.errorHandler404 = (err, req, res, next) => {
  res.status(404).send({ msg: "Not Found" });
};

exports.errorHandler500 = (err, req, res, next) => {
  res.status(500).send({ msg: "Server Error" });
};
