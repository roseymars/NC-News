const {
  selectTopics,
  selectArticleById,
  updateArticleVotes,
} = require("../models/models.js");
const { checkExists } = require("../models/models-utils.js");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.addArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  Promise.all([
    updateArticleVotes(inc_votes, article_id),
    checkExists("articles", "article_id", article_id),
  ])
    .then(( [article] ) => {
      res.status(200).send( { article });
    })
    .catch(next);
};
