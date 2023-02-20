exports.errorHandler500 = (err, req, res, next) => {
  res.status(500).send({ msg: "Server Error" });
};
