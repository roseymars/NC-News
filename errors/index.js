exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status === 404 && err.msg === "Resource not found") {
    res.status(404).send({ msg: "PATH REQUESTED NOT FOUND" });
  } else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid input" });
  }
  next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  if (err.status === 500) res.status(500).send( { msg: 'Internal Server Error'})
}
// exports.handle500errors = (err, req, res, next) => {

// }

// handle server errors
