const { selectTopics } = require("../models/models.js");

exports.getTopics = (req, res, next) => {
  selectTopics(req).then((topics) => {
    res.status(200).send({ topics });
  }).catch((err) => {
      next(err)
  })
};
