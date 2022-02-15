exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status === 400 && err.msg === "Invalid ID given") {
        res.status(400).send({ msg: 'Invalid ID given' });
      } else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send( { msg: 'Invalid input' } )
  } 
  next(err)
}
// exports.handle500errors = (err, req, res, next) => {
  
// }

// handle server errors