exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    // console.log(err)
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
};

exports.pathNotFound = (req, res) => {
  res.status(404).send({ msg: "PATH REQUESTED NOT FOUND" });
};

exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid input" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Invalid input" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "PATH REQUESTED NOT FOUND" });
  }
  next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};
